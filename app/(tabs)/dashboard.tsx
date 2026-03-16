import { AlertTriangle } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "../styles/dashboard.styles";

// --- Helper ---
const extractLitersFromProduct = (productName: string): number => {
  const match = productName.match(/(\d+)\s*(?:Liter|L)/i);
  return match ? parseInt(match[1]) : 0;
};

// --- StatCard ---
const StatCard = ({ title, value, children }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
    {children}
  </View>
);

// --- ProgressBar ---
const ProgressBar = ({ percentage, label }: any) => (
  <View style={{ marginTop: 8 }}>
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${percentage}%` }]} />
    </View>
    <Text style={styles.progressLabel}>{label}</Text>
  </View>
);

// --- HealthBar ---
const HealthBar = ({ percentage }: any) => {
  const color =
    percentage < 25 ? "#ef4444" : percentage < 50 ? "#f97316" : "#22c55e";
  return (
    <View style={{ marginTop: 8 }}>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressLabel}>{Math.round(percentage)}% Health</Text>
    </View>
  );
};

// --- MaintenanceConfirmationModal ---
const MaintenanceConfirmationModal = ({ onConfirm, onCancel }: any) => (
  <Modal transparent animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>Confirm Maintenance</Text>
        <Text style={styles.modalMessage}>
          Are you sure you want to reset the maintenance counter?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

// --- Dashboard Screen ---
export default function Dashboard() {
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [maintenanceLiters, setMaintenanceLiters] = useState(0);
  const [maintenanceCapacity] = useState(250);
  const [transactionGoal] = useState(50);
  const [showMaintenanceConfirm, setShowMaintenanceConfirm] = useState(false);

  const calculateTodayStats = () => {
    const today = new Date().toLocaleDateString();
    const todayOrders = completedOrders.filter(
      (order) => order.date === today
    );
    const totalSales = todayOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalLiters = todayOrders.reduce((sum, order) => {
      const orderLiters = (order.items || []).reduce(
        (itemSum: number, item: any) =>
          itemSum + extractLitersFromProduct(item.name) * item.quantity,
        0
      );
      return sum + orderLiters;
    }, 0);
    return {
      totalSales,
      totalLiters,
      transactionCount: todayOrders.length,
    };
  };

  const getMaintenanceStatus = () => {
    const remainingLiters = maintenanceCapacity - maintenanceLiters;
    const healthPercentage = (remainingLiters / maintenanceCapacity) * 100;
    if (healthPercentage < 25) {
      return {
        status: "critical",
        message:
          "Warning: production should halt. Maintenance must be executed as soon as possible",
        healthPercentage,
      };
    } else if (healthPercentage < 50) {
      return {
        status: "alert",
        message:
          "You are almost at the maintenance pace. Please prepare your tools and filters",
        healthPercentage,
      };
    } else {
      return {
        status: "good",
        message: "You are good",
        healthPercentage,
      };
    }
  };

  const stats = calculateTodayStats();
  const maintenanceStatus = getMaintenanceStatus();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Today's Sales */}
      <StatCard
        title="Today's Sales"
        value={`₱ ${stats.totalSales.toLocaleString("en-PH", {
          minimumFractionDigits: 2,
        })}`}
      />

      {/* Liters Refilled */}
      <StatCard
        title="Liters Refilled"
        value={`${stats.totalLiters} Liters`}
      />

      {/* Deliveries Completed */}
      <StatCard
        title="Deliveries Completed"
        value={stats.transactionCount}
      >
        <ProgressBar
          percentage={Math.min(
            (stats.transactionCount / transactionGoal) * 100,
            100
          )}
          label={`${Math.min(
            Math.round((stats.transactionCount / transactionGoal) * 100),
            100
          )}% of Goal`}
        />
      </StatCard>

      {/* Maintenance Status */}
      <StatCard
        title="Maintenance Status"
        value={`${maintenanceCapacity - maintenanceLiters}L / ${maintenanceCapacity}L`}
      >
        <Text
          style={[
            styles.maintenanceMessage,
            maintenanceStatus.status === "critical" && { color: "#ef4444" },
            maintenanceStatus.status === "alert" && { color: "#f97316" },
            maintenanceStatus.status === "good" && { color: "#22c55e" },
          ]}
        >
          {maintenanceStatus.message}
        </Text>
        <HealthBar percentage={maintenanceStatus.healthPercentage} />
        <TouchableOpacity
          style={[
            styles.fixBtn,
            maintenanceStatus.status === "critical" && styles.fixBtnCritical,
          ]}
          onPress={() => setShowMaintenanceConfirm(true)}
        >
          {maintenanceStatus.status === "critical" && (
            <AlertTriangle size={16} color="#fff" style={{ marginRight: 6 }} />
          )}
          <Text style={styles.fixBtnText}>Fix</Text>
        </TouchableOpacity>
      </StatCard>

      {showMaintenanceConfirm && (
        <MaintenanceConfirmationModal
          onConfirm={() => {
            setMaintenanceLiters(0);
            setShowMaintenanceConfirm(false);
          }}
          onCancel={() => setShowMaintenanceConfirm(false)}
        />
      )}
    </ScrollView>
  );
}

