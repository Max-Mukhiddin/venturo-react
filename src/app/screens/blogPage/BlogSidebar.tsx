import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Article } from "../../../lib/types/article";
import { ArticleCategory } from "../../../lib/enums/article.enum";
import { serverApi } from "../../../lib/config";

/**
 * Shared sidebar for BlogList/BlogDetail — Figma "HikMali" node 2465:2715
 * (Blog List) / 2470:109 (Blog Detail), both use the identical sidebar.
 *
 * Real-data-only, same discipline as every prior page:
 *   - "Recent Posts": the 3 most recent real articles (already sorted
 *     `createdAt` desc by the backend), real thumbnail when
 *     `article.image` is present, else the shared no-image fallback.
 *   - "Category": real `ArticleCategory` values with real counts,
 *     computed from the already-fetched full article list — not
 *     Figma's fabricated "05/23/27/35/45".
 *   - "Tags" (Trekking Poles/Back Bag/Boots/etc.): no real field on
 *     `Article` at all — omitted entirely, not invented.
 *   - Search box: real client-side search/filter, wired by the parent
 *     (`onSearch`) — honest, since it filters the one real full list
 *     already fetched, not a fake backend call (GET /article/all has
 *     no search param).
 *   - "Upto 50% Off" promo banner: the discount number is the same
 *     class of fabricated-marketing-figure already dropped everywhere
 *     else in this project (no discount field anywhere on `Product`
 *     either). Reused the real photo + real "Shop Now" → /products
 *     link from the Shop Detail bottom banner instead of inventing a
 *     new claim.
 */
const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  [ArticleCategory.GEAR_GUIDES]: "Gear Guides",
  [ArticleCategory.TRIP_REPORTS]: "Trip Reports",
  [ArticleCategory.NEWS]: "News",
  [ArticleCategory.TIPS]: "Tips",
};

interface BlogSidebarProps {
  articles: Article[];
  onSearch: (term: string) => void;
  onCategorySelect: (category: ArticleCategory) => void;
  activeCategory?: ArticleCategory | null;
}

export default function BlogSidebar({
  articles,
  onSearch,
  onCategorySelect,
  activeCategory,
}: BlogSidebarProps) {
  const [searchInput, setSearchInput] = useState("");

  const recentPosts = [...articles]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  const categoryCounts = (Object.values(ArticleCategory) as ArticleCategory[]).map(
    (category) => ({
      category,
      label: CATEGORY_LABELS[category],
      count: articles.filter((article) => article.category === category).length,
    })
  );

  const submitSearchHandler = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(searchInput.trim());
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <aside className={"blog-sidebar"}>
      <form className={"blog-search"} onSubmit={submitSearchHandler}>
        <input
          type={"text"}
          placeholder={"Search keyword"}
          aria-label={"Search articles"}
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <button type={"submit"} aria-label={"Search"}>
          <img src={"/icons/hm-search.svg"} alt={""} />
        </button>
      </form>

      <div className={"blog-sidebar-block"}>
        <h3 className={"blog-sidebar-title"}>Recent Posts</h3>
        <ul className={"blog-recent-list"}>
          {recentPosts.map((post) => (
            <li key={post._id}>
              <Link to={`/blog/${post.slug}`} className={"blog-recent-item"}>
                <span className={"blog-recent-thumb"}>
                  <img
                    src={
                      post.image
                        ? `${serverApi}/${post.image}`
                        : "/icons/noimage-list.svg"
                    }
                    alt={post.title}
                  />
                </span>
                <span className={"blog-recent-info"}>
                  <span className={"blog-recent-date"}>
                    {formatDate(post.createdAt)}
                  </span>
                  <span className={"blog-recent-title"}>{post.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={"blog-sidebar-block"}>
        <h3 className={"blog-sidebar-title"}>Category</h3>
        <ul className={"blog-category-list"}>
          {categoryCounts.map(({ category, label, count }) => (
            <li key={category}>
              <button
                type={"button"}
                className={
                  activeCategory === category
                    ? "blog-category-link blog-category-link-active"
                    : "blog-category-link"
                }
                onClick={() => onCategorySelect(category)}
              >
                <span>{label}</span>
                <span className={"blog-category-count"}>{count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Link to={"/products"} className={"blog-promo"}>
        <span
          className={"blog-promo-media"}
          style={{ backgroundImage: "url(/img/shop-detail-banner.jpg)" }}
        />
        <span className={"blog-promo-overlay"}>
          <span className={"blog-promo-heading"}>
            Best Enjoyed
            <br />
            Outside
          </span>
          <span className={"blog-promo-cta"}>Shop Now</span>
        </span>
      </Link>
    </aside>
  );
}
