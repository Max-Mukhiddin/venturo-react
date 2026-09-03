export interface WishlistProduct {
  _id: string;
  productName: string;
  productPrice: number;
  productImages: string[];
  productCollection: string;
  productLeftCount: number;
  productStatus: string;
  productViews: number;
  averageRating: number;
  reviewCount: number;
}

export interface WishlistItem {
  _id: string;
  memberId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  productData: WishlistProduct[];
}
