import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8" },
  content: { padding: 16, gap: 16 },

  // Summary
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryDot: { width: 16, height: 16, borderRadius: 8 },
  summaryValue: { fontSize: 20, fontWeight: "700", color: "#1a1a2e" },
  summaryLabel: { fontSize: 11, color: "#888", textAlign: "center" },

  // Section
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a2e" },
  sectionCount: { fontSize: 13, color: "#888" },

  // Item Card
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    gap: 8,
  },
  itemLeft: { flex: 1, gap: 6 },
  itemName: { fontSize: 15, fontWeight: "600", color: "#1a1a2e" },
  itemRight: { alignItems: "center", marginHorizontal: 8 },
  stockCount: { fontSize: 22, fontWeight: "700", color: "#1e40af" },
  stockUnit: { fontSize: 11, color: "#888" },
  itemActions: { flexDirection: "row", gap: 6 },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#f0f4f8",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnDelete: { backgroundColor: "#fef2f2" },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1e40af",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "88%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a2e" },
  closeBtn: { padding: 4 },
  modalMessage: { fontSize: 14, color: "#555", marginBottom: 20, lineHeight: 20 },
  label: { fontSize: 13, color: "#888", marginBottom: 6, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#1a1a2e",
    marginBottom: 14,
    backgroundColor: "#f9fafb",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  cancelBtnText: { color: "#333", fontWeight: "600" },
  confirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1e40af",
  },
  confirmBtnText: { color: "#fff", fontWeight: "600" },

  // Adjust modal
  adjustItemName: { fontSize: 16, fontWeight: "700", color: "#1a1a2e", marginBottom: 4 },
  adjustCurrent: { fontSize: 13, color: "#888", marginBottom: 16 },
  adjustButtons: { flexDirection: "row", gap: 10, marginTop: 4 },
  adjustBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  adjustBtnAdd: { backgroundColor: "#1e40af" },
  adjustBtnRemove: { backgroundColor: "#6b7280" },
  adjustBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Delete modal
  deleteIconWrap: { alignItems: "center", marginBottom: 12 },

  // Empty state
  emptyState: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, color: "#aaa" },

  // Stock Badge
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  stockBadgeDot: { width: 6, height: 6, borderRadius: 3 },
  stockBadgeLabel: { fontSize: 11, fontWeight: "600" },
});