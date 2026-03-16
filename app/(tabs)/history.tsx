import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// --- Types ---
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  orderType: "delivery" | "walk-in";
  items: OrderItem[];
  totalAmount: number;
  time: string;
}

// --- Sample Data ---
const sampleOrders: Order[] = [
  {
    id: "1",
    customerName: "Maria Santos",
    orderType: "delivery",
    items: [
      { name: "20 Liter Purified Water", quantity: 2, price: 40 },
      { name: "5 Liter Purified Water", quantity: 1, price: 15 },
    ],
    totalAmount: 95,
    time: "08:15:00 AM",
  },
  {
    id: "2",
    customerName: "Juan dela Cruz",
    orderType: "walk-in",
    items: [{ name: "10 Liter Purified Water", quantity: 3, price: 25 }],
    totalAmount: 75,
    time: "09:42:00 AM",
  },
  {
    id: "3",
    customerName: "Ana Reyes",
    orderType: "delivery",
    items: [{ name: "20 Liter Purified Water", quantity: 4, price: 40 }],
    totalAmount: 160,
    time: "10:30:00 AM",
  },
  {
    id: "4",
    customerName: "Carlo Mendoza",
    orderType: "walk-in",
    items: [
      { name: "5 Liter Purified Water", quantity: 2, price: 15 },
      { name: "10 Liter Purified Water", quantity: 1, price: 25 },
    ],
    totalAmount: 55,
    time: "11:05:00 AM",
  },
  {
    id: "5",
    customerName: "Liza Gonzales",
    orderType: "delivery",
    items: [{ name: "20 Liter Purified Water", quantity: 1, price: 40 }],
    totalAmount: 40,
    time: "01:20:00 PM",
  },
  
];

const getTotalQty = (items: OrderItem[]) =>
  items.reduce((s, i) => s + i.quantity, 0);

