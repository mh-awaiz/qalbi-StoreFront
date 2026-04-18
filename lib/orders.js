// lib/orders.js — simple order store (file-based for serverless, replace with DB if needed)
// Since we removed MongoDB, orders are stored in-memory per serverless invocation
// and confirmation is sent via email. For persistent storage, swap this with
// Supabase, PlanetScale, or any other DB.

import crypto from "crypto";

// In-memory store (cleared on cold start — use a real DB for production)
const orderStore = new Map();

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `QC-${ts}${rand}`;
}

export function saveOrder(order) {
  const id = crypto.randomBytes(12).toString("hex");
  const orderNumber = generateOrderNumber();
  const doc = {
    _id: id,
    orderNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentStatus: "pending",
    orderStatus: "processing",
    timeline: [{ status: "processing", note: "Order placed, awaiting payment", timestamp: new Date().toISOString() }],
    delhiveryWaybill: null,
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
    ...order,
  };
  orderStore.set(id, doc);
  return doc;
}

export function getOrder(id) {
  return orderStore.get(id) || null;
}

export function updateOrder(id, updates) {
  const existing = orderStore.get(id);
  if (!existing) return null;
  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
    timeline: updates.$push?.timeline
      ? [...existing.timeline, updates.$push.timeline]
      : existing.timeline,
  };
  orderStore.set(id, updated);
  return updated;
}

export function findOrderByNumber(orderNumber, phone) {
  for (const order of orderStore.values()) {
    if (order.orderNumber === orderNumber) {
      if (!phone) return order;
      const ph = phone.replace(/\s/g, "");
      if (
        order.customer?.phone?.replace(/\s/g, "") === ph ||
        order.shippingAddress?.phone?.replace(/\s/g, "") === ph
      ) {
        return order;
      }
    }
  }
  return null;
}
