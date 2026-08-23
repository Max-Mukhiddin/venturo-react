declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "swiper" {
  export type SwiperModule = any;
  const SwiperCore: any;
  export default SwiperCore;
  export const Autoplay: any;
  export const Navigation: any;
  export const Pagination: any;
  export const FreeMode: any;
  export const Thumbs: any;
}

declare module "swiper/react";

declare module "swiper/css";
declare module "swiper/css/free-mode";
declare module "swiper/css/navigation";
declare module "swiper/css/thumbs";
