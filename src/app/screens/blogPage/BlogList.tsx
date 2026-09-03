import React, { useEffect, useMemo, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumb";
import BlogSidebar from "./BlogSidebar";
import ArticleService from "../../services/ArticleService";
import { Article } from "../../../lib/types/article";
import { ArticleCategory } from "../../../lib/enums/article.enum";
import { serverApi } from "../../../lib/config";

/**
 * Blog List — Figma "HikMali" node 2465:2715. No mobile Blog List/Blog
 * Detail frame exists in this file (confirmed — only the 5 homepage
 * sections have "mob" siblings), so mobile uses the same conservative
 * fluid step-down convention already established for Shop List/Shop
 * Detail rather than a verified Figma value.
 *
 * GET /article/all has no pagination or category filtering at all —
 * confirmed live (see docs/ai/NEXT_STEPS.md, backend repo). With only 6
 * real articles today, this fetches the one real full list once and
 * does everything else (search, category filter, pagination) as real
 * client-side work over it — never implying more data exists than the
 * real 6 articles. Figma's "1 2 3" pager and "Showing 1-15 of 50"-style
 * assumption don't apply; page count here is always the real
 * ceil(filteredCount / postsPerPage).
 *
 * Fabricated-content decisions (no real Article field exists for any
 * of these): "42 Comments" — omitted.
 *
 * Per-post thumbnail images: `Article` now has a real optional `image`
 * field (backend added it to support real per-article photography,
 * mirroring how `Product.productImages[0]` already works). Renders the
 * real photo when present, using the exact same
 * `serverApi`/`${serverApi}/${image}` : "/icons/noimage-list.svg"
 * fallback pattern already used everywhere else on the site — falls
 * back to the shared no-image icon for any article without one, rather
 * than assuming every article has a photo.
 */
const POSTS_PER_PAGE = 3;

function useQueryParams() {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search), [location.search]);
}

export default function BlogList() {
  const history = useHistory();
  const params = useQueryParams();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState(params.get("search") || "");
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | null>(
    (params.get("category") as ArticleCategory) || null
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    const articleService = new ArticleService();
    setIsLoading(true);
    setLoadError(false);
    articleService
      .getArticles()
      .then((data) => setArticles(data))
      .catch((err) => {
        console.log("Error, BlogList:", err);
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Re-seed filters if arriving via a sidebar link from BlogDetail
  // (?search=/?category=), same URL-seeded-initial-state pattern
  // already used by Products.tsx.
  useEffect(() => {
    setSearchTerm(params.get("search") || "");
    setActiveCategory((params.get("category") as ArticleCategory) || null);
    setPage(1);
  }, [params]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory = activeCategory
        ? article.category === activeCategory
        : true;
      const matchesSearch = searchTerm
        ? article.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(filteredArticles.length / POSTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount);
  const pagedArticles = filteredArticles.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const searchHandler = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    history.replace(term ? `/blog?search=${encodeURIComponent(term)}` : "/blog");
  };

  const categoryHandler = (category: ArticleCategory) => {
    const next = activeCategory === category ? null : category;
    setActiveCategory(next);
    setPage(1);
    history.replace(next ? `/blog?category=${next}` : "/blog");
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const excerpt = (content: string, maxLength = 220) =>
    content.length > maxLength
      ? `${content.slice(0, maxLength).trim()}…`
      : content;

  return (
    <div className={"blog-page"}>
      <Breadcrumb
        heading={"Blog List"}
        trail={[{ label: "Home", to: "/" }, { label: "Blog List" }]}
      />

      <div className={"blog-inner"}>
        <div className={"blog-layout"}>
          <main className={"blog-main"}>
            {isLoading ? (
              <p className={"blog-status"}>Loading articles…</p>
            ) : loadError ? (
              <p className={"blog-status"}>
                Articles could not be loaded right now.
              </p>
            ) : filteredArticles.length === 0 ? (
              <p className={"blog-status"}>No articles match yet.</p>
            ) : (
              <>
                {pagedArticles.map((article) => (
                  <article key={article._id} className={"blog-card"}>
                    <div className={"blog-card-thumb"}>
                      <img
                        src={
                          article.image
                            ? `${serverApi}/${article.image}`
                            : "/icons/noimage-list.svg"
                        }
                        alt={article.title}
                      />
                    </div>
                    <div className={"blog-card-meta"}>
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                    <h2 className={"blog-card-title"}>{article.title}</h2>
                    <p className={"blog-card-excerpt"}>
                      {excerpt(article.content)}
                    </p>
                    <Link
                      to={`/blog/${article.slug}`}
                      className={"blog-card-readmore"}
                    >
                      Read More
                    </Link>
                  </article>
                ))}

                {pageCount > 1 ? (
                  <nav className={"blog-pagination"} aria-label={"Blog pages"}>
                    <button
                      type={"button"}
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    {Array.from({ length: pageCount }).map((_, index) => (
                      <button
                        key={index}
                        type={"button"}
                        className={
                          currentPage === index + 1
                            ? "blog-page-number blog-page-number-active"
                            : "blog-page-number"
                        }
                        onClick={() => setPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      type={"button"}
                      disabled={currentPage >= pageCount}
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    >
                      Next
                    </button>
                  </nav>
                ) : null}
              </>
            )}
          </main>

          <BlogSidebar
            articles={articles}
            onSearch={searchHandler}
            onCategorySelect={categoryHandler}
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </div>
  );
}
