import React, { useEffect, useState } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./slice";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { retrieveProducts } from "./selector";
import { createSelector } from "reselect";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import Breadcrumb from "../../components/breadcrumb";
import FreeShipping from "../homePage/FreeShipping";

const CATEGORY_FILTERS: { label: string; value?: ProductCollection }[] = [
  { label: "All" },
  { label: "Climbing", value: ProductCollection.CLIMBING },
  { label: "Camping", value: ProductCollection.CAMPING },
  { label: "Hiking", value: ProductCollection.HIKING },
  { label: "Trekking", value: ProductCollection.TREKKING },
  { label: "Cycling", value: ProductCollection.CYCLING },
  { label: "Apparel", value: ProductCollection.APPAREL },
  { label: "Footwear", value: ProductCollection.FOOTWEAR },
  { label: "Other", value: ProductCollection.OTHER },
];

const SORT_OPTIONS = [
  { label: "Newest", order: "createdAt", sortDirection: "DESC" as const },
  {
    label: "Price: Low to High",
    order: "productPrice",
    sortDirection: "ASC" as const,
  },
  {
    label: "Price: High to Low",
    order: "productPrice",
    sortDirection: "DESC" as const,
  },
  {
    label: "Most Viewed",
    order: "productViews",
    sortDirection: "DESC" as const,
  },
  {
    label: "Top Rated",
    order: "averageRating",
    sortDirection: "DESC" as const,
  },
];

const DEFAULT_SORT = SORT_OPTIONS[0];

const parseInitialProductSearch = (search: string): ProductInquiry => {
  const params = new URLSearchParams(search);
  const collectionParam = params.get("productCollection");
  const orderParam = params.get("order");
  const isValidCollection =
    !!collectionParam &&
    (Object.values(ProductCollection) as string[]).includes(collectionParam);
  const selectedSort = SORT_OPTIONS.find((option) => option.order === orderParam);

  return {
    order: selectedSort?.order || DEFAULT_SORT.order,
    sortDirection: selectedSort?.sortDirection || DEFAULT_SORT.sortDirection,
    page: 1,
    limit: 12,
    ...(isValidCollection
      ? { productCollection: collectionParam as ProductCollection }
      : {}),
    search: "",
  };
};

