import { useLocalSearchParams } from "expo-router";
import { Pencil } from "lucide-react-native";
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

const API_URL = "http://172.20.10.3:8000/api/inventory/";

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
}

export default function Inventory() {
  const { token } = useLocalSearchParams();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [newVal, setNewVal] = useState("");
  const [dbRecordId, setDbRecordId] = useState<number | null>(null);

  useEffect(() => {
    if (token) fetchInventory();
  }, [token]);

  const fetchInventory = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      const record = Array.isArray(data) ? data[0] : data;

      if (record) {
        setDbRecordId(record.id);
        setItems([
          { id: "product_1", name: "Umbrella Cap", stock: record.product_1 || 0 },
          { id: "product_2", name: "Gallon", stock: record.product_2 || 0 },
          { id: "product_3", name: "Gallon Cap", stock: record.product_3 || 0 },
          { id: "product_4", name: "Cap Sticker", stock: record.product_4 || 0 },
          { id: "product_5", name: "Rock Salt", stock: record.product_5 || 0 },
          
        ]);
      }
    } catch (error) {
      console.error("Inventory Fetch Error:", error);
      Alert.alert("Connection Error", "Ensure server is at 172.20.10.3 and you are logged in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!editItem || dbRecordId === null) return;
    try {
      const response = await fetch(`${API_URL}${dbRecordId}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [editItem.id]: parseInt(newVal) }),
      });

      if (response.ok) {
        await fetchInventory();
        setEditItem(null);
      }
    } catch (error) {
      Alert.alert("Update Error", "Check server connection.");
    }
  };

  // Calculations for the Summary Cards shown in the image
  const totalStock = items.reduce((acc, curr) => acc + curr.stock, 0);
  const lowStockCount = items.filter(i => i.stock > 0 && i.stock < 10).length;
  const outOfStockCount = items.filter(i => i.stock === 0).length;

  if (isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, { backgroundColor: '#f8f9fa' }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Summary Cards Section (Matching Image Header) */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 }}>
          <SummaryCard title="Total Products" value={items.length} color="#6c757d" />
          <SummaryCard title="Total Stock" value={totalStock} color="#343a40" />
          <SummaryCard title="Low Stock" value={lowStockCount} color="#ffc107" light />
          <SummaryCard title="Out of Stock" value={outOfStockCount} color="#dc3545" light />
        </View>

        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#333' }}>Inventory Management</Text>

        {items.map((item) => (
          <View key={item.id} style={[styles.itemCard, { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee', backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, paddingHorizontal: 15 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>{item.name}</Text>
                
                {/* Status Badge (Matching "In Stock" in image) */}
                <View style={{
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: item.stock === 0 ? '#f8d7da' : item.stock < 10 ? '#fff3cd' : '#d4edda',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 15,
                  alignSelf: 'flex-start',
                  marginTop: 5
                }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.stock === 0 ? '#dc3545' : item.stock < 10 ? '#ffc107' : '#28a745', marginRight: 6 }} />
                  <Text style={{ fontSize: 12, color: item.stock === 0 ? '#721c24' : item.stock < 10 ? '#856404' : '#155724', fontWeight: 'bold' }}>
                    {item.stock === 0 ? "Out of Stock" : item.stock < 10 ? "Low Stock" : "In Stock"}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#212529' }}>{item.stock}</Text>
                <TouchableOpacity 
                  onPress={() => { setEditItem(item); setNewVal(String(item.stock)); }}
                  style={{ marginTop: 5, padding: 5 }}
                >
                  <Pencil size={18} color="#007bff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={!!editItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Update {editItem?.name}</Text>
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
              <TouchableOpacity style={styles.confirmBtn} onPress={handleUpdateStock}>
                <Text style={styles.confirmBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Helper Component for the Header Cards
function SummaryCard({ title, value, color, light }: { title: string, value: number, color: string, light?: boolean }) {
  return (
    <View style={{
      width: '48%',
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      borderTopWidth: 4,
      borderTopColor: color
    }}>
      <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 5 }}>{title}</Text>
      <Text style={{ fontSize: 20, fontWeight: '800', textAlign: 'center', color: color }}>{value}</Text>
    </View>
  );
}