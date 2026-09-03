import React from "react";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

interface BestProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onOpen?: (productId: string) => void;
}

export default function BestProductCard({
  product,
  onAdd,
  onOpen,
}: BestProductCardProps) {
  const imagePath = product.productImages[0]
    ? `${serverApi}/${product.productImages[0]}`
    : "/icons/noimage-list.svg";
  const outOfStock = product.productLeftCount <= 0;
  const content = (
    <>
      <div className="bp-card-info">
        <span className="bp-card-name">{product.productName}</span>
      </div>
      <div className="bp-card-media">
        <img src={imagePath} alt={product.productName} />
        <div className="bp-card-overlay">
          {product.productDesc ? (
            <span className="bp-card-desc">{product.productDesc}</span>
          ) : null}
        </div>
      </div>
    </>
  );

  return (
    <article className="bp-card">
      {onOpen ? (
        <button
          type="button"
          className="bp-card-main"
          onClick={() => onOpen(product._id)}
          aria-label={`View ${product.productName}`}
        >
          {content}
        </button>
      ) : (
        content
      )}
      <button
        type="button"
        className="bp-add"
        disabled={outOfStock}
        onClick={() => onAdd(product)}
      >
        <span>{outOfStock ? "Out of Stock" : "Add To Cart"}</span>
        {!outOfStock ? <span className="bp-add-price">| ${product.productPrice}</span> : null}
      </button>
    </article>
  );
}
