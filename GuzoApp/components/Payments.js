import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

export const Payments = () => {
  const [payments] = useState([
    {
      id: 1,
      created_at: "2025-09-10T10:30:00Z",
      courses: { title: "Full Stack Web Development" },
      payment_method: "Credit Card",
      amount: 120,
      status: "completed",
      invoice_url: "#",
    },
    {
      id: 2,
      created_at: "2025-08-15T12:00:00Z",
      courses: { title: "UI/UX Design Essentials" },
      payment_method: "PayPal",
      amount: 80,
      status: "pending",
      invoice_url: null,
    },
    {
      id: 3,
      created_at: "2025-07-25T09:15:00Z",
      courses: { title: "Advanced JavaScript" },
      payment_method: "Credit Card",
      amount: 60,
      status: "failed",
      invoice_url: "#",
    },
  ]);

  const [subscriptions] = useState([
    {
      id: 1,
      plan_name: "Pro Plan",
      price: 25,
      status: "active",
      start_date: "2025-08-01",
      end_date: "2025-12-01",
      auto_renew: true,
    },
    {
      id: 2,
      plan_name: "Basic Plan",
      price: 10,
      status: "expired",
      start_date: "2025-04-01",
      end_date: "2025-08-01",
      auto_renew: false,
    },
  ]);

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const getStatusColor = (status) => {
    const colors = {
      completed: "#16a34a",
      pending: "#facc15",
      failed: "#dc2626",
      active: "#16a34a",
      cancelled: "#9ca3af",
      expired: "#f87171",
    };
    return colors[status] || "#9ca3af";
  };

  const totalSpent = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active"
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payments & Enrollments</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View
          style={[
            styles.card,
            { backgroundColor: "#ecfdf5", borderColor: "#16a34a" },
          ]}>
          <Text style={[styles.cardLabel, { color: "#15803d" }]}>
            Total Spent
          </Text>
          <Text style={[styles.cardValue, { color: "#065f46" }]}>
            {formatCurrency(totalSpent)}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: "#eff6ff", borderColor: "#3b82f6" },
          ]}>
          <Text style={[styles.cardLabel, { color: "#1d4ed8" }]}>
            Active Subscriptions
          </Text>
          <Text style={[styles.cardValue, { color: "#1e3a8a" }]}>
            {activeSubscriptions.length}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: "#fefce8", borderColor: "#facc15" },
          ]}>
          <Text style={[styles.cardLabel, { color: "#ca8a04" }]}>
            Total Transactions
          </Text>
          <Text style={[styles.cardValue, { color: "#854d0e" }]}>
            {payments.length}
          </Text>
        </View>
      </View>

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Subscriptions</Text>
          {subscriptions.map((sub) => (
            <View key={sub.id} style={styles.subscriptionCard}>
              <View style={styles.subscriptionHeader}>
                <View>
                  <Text style={styles.subscriptionName}>{sub.plan_name}</Text>
                  <Text style={styles.subscriptionPrice}>
                    {formatCurrency(sub.price)}
                    <Text style={styles.monthText}>/month</Text>
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(sub.status) },
                  ]}>
                  <Text style={styles.statusText}>{sub.status}</Text>
                </View>
              </View>
              <View style={styles.subscriptionDetails}>
                <Text style={styles.detailText}>
                  Start Date: {new Date(sub.start_date).toLocaleDateString()}
                </Text>
                <Text style={styles.detailText}>
                  End Date: {new Date(sub.end_date).toLocaleDateString()}
                </Text>
                <Text style={styles.detailText}>
                  Auto-Renew: {sub.auto_renew ? "Yes" : "No"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Purchase History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Purchase History</Text>
        {payments.length === 0 ? (
          <Text style={styles.noHistory}>No purchase history available</Text>
        ) : (
          payments.map((p) => (
            <View key={p.id} style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Date:</Text>
                <Text style={styles.paymentValue}>
                  {new Date(p.created_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Course:</Text>
                <Text style={styles.paymentValue}>
                  {p.courses?.title || "Subscription"}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Method:</Text>
                <Text style={styles.paymentValue}>
                  {p.payment_method || "Credit Card"}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Amount:</Text>
                <Text style={styles.paymentAmount}>
                  {formatCurrency(p.amount)}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Status:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(p.status) },
                  ]}>
                  <Text style={styles.statusText}>{p.status}</Text>
                </View>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Invoice:</Text>
                {p.invoice_url ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(p.invoice_url)}>
                    <Text style={styles.linkText}>View</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.naText}>N/A</Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    margin: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLabel: { fontSize: 14, fontWeight: "500", marginBottom: 6 },
  cardValue: { fontSize: 24, fontWeight: "700" },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  subscriptionCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subscriptionName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  subscriptionPrice: { fontSize: 20, fontWeight: "700", color: "#8BD02A" },
  monthText: { fontSize: 12, color: "#6b7280", fontWeight: "400" },
  subscriptionDetails: { marginTop: 4 },
  detailText: { fontSize: 13, color: "#4b5563", marginBottom: 2 },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  paymentLabel: { fontSize: 13, fontWeight: "500", color: "#4b5563" },
  paymentValue: { fontSize: 13, color: "#111827" },
  paymentAmount: { fontSize: 14, fontWeight: "600", color: "#111827" },
  linkText: { color: "#8BD02A", fontWeight: "600", fontSize: 13 },
  naText: { color: "#9ca3af", fontSize: 13 },
  noHistory: { fontSize: 14, color: "#6b7280", marginTop: 8 },
});

export default Payments;
