import axios from "axios";
import { serverApi } from "../../lib/config";
import { WishlistItem } from "../../lib/types/wishlist";

export default class WishlistService {
  public async getWishlist(): Promise<WishlistItem[]> {
    const result = await axios.get(`${serverApi}/wishlist/all`, {
      withCredentials: true,
    });
    return result.data;
  }

  public async removeFromWishlist(productId: string): Promise<{ removed: boolean }> {
    const result = await axios.post(
      `${serverApi}/wishlist/remove`,
      { productId },
      { withCredentials: true }
    );
    return result.data;
  }
}
