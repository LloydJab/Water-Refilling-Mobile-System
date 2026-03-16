import { AlertTriangle, Package, Pencil, Plus, Trash2, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/inventoryStyles";

// --- Types ---
interface InventoryItem {
  id: string;
  name: string;
  stock: number;
}

// --- Initial Sample Data ---
const initialItems: InventoryItem[] = [
  { id: "1", name: "5 Liter Bottle", stock: 40 },
  { id: "2", name: "10 Liter Bottle", stock: 25 },
  { id: "3", name: "20 Liter Bottle", stock: 12 },
];

// --- StockBadge ---
const StockBadge = ({ stock }: { stock: number }) => {
  const color =
    stock === 0 ? "#ef4444" : stock < 10 ? "#f97316" : "#22c55e";
  const label =
    stock === 0 ? "Out of Stock" : stock < 10 ? "Low Stock" : "In Stock";
  return (
    <View style={[styles.stockBadge, { backgroundColor: color + "20" }]}>
      <View style={[styles.stockBadgeDot, { backgroundColor: color }]} />
      <Text style={[styles.stockBadgeLabel, { color }]}>{label}</Text>
    </View>
  );
};

// --- ItemFormModal ---
const ItemFormModal = ({
  visible,
  onClose,
  onSubmit,
  editItem,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string, stock: number) => void;
  editItem: InventoryItem | null;
}) => {
  const [name, setName] = useState(editItem?.name ?? "");
  const [stock, setStock] = useState(editItem ? String(editItem.stock) : "");

  React.useEffect(() => {
    setName(editItem?.name ?? "");
    setStock(editItem ? String(editItem.stock) : "");
  }, [editItem, visible]);

  const handleSubmit = () => {
    if (!name.trim()) return Alert.alert("Validation", "Item name is required.");
    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0)
      return Alert.alert("Validation", "Enter a valid stock number.");
    onSubmit(name.trim(), stockNum);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editItem ? "Edit Item" : "Add New Item"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 20 Liter Bottle"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Stock Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 50"
            placeholderTextColor="#aaa"
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleSubmit}>
              <Text style={styles.confirmBtnText}>
                {editItem ? "Save Changes" : "Add Item"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- AdjustStockModal ---
const AdjustStockModal = ({
  visible,
  item,
  onClose,
  onAdjust,
}: {
  visible: boolean;
  item: InventoryItem | null;
  onClose: () => void;
  onAdjust: (id: string, delta: number) => void;
}) => {
  const [amount, setAmount] = useState("1");
  if (!item) return null;

  const handleAdjust = (delta: number) => {
    const num = parseInt(amount);
    if (isNaN(num) || num <= 0)
      return Alert.alert("Validation", "Enter a valid amount.");
    onAdjust(item.id, delta * num);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Adjust Stock</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={styles.adjustItemName}>{item.name}</Text>
          <Text style={styles.adjustCurrent}>
            Current Stock:{" "}
            <Text style={{ fontWeight: "700", color: "#1a1a2e" }}>
              {item.stock}
            </Text>
          </Text>

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="1"
            placeholderTextColor="#aaa"
          />

          <View style={styles.adjustButtons}>
            <TouchableOpacity
              style={[styles.adjustBtn, styles.adjustBtnRemove]}
              onPress={() => handleAdjust(-1)}
            >
              <Text style={styles.adjustBtnText}>− Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.adjustBtn, styles.adjustBtnAdd]}
              onPress={() => handleAdjust(1)}
            >
              <Text style={styles.adjustBtnText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- DeleteConfirmModal ---
const DeleteConfirmModal = ({
  visible,
  item,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  item: InventoryItem | null;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <View style={styles.deleteIconWrap}>
          <AlertTriangle size={32} color="#ef4444" />
        </View>
        <Text style={styles.modalTitle}>Delete Item</Text>
        <Text style={styles.modalMessage}>
          Are you sure you want to delete{" "}
          <Text style={{ fontWeight: "700" }}>{item?.name}</Text>? This cannot
          be undone.
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: "#ef4444" }]}
            onPress={onConfirm}
          >
            <Text style={styles.confirmBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// --- Main Inventory Screen ---
export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<InventoryItem | null>(null);

  const handleAddOrEdit = (name: string, stock: number) => {
    if (editItem) {
      setItems((prev) =>
        prev.map((i) => (i.id === editItem.id ? { ...i, name, stock } : i))
      );
    } else {
      setItems((prev) => [
        ...prev,
        { id: Date.now().toString(), name, stock },
      ]);
    }
    setShowForm(false);
    setEditItem(null);
  };

  const handleAdjust = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i
      )
    );
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const lowStockCount = items.filter((i) => i.stock < 10 && i.stock > 0).length;
  const outOfStockCount = items.filter((i) => i.stock === 0).length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Package size={18} color="#1e40af" />
            <Text style={styles.summaryValue}>{items.length}</Text>
            <Text style={styles.summaryLabel}>Total Items</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryDot, { backgroundColor: "#f97316" }]} />
            <Text style={styles.summaryValue}>{lowStockCount}</Text>
            <Text style={styles.summaryLabel}>Low Stock</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryDot, { backgroundColor: "#ef4444" }]} />
            <Text style={styles.summaryValue}>{outOfStockCount}</Text>
            <Text style={styles.summaryLabel}>Out of Stock</Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Items</Text>
          <Text style={styles.sectionCount}>{items.length} items</Text>
        </View>

        {/* Item List */}
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={40} color="#ccc" />
            <Text style={styles.emptyText}>No items yet. Add one below!</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemLeft}>
                <Text style={styles.itemName}>{item.name}</Text>
                <StockBadge stock={item.stock} />
              </View>

              <View style={styles.itemRight}>
                <Text style={styles.stockCount}>{item.stock}</Text>
                <Text style={styles.stockUnit}>units</Text>
              </View>

              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setAdjustItem(item)}
                >
                  <Plus size={15} color="#1e40af" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setEditItem(item);
                    setShowForm(true);
                  }}
                >
                  <Pencil size={15} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnDelete]}
                  onPress={() => setDeleteItem(item)}
                >
                  <Trash2 size={15} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditItem(null);
          setShowForm(true);
        }}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modals */}
      <ItemFormModal
        visible={showForm}
        onClose={() => {
          setShowForm(false);
          setEditItem(null);
        }}
        onSubmit={handleAddOrEdit}
        editItem={editItem}
      />
      <AdjustStockModal
        visible={!!adjustItem}
        item={adjustItem}
        onClose={() => setAdjustItem(null)}
        onAdjust={handleAdjust}
      />
      <DeleteConfirmModal
        visible={!!deleteItem}
        item={deleteItem}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </View>
  );
}