const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products({ onAdd }: ProductsProps) {
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const location = useLocation();
  const history = useHistory();
  const [productSearch, setProductSearch] = useState<ProductInquiry>(() =>
    parseInitialProductSearch(location.search)
  );
  const [searchText, setSearchText] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setProductSearch(parseInitialProductSearch(location.search));
    setSearchText("");
  }, [location.search]);

  useEffect(() => {
    const productService = new ProductService();
    setIsLoading(true);
    setLoadError(false);

    productService
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => {
        console.log(err);
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));
  }, [productSearch]);

  const updateFilters = (updates: Partial<ProductInquiry>) => {
    setProductSearch((previous) => ({ ...previous, page: 1, ...updates }));
  };

  const searchProductHandler = (event: React.FormEvent) => {
    event.preventDefault();
    updateFilters({ search: searchText });
  };

  const chooseProductHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  const addToCartHandler = (product: Product) => {
    if (product.productLeftCount <= 0) return;

    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0] || "",
    });
  };

  const selectedSortValue = `${productSearch.order}:${productSearch.sortDirection}`;
  const canGoPrevious = productSearch.page > 1;
  const canGoNext = products.length >= productSearch.limit;

  return (
    <div className="products sl-page">
      <Breadcrumb
        heading="Shop"
        trail={[{ label: "Home", to: "/" }, { label: "Shop" }]}
      />

      <main className="sl-content">
        <section className="sl-toolbar" aria-label="Product controls">
          <p className="sl-result-count" aria-live="polite">
            {productSearch.page > 1 ? `Page ${productSearch.page} · ` : ""}
            {products.length} Product{products.length === 1 ? "" : "s"}
          </p>

          <div className="sl-toolbar-actions">
            <button
              type="button"
              className="sl-toolbar-search"
              aria-label="Search products"
              aria-controls="shop-list-filters"
              onClick={() => setFiltersOpen(true)}
            />
            <button
              type="button"
              className="sl-filter-button"
              aria-expanded={filtersOpen}
              aria-controls="shop-list-filters"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              Filter
            </button>
            <label className="sl-sort-control">
              <span className="sl-sort-label">Default sorting</span>
              <select
                aria-label="Default sorting"
                className="sl-sort-select"
                value={selectedSortValue}
                onChange={(event) => {
                  const [order, sortDirection] = event.target.value.split(":");
                  updateFilters({
                    order,
                    sortDirection: sortDirection as ProductInquiry["sortDirection"],
                  });
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <option
                    key={`${option.order}:${option.sortDirection}`}
                    value={`${option.order}:${option.sortDirection}`}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section
          id="shop-list-filters"
          className="sl-filter-panel"
          aria-label="Filter products"
          hidden={!filtersOpen}
        >
          <form className="sl-search-form" onSubmit={searchProductHandler}>
            <label className="sl-search-label" htmlFor="shop-product-search">
              Search products by name
            </label>
            <div className="sl-search-row">
              <input
                id="shop-product-search"
                className="sl-search-input"
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search products"
              />
              <button className="sl-search-button" type="submit">Search</button>
            </div>
          </form>

          <div className="sl-category-controls" aria-label="Product collection">
            <span className="sl-filter-heading">Collection</span>
            {CATEGORY_FILTERS.map((filter) => {
              const isActive = productSearch.productCollection === filter.value;
              return (
                <button
                  key={filter.label}
                  type="button"
                  className={isActive ? "sl-filter-chip sl-filter-chip-active" : "sl-filter-chip"}
                  aria-pressed={isActive}
                  onClick={() => updateFilters({ productCollection: filter.value })}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </section>

        {isLoading ? <p className="sl-state">Loading products...</p> : null}
        {loadError ? <p className="sl-state sl-state-error">Products could not be loaded.</p> : null}

        {!isLoading && !loadError ? (
          <section className="sl-product-grid" aria-label="Products">
            {products.length > 0 ? (
              products.map((product) => {
                const imagePath = product.productImages[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "/icons/noimage-list.svg";
                const outOfStock = product.productLeftCount <= 0;

                return (
                  <article key={product._id} className="sl-card">
                    <button
                      type="button"
                      className="sl-card-main"
                      onClick={() => chooseProductHandler(product._id)}
                      aria-label={`View ${product.productName}`}
                    >
                      <div className="sl-card-media">
                        <img src={imagePath} alt={product.productName} />
                      </div>
                      <div className="sl-card-info">
                        <span className="sl-card-collection">
                          {product.productCollection.toLowerCase()}
                        </span>
                        <span className="sl-card-name">{product.productName}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className="sl-add-button"
                      disabled={outOfStock}
                      onClick={() => addToCartHandler(product)}
                    >
                      <span>{outOfStock ? "Out of Stock" : "Add To Cart"}</span>
                      {!outOfStock ? <span className="sl-add-price">${product.productPrice}</span> : null}
                    </button>
                  </article>
                );
              })
            ) : (
              <p className="sl-empty">No products found.</p>
            )}
          </section>
        ) : null}

        {!isLoading && !loadError && products.length > 0 ? (
          <nav className="sl-pagination" aria-label="Product pagination">
            <button
              type="button"
              className="sl-page-button"
              disabled={!canGoPrevious}
              onClick={() =>
                setProductSearch((previous) => ({ ...previous, page: previous.page - 1 }))
              }
            >
              ← Previous
            </button>
            <span className="sl-page-button" aria-current="page">{productSearch.page}</span>
            <button
              type="button"
              className="sl-page-button"
              disabled={!canGoNext}
              onClick={() =>
                setProductSearch((previous) => ({ ...previous, page: previous.page + 1 }))
              }
            >
              Next →
            </button>
          </nav>
        ) : null}
      </main>

      <div className="homepage sl-benefits">
        <FreeShipping />
      </div>
    </div>
  );
}
