import { Package, Pencil, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/inventoryStyles";


const API_URL = "http://127.0.0.1:8000/api/inventory/"; 

interface InventoryItem {
  id: string; 
  name: string;
  stock: number;
}

const StockBadge = ({ stock }: { stock: number }) => {
  const color = stock === 0 ? "#ef4444" : stock < 10 ? "#f97316" : "#22c55e";
  const label = stock === 0 ? "Out of Stock" : stock < 10 ? "Low Stock" : "In Stock";
  return (
    <View style={[styles.stockBadge, { backgroundColor: color + "20" }]}>
      <View style={[styles.stockBadgeDot, { backgroundColor: color }]} />
      <Text style={[styles.stockBadgeLabel, { color }]}>{label}</Text>
    </View>
  );
};

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [newVal, setNewVal] = useState("");
  const [dbRecordId, setDbRecordId] = useState<number | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const record = Array.isArray(data) ? data[0] : data;

      if (record) {
        setDbRecordId(record.id); 
        const mappedItems: InventoryItem[] = [
          { id: "umbrella_cap", name: "Umbrella Cap", stock: record.umbrella_cap },
          { id: "gallon", name: "Gallon", stock: record.gallon },
          { id: "gallon_cap", name: "Gallon Cap", stock: record.gallon_cap },
          { id: "cap_sticker", name: "Cap Sticker", stock: record.cap_sticker },
          { id: "rock_salt", name: "Rock Salt", stock: record.rock_salt },
        ];
        setItems(mappedItems);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Connection Error", "Could not load data from Django.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!editItem || dbRecordId === null) {
        return Alert.alert("Error", "No record ID found to update.");
    }

    const updatedQuantity = parseInt(newVal);
    if (isNaN(updatedQuantity) || updatedQuantity < 0) {
      return Alert.alert("Invalid Input", "Please enter a valid number.");
    }

    const updateUrl = `${API_URL}${dbRecordId}/`;

    try {
      console.log(`Attempting PATCH to: ${updateUrl}`);
      
      const response = await fetch(updateUrl, {
        method: "PATCH",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [editItem.id]: updatedQuantity }),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchInventory(); 
        setEditItem(null);
      } else {
        console.error("Server Rejected Update:", result);
        Alert.alert("Update Failed", JSON.stringify(result));
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Network Error", "Check if your Django server is running and accessible.");
    }
  };

  const lowStockCount = items.filter((i) => i.stock < 10 && i.stock > 0).length;
  const outOfStockCount = items.filter((i) => i.stock === 0).length;

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Inventory Levels</Text>
        </View>

        {items.map((item) => (
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
                onPress={() => {
                  setEditItem(item);
                  setNewVal(String(item.stock));
                }}
              >
                <Pencil size={15} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={!!editItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Quantity</Text>
              <TouchableOpacity onPress={() => setEditItem(null)}>
                <X size={20} color="#888" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.label}>Item: {editItem?.name}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={newVal}
              onChangeText={setNewVal}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditItem(null)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmBtn} 
                onPress={handleUpdateStock}
              >
                <Text style={styles.confirmBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}