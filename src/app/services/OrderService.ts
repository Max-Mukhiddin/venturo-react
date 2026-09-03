import axios from "axios";
import { serverApi } from "../../lib/config";
import { CartItem } from "../../lib/types/search";
import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
  ShippingAddress,
} from "../../lib/types/order";

class OrderService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async createOrder(
    input: CartItem[],
    shippingAddress: ShippingAddress
  ): Promise<Order> {
    try {
      const items: OrderItemInput[] = input.map((cartItem: CartItem) => {
        return {
          itemQuantity: cartItem.quantity,
          itemPrice: cartItem.price,
          productId: cartItem._id,
        };
      });

      const url = `${this.path}/order/create`;
      const result = await axios.post(
        url,
        { shippingAddress, items },
        { withCredentials: true }
      );
      console.log("createOrder:", result);
      return result.data;
    } catch (err) {
      console.log("Error. createOrder:", err);
      throw err;
    }
  }

  public async getMyOrders(pageOrInput: number | OrderInquiry = 1, limit = 10): Promise<Order[]> {
    try {
      axios.defaults.withCredentials = true;
      const url = `${this.path}/order/all`;
      const input = typeof pageOrInput === "number" ? undefined : pageOrInput;
      const page = input?.page || pageOrInput;
      const query = new URLSearchParams({
        page: String(page),
        limit: String(input?.limit || limit),
      });

      if (input?.orderStatus) query.set("orderStatus", input.orderStatus);

      const result = await axios.get(`${url}?${query.toString()}`, { withCredentials: true });
      console.log("getMyOrders:", result);

      return result.data;
    } catch (err) {
      console.log("Error. getMyOrders:", err);
      throw err;
    }
  }

  public async getOrderDetail(orderId: string): Promise<Order> {
    const result = await axios.get(`${this.path}/order/${orderId}`, {
      withCredentials: true,
    });

    return result.data;
  }

  public async updateOrder(inputOrOrderId: OrderUpdateInput | string, status?: OrderUpdateInput["orderStatus"]): Promise<Order> {
    try {
      const input = typeof inputOrOrderId === "string"
        ? { orderId: inputOrOrderId, orderStatus: status! }
        : inputOrOrderId;
      const url = `${this.path}/order/update`;
      const result = await axios.post(url, input, { withCredentials: true });
      console.log("updateOrder:", result);

      return result.data;
    } catch (err) {
      console.log("Error. updateOrder:", err);
      throw err;
    }
  }
}

export default OrderService;
