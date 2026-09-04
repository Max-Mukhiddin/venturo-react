
import { OrderStatus, PaymentMethod } from "../enums/order.enum";
import { Product } from "./product";

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: string;
  orderId?: string;
}

export interface CreateOrderInput {
  shippingAddress: ShippingAddress;
  items: OrderItemInput[];
  orderPaymentMethod: PaymentMethod;
}

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  // Historical orders predate payment-method storage.
  orderPaymentMethod?: PaymentMethod;
  memberId: string;
  shippingAddress: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
  //** from aggregations **/
  orderItems: OrderItem[];
  productData: Product[];
}


export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

export interface OrderUpdateInput {
    orderId: string;
    orderStatus: OrderStatus;
}