// --- Order Details Modal ---
const OrderDetailsModal = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => (
  <Modal transparent animationType="slide">
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Order Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Customer</Text>
          <Text style={styles.detailValue}>{order.customerName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <View style={[styles.typeBadge, order.orderType === "delivery" ? styles.badgeDelivery : styles.badgeWalkin]}>
            <Text style={[styles.typeBadgeText, order.orderType === "delivery" ? styles.badgeDeliveryText : styles.badgeWalkinText]}>
              {order.orderType === "delivery" ? "Delivery" : "Walk-In"}
            </Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>{order.time}</Text>
        </View>

        <View style={styles.divider} />
        <Text style={styles.itemsTitle}>Items Ordered</Text>

        {order.items.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <View style={styles.itemDot} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            <Text style={styles.itemPrice}>₱{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₱{order.totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.closeModalBtn} onPress={onClose}>
          <Text style={styles.closeModalBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// --- Main History Screen ---
export default function History() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const totalSales = orders.reduce((s, o) => s + o.totalAmount, 0);
  const deliveries = orders.filter((o) => o.orderType === "delivery").length;
  const walkIns = orders.filter((o) => o.orderType === "walk-in").length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Title */}
        <Text style={styles.pageTitle}>Today's Transactions</Text>
        <View style={styles.titleUnderline} />

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Orders</Text>
            <Text style={styles.summaryValue}>{orders.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Walk-Ins</Text>
            <Text style={styles.summaryValue}>{walkIns}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Deliveries</Text>
            <Text style={styles.summaryValue}>{deliveries}</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryCardGreen]}>
            <Text style={styles.summaryLabel}>Total Sales</Text>
            <Text style={styles.summaryValueGreen}>₱{totalSales.toFixed(2)}</Text>
          </View>
        </View>

        {/* Table */}
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders yet today</Text>
          </View>
        ) : (
          <View style={styles.tableWrapper}>
            {/* Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.th, styles.colCustomer]}>Customer</Text>
              <Text style={[styles.th, styles.colType]}>Type</Text>
              <Text style={[styles.th, styles.colQty]}>Qty</Text>
              <Text style={[styles.th, styles.colTotal]}>Total</Text>
            </View>

            {/* Rows */}
            {orders.map((order, index) => (
              <TouchableOpacity
                key={order.id}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                ]}
                onPress={() => setSelectedOrder(order)}
                activeOpacity={0.7}
              >
                <Text style={[styles.td, styles.colCustomer]} numberOfLines={1}>
                  {order.customerName}
                </Text>
                <View style={styles.colType}>
                  <View
                    style={[
                      styles.typeBadge,
                      order.orderType === "delivery"
                        ? styles.badgeDelivery
                        : styles.badgeWalkin,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        order.orderType === "delivery"
                          ? styles.badgeDeliveryText
                          : styles.badgeWalkinText,
                      ]}
                    >
                      {order.orderType === "delivery" ? "Delivery" : "Walk-In"}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.td, styles.colQty]}>
                  {getTotalQty(order.items)}
                </Text>
                <Text style={[styles.td, styles.colTotal, styles.amountText]}>
                  ₱{order.totalAmount.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e8edf2" },
  content: { padding: 16, gap: 14 },

  // Title
  pageTitle: { fontSize: 22, fontWeight: "800", color: "#1a1a2e" },
  titleUnderline: { height: 2, backgroundColor: "#1e40af", marginTop: 6 },

  // Summary Cards
  summaryRow: { flexDirection: "row", gap: 6 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    gap: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#1e40af",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCardGreen: { borderLeftColor: "#22c55e", backgroundColor: "#f0fdf4" },
  summaryLabel: { fontSize: 9, color: "#888", textAlign: "center" },
  summaryValue: { fontSize: 20, fontWeight: "700", color: "#1e40af" },
  summaryValueGreen: { fontSize: 14, fontWeight: "700", color: "#16a34a" },

  // Table
  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e40af",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  th: { fontSize: 12, fontWeight: "700", color: "#fff", textAlign: "center" },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowEven: { backgroundColor: "#fff" },
  rowOdd: { backgroundColor: "#f8fafc" },
  td: { fontSize: 13, color: "#333", textAlign: "center" },
  amountText: { color: "#1e40af", fontWeight: "700" },

  // Column widths — 5 columns, more breathing room
  colCustomer: { flex: 2, textAlign: "left" },
  colType: { width: 72, alignItems: "center" },
  colQty: { width: 36, textAlign: "center" },
  colTotal: { width: 72, textAlign: "center" },
  colAction: { width: 36, alignItems: "center" },

  // Type Badge
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  badgeDelivery: { backgroundColor: "#fef3c7" },
  badgeWalkin: { backgroundColor: "#dcfce7" },
  typeBadgeText: { fontSize: 11, fontWeight: "700" },
  badgeDeliveryText: { color: "#92400e" },
  badgeWalkinText: { color: "#166534" },

  // Complete button
  completeBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#1e40af",
    alignItems: "center",
    justifyContent: "center",
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: { backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "88%" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a2e", marginBottom: 8 },
  closeBtn: { padding: 4 },
  modalMessage: { fontSize: 14, color: "#555", marginBottom: 6 },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
  cancelBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: "#e5e7eb" },
  cancelBtnText: { color: "#333", fontWeight: "600", fontSize: 13 },
  confirmBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8, backgroundColor: "#1e40af" },
  confirmBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  // Details modal
  divider: { height: 1, backgroundColor: "#f0f4f8", marginVertical: 10 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  detailLabel: { fontSize: 13, color: "#888" },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#1a1a2e" },
  itemsTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a2e", marginBottom: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  itemDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1e40af" },
  itemName: { flex: 1, fontSize: 13, color: "#444" },
  itemQty: { fontSize: 13, color: "#888" },
  itemPrice: { fontSize: 13, fontWeight: "600", color: "#1a1a2e" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 15, fontWeight: "700", color: "#1a1a2e" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#1e40af" },
  closeModalBtn: { marginTop: 20, backgroundColor: "#1e40af", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  closeModalBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Empty
  emptyState: { alignItems: "center", paddingVertical: 48 },
  emptyText: { fontSize: 14, color: "#aaa" },
});