import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../css/orderTrack.css";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { OrderStatus } from "../../../lib/enums/order.enum";
import Breadcrumb from "../../components/breadcrumb";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

const formatMoney = (value: number) => `$${value}`;
const formatDate = (value: Date) => new Date(value).toLocaleDateString();
const formatOrderDate = (value: Date) => new Date(value).toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
const formatStatus = (status: OrderStatus) =>
  status === OrderStatus.DELETE ? "Cancelled" : status;

const normalizeOrderDetail = (order: Order): Order => ({
  ...order,
  orderItems: order.orderItems ?? [],
  productData: order.productData ?? [],
});

const formatOrderLabel = (order: Order) => {
  const productNames = Array.from(
    new Set(
      (order.productData ?? [])
        .map((product) => product.productName)
        .filter(Boolean)
    )
  );
  const primaryLabel = productNames.length === 0
    ? `Order …${order._id.slice(-5)}`
    : productNames.length === 1
      ? productNames[0]
      : productNames.length === 2
        ? `${productNames[0]} + ${productNames[1]}`
        : `${productNames[0]} + ${productNames.length - 1} more`;

  return `${primaryLabel} · ${formatOrderDate(order.createdAt)} · ${formatStatus(order.orderStatus)}`;
};

export default function OrderTrackPage({ onLoginOpen }: { onLoginOpen: () => void }) {
  const { authMember, authInitializing } = useGlobals();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState<OrderStatus | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const loadOrders = useCallback(() => {
    if (!authMember) return;

    setLoading(true);
    setError(false);

    new OrderService()
      .getMyOrders()
      .then((data) => {
        const loadedOrders = Array.isArray(data) ? data.map(normalizeOrderDetail) : [];
        setOrders(loadedOrders);
        if (loadedOrders.length === 1) setSelectedId(loadedOrders[0]._id);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [authMember]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const loadSelectedOrder = useCallback(() => {
    if (!selectedId || !authMember) return;

    setDetailLoading(true);
    setError(false);
    setMutationError(null);
    setSelectedOrder(null);
    new OrderService()
      .getOrderDetail(selectedId)
      .then((order) => setSelectedOrder(normalizeOrderDetail(order)))
      .catch(() => setError(true))
      .finally(() => setDetailLoading(false));
  }, [authMember, selectedId]);

  useEffect(() => {
    loadSelectedOrder();
  }, [loadSelectedOrder]);

  const updateStatus = async (status: OrderStatus) => {
    if (!selectedOrder || updating) return;

    setUpdating(status);
    setError(false);
    setMutationError(null);
    let statusUpdated = false;
    try {
      const orderService = new OrderService();
      await orderService.updateOrder(selectedOrder._id, status);
      statusUpdated = true;

      // The update response is an unpopulated Order document. Reload its
      // aggregate detail before replacing UI state used by the item renderer.
      const refreshedOrder = normalizeOrderDetail(
        await orderService.getOrderDetail(selectedOrder._id)
      );
      setSelectedOrder(refreshedOrder);
      setOrders((previous) =>
        previous.map((order) =>
          order._id === refreshedOrder._id
            ? {
                ...order,
                orderStatus: refreshedOrder.orderStatus,
                updatedAt: refreshedOrder.updatedAt,
                orderItems: refreshedOrder.orderItems,
                productData: refreshedOrder.productData,
              }
            : order
        )
      );
    } catch {
      setMutationError(
        statusUpdated
          ? "Order status was updated, but its details could not be refreshed. Please reload."
          : "Order status could not be updated. Please try again."
      );
    } finally {
      setUpdating(null);
    }
  };

  const selectedProducts = selectedOrder?.productData ?? [];
  const selectedOrderItems = selectedOrder?.orderItems ?? [];

  const renderItem = (item: OrderItem) => {
    const product = selectedProducts.find((entry: Product) => entry._id === item.productId);
    const image = product?.productImages?.[0];

    return (
      <li className="ot-item" key={item._id}>
        <img src={image ? `${serverApi}/${image}` : "/icons/noimage-list.svg"} alt={product?.productName || "Product unavailable"} />
        <div>
          <h3>{product?.productName || "Product unavailable"}</h3>
          <p>{item.itemQuantity} × {formatMoney(item.itemPrice)}</p>
          {!product ? <p>Product ID: {item.productId}</p> : null}
        </div>
        <strong>{formatMoney(item.itemQuantity * item.itemPrice)}</strong>
      </li>
    );
  };

  let content: React.ReactNode;
  if (authInitializing) {
    content = <p className="ot-state">Loading session...</p>;
  } else if (!authMember) {
    content = <section className="ot-message"><p><button className="ot-auth-link" type="button" onClick={onLoginOpen}>Sign in</button> to view your orders.</p><Link to="/products">Continue Shopping</Link></section>;
  } else if (loading) {
    content = <p className="ot-state">Loading your orders...</p>;
  } else if (error && !selectedOrder) {
    content = <p className="ot-state">Orders could not be loaded. <button onClick={loadOrders}>Retry</button></p>;
  } else if (orders.length === 0) {
    content = <section className="ot-message"><p>You have no orders yet.</p><Link to="/products">Shop Products</Link></section>;
  } else {
    content = (
      <>
        <section className="ot-picker">
          <p>Select one of your orders to view its current order information. Venturo does not provide courier tracking details.</p>
          <label htmlFor="order-select">Your orders</label>
          <select id="order-select" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            <option value="">Select an order</option>
            {orders.map((order) => <option key={order._id} value={order._id}>{formatOrderLabel(order)}</option>)}
          </select>
        </section>
        {detailLoading ? <p className="ot-state">Loading order details...</p> : null}
        {error && selectedId ? <p className="ot-state">Order details could not be loaded. <button onClick={loadSelectedOrder}>Retry</button></p> : null}
        {selectedOrder && !detailLoading ? (
          <section className="ot-result">
            <header className="ot-result-header"><div><p>Current status</p><strong className={`ot-status ot-status-${selectedOrder.orderStatus.toLowerCase()}`}>{formatStatus(selectedOrder.orderStatus)}</strong></div><div><p>Ordered</p><strong>{formatDate(selectedOrder.createdAt)}</strong></div><div><p>Last updated</p><strong>{formatDate(selectedOrder.updatedAt)}</strong></div></header>
            <div className="ot-detail-grid">
              <section><h2>Order Items</h2><ul>{selectedOrderItems.map(renderItem)}</ul></section>
              <aside><h2>Order Summary</h2><dl><div><dt>Products</dt><dd>{formatMoney(selectedOrder.orderTotal - selectedOrder.orderDelivery)}</dd></div><div><dt>Delivery</dt><dd>{formatMoney(selectedOrder.orderDelivery)}</dd></div><div><dt>Total</dt><dd>{formatMoney(selectedOrder.orderTotal)}</dd></div></dl><h2>Shipping Address</h2><address>{selectedOrder.shippingAddress.street}<br />{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}<br />{selectedOrder.shippingAddress.country}</address></aside>
            </div>
            {mutationError ? <p className="ot-mutation-error" role="alert">{mutationError}</p> : null}
            {selectedOrder.orderStatus === OrderStatus.PENDING || selectedOrder.orderStatus === OrderStatus.PROCESS ? <div className="ot-actions">{selectedOrder.orderStatus === OrderStatus.PENDING ? <button disabled={Boolean(updating)} onClick={() => updateStatus(OrderStatus.PROCESS)}>{updating === OrderStatus.PROCESS ? "Continuing..." : "Continue Order"}</button> : null}<button className="ot-cancel" disabled={Boolean(updating)} onClick={() => updateStatus(OrderStatus.DELETE)}>{updating === OrderStatus.DELETE ? "Cancelling..." : "Cancel Order"}</button></div> : null}
          </section>
        ) : null}
      </>
    );
  }

  return <div className="order-track-page"><Breadcrumb heading="Order Track" trail={[{ label: "Home", to: "/" }, { label: "Order Track" }]} /><main className="ot-main">{content}</main></div>;
}
