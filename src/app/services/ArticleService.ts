import axios from "axios";
import { serverApi } from "../../lib/config";
import { Article } from "../../lib/types/article";

/**
 * GET /article/all has no pagination or category filtering support at
 * all — confirmed live against the real backend, not assumed (see
 * docs/ai/NEXT_STEPS.md, backend repo). It always returns every
 * published article, unfiltered. So unlike ProductService.getProducts,
 * this takes no query params — there's nothing real to send. Any
 * pagination/filtering in the UI is real client-side work over this
 * one full, honest response, not a call this endpoint can't actually
 * satisfy.
 */
class ArticleService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getArticles(): Promise<Article[]> {
    try {
      const url = `${this.path}/article/all`;
      const result = await axios.get(url);
      console.log("getArticles:", result);
      return result.data;
    } catch (err) {
      console.log("Error, getArticles:", err);
      throw err;
    }
  }

  public async getArticle(slug: string): Promise<Article> {
    try {
      const url = `${this.path}/article/${slug}`;
      const result = await axios.get(url);
      console.log("getArticle:", result);
      return result.data;
    } catch (err) {
      console.log("Error, getArticle:", err);
      throw err;
    }
  }
}

export default ArticleService;
