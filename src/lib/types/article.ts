import { ArticleCategory, ArticleStatus } from "../enums/article.enum";

/**
 * Mirrors the real backend Article schema exactly (title, slug, content,
 * category, status, image, timestamps) — no author/readTime/commentCount
 * fields exist on the real model, so none are declared here. See
 * ArticleService.ts / BlogList.tsx / BlogDetail.tsx for how the Figma
 * design's fabricated fields (comment counts, tags, a named reader quote)
 * were resolved. `image` is a single optional path (e.g.
 * "uploads/articles/<uuid>.jpg"), same shape as Product's per-item entries
 * in `productImages`, but singular since Article is one-image-per-post.
 */
export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  category: ArticleCategory;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
}
