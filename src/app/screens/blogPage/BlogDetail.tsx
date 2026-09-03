import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumb";
import BlogSidebar from "./BlogSidebar";
import ArticleService from "../../services/ArticleService";
import { Article } from "../../../lib/types/article";
import { ArticleCategory } from "../../../lib/enums/article.enum";

/**
 * Blog Detail — Figma "HikMali" node 2470:109.
 *
 * Fetches the one real full article list (needed for the shared sidebar
 * and for real Previous/Next navigation anyway) and derives the current
 * article from it by slug — GET /article/all and GET /article/:slug
 * apply the identical PUBLISHED-only filter, so this is equivalent to a
 * second real request, without one.
 *
 * Fabricated-content decisions, same standard as everywhere else in
 * this project (real Article fields only — title, slug, content,
 * category, createdAt):
 *   - Hero/secondary in-article images — no `image` field on `Article`;
 *     the shared /icons/noimage-list.svg fallback is used instead of a
 *     stock photo standing in for a "real" article photo.
 *   - "42 Comments" — no comment system exists — omitted.
 *   - The named reader quote block ("Maecenas tincidunt... — Emma
 *     White, Los Angeles, CA") — a specific fabricated person with a
 *     fabricated quote, not just missing data — omitted entirely, same
 *     precedent as dropping the admin-info block shown to Shop Detail
 *     customers in an earlier session.
 *   - The 7-item bullet "key points" list — no structured-content field
 *     exists to derive real bullets from a single plain-text `content`
 *     field — omitted rather than invented.
 *   - "Tags" (Trekking Poles/Back Bag/Boots) — no real field — omitted,
 *     same as BlogList's sidebar.
 *   - Previous/Next post thumbnails — same no-image-field gap; titles
 *     and links are real (derived from the real fetched list's real
 *     sort order), thumbnails use the same fallback icon.
 */
export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const articleService = new ArticleService();
    setIsLoading(true);
    setLoadError(false);
    articleService
      .getArticles()
      .then((data) => setArticles(data))
      .catch((err) => {
        console.log("Error, BlogDetail:", err);
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const currentIndex = articles.findIndex((article) => article.slug === slug);
  const article = currentIndex >= 0 ? articles[currentIndex] : null;
  const previousPost = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  const CATEGORY_LABELS: Record<ArticleCategory, string> = {
    [ArticleCategory.GEAR_GUIDES]: "Gear Guides",
    [ArticleCategory.TRIP_REPORTS]: "Trip Reports",
    [ArticleCategory.NEWS]: "News",
    [ArticleCategory.TIPS]: "Tips",
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const searchHandler = (term: string) => {
    history.push(term ? `/blog?search=${encodeURIComponent(term)}` : "/blog");
  };

  const categoryHandler = (category: ArticleCategory) => {
    history.push(`/blog?category=${category}`);
  };

  return (
    <div className={"blog-page"}>
      <Breadcrumb
        heading={"Blog Detail"}
        trail={[{ label: "Home", to: "/" }, { label: "Blog Detail" }]}
      />

      <div className={"blog-inner"}>
        <div className={"blog-layout"}>
          <main className={"blog-main blog-detail-main"}>
            {isLoading ? (
              <p className={"blog-status"}>Loading article…</p>
            ) : loadError ? (
              <p className={"blog-status"}>
                This article could not be loaded right now.
              </p>
            ) : !article ? (
              <p className={"blog-status"}>
                That article doesn&apos;t exist or isn&apos;t published.{" "}
                <Link to={"/blog"}>Back to Blog List</Link>
              </p>
            ) : (
              <>
                <div className={"blog-detail-hero"}>
                  <img src={"/icons/noimage-list.svg"} alt={""} />
                </div>

                <div className={"blog-card-meta"}>
                  <span>{formatDate(article.createdAt)}</span>
                  <span className={"blog-detail-category"}>
                    {CATEGORY_LABELS[article.category]}
                  </span>
                </div>

                <h1 className={"blog-detail-title"}>{article.title}</h1>

                <p className={"blog-detail-content"}>{article.content}</p>

                {previousPost || nextPost ? (
                  <div className={"blog-prevnext"}>
                    {previousPost ? (
                      <Link
                        to={`/blog/${previousPost.slug}`}
                        className={"blog-prevnext-link"}
                      >
                        <span className={"blog-prevnext-thumb"}>
                          <img src={"/icons/noimage-list.svg"} alt={""} />
                        </span>
                        <span className={"blog-prevnext-text"}>
                          <span className={"blog-prevnext-title"}>
                            {previousPost.title}
                          </span>
                          <span className={"blog-prevnext-label"}>
                            Previous post
                          </span>
                        </span>
                      </Link>
                    ) : (
                      <span />
                    )}
                    {nextPost ? (
                      <Link
                        to={`/blog/${nextPost.slug}`}
                        className={"blog-prevnext-link blog-prevnext-link-next"}
                      >
                        <span className={"blog-prevnext-text"}>
                          <span className={"blog-prevnext-title"}>
                            {nextPost.title}
                          </span>
                          <span className={"blog-prevnext-label"}>
                            Next post
                          </span>
                        </span>
                        <span className={"blog-prevnext-thumb"}>
                          <img src={"/icons/noimage-list.svg"} alt={""} />
                        </span>
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </main>

          <BlogSidebar
            articles={articles}
            onSearch={searchHandler}
            onCategorySelect={categoryHandler}
            activeCategory={null}
          />
        </div>
      </div>
    </div>
  );
}
