import { Member } from "./member";
import { Product } from "./product";



/** REACT APP STATE **/
export interface AppRootState {
    homePage: HomePageState;
    productsPage: ProductPageState;
}

/** HOMEPAGE **/
export interface HomePageState {
    topUsers: Member[];
}

/** PRODUCTS  PAGE **/
export interface ProductPageState {
    chosenProduct: Product | null;
    products: Product[];
}
