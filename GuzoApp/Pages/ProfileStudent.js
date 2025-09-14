import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileStudent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: "",
    timezone: "",
    learningGoal: "",
    weeklyGoal: "",
  });

  const achievements = [
    {
      id: 1,
      title: "Amharic Web Developer",
      description: "Completed Guzo’s React in Amharic course",
      date: "2024-12-15",
      icon: "award",
      color: "#2563eb",
    },
    {
      id: 2,
      title: "Digital Innovator",
      description: "Presented project in local hackathon",
      date: "2024-11-28",
      icon: "award",
      color: "#8b5cf6",
    },
    {
      id: 3,
      title: "Early Guzo Explorer",
      description: "Joined Guzo community in 2024",
      date: "2024-03-10",
      icon: "calendar",
      color: "#059669",
    },
  ];

  const learningStats = [
    { label: "Courses Completed", value: "5", icon: "book-open" },
    { label: "Total Study Time", value: "142h", icon: "clock" },
    { label: "Current Streak", value: "21 days", icon: "target" },
    { label: "Certificates Earned", value: "3", icon: "award" },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Finished "JavaScript ከመሠረት እስከ ላይ"',
      date: "4 hours ago",
      icon: "book-open",
    },
    {
      id: 2,
      title: 'Earned "Amharic Web Developer" certificate',
      date: "2 days ago",
      icon: "award",
    },
    {
      id: 3,
      title: 'Started "Python for Data Science"',
      date: "1 week ago",
      icon: "book-open",
    },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Fetched token:", token);

        if (!token) {
          console.warn("No token found");
          Alert.alert("Session Expired", "Please log in again.");
          return;
        }

        const response = await axios.get(
          "https://guzostudy.onrender.com/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err.message);
        Alert.alert("Error", "Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.warn("No token found during save");
        Alert.alert("Session Expired", "Please log in again.");
        return;
      }

      await axios.put(
        "https://guzostudy.onrender.com/api/users/profile",
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Profile updated!");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err.message);
      Alert.alert("Error", "Could not update profile.");
    }
  };

  const handleCancel = () => setIsEditing(false);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const renderOverview = () => (
    <View style={styles.grid}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {["firstName", "lastName", "email", "phone", "location", "bio"].map(
          (field) => (
            <View key={field} style={styles.field}>
              <Text style={styles.label}>{field}</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, field === "bio" && styles.textArea]}
                  multiline={field === "bio"}
                  value={profile[field]}
                  onChangeText={(val) => handleInputChange(field, val)}
                />
              ) : (
                <Text style={styles.value}>{profile[field]}</Text>
              )}
            </View>
          )
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Preferences</Text>
        {["learningGoal", "weeklyGoal", "timezone"].map((field) => (
          <View key={field} style={styles.field}>
            <Text style={styles.label}>{field}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profile[field]}
                onChangeText={(val) => handleInputChange(field, val)}
              />
            ) : (
              <Text style={styles.value}>{profile[field]}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={40} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.email}>{profile.email}</Text>

          <View style={styles.metaRow}>
            <Feather name="calendar" size={16} color="#6b7280" />
            <Text style={styles.meta}>
              Joined {new Date(profile.joinDate).toLocaleDateString()}
            </Text>
            <Feather
              name="map-pin"
              size={16}
              color="#6b7280"
              style={{ marginLeft: 16 }}
            />
            <Text style={styles.meta}>{profile.location}</Text>
          </View>
        </View>

        <View>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
            >
              <Feather name="edit-2" size={16} color="#fff" />
              <Text style={styles.btnText}> Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.editBtn, { backgroundColor: "#059669" }]}
                onPress={handleSave}
              >
                <Feather name="save" size={16} color="#fff" />
                <Text style={styles.btnText}> Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editBtn, { backgroundColor: "#f1f5f9" }]}
                onPress={handleCancel}
              >
                <Feather name="x" size={16} color="#374151" />
                <Text style={[styles.btnText, { color: "#374151" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Learning on Guzo</Text>
      <View style={styles.statsGrid}>
        {learningStats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Feather name={s.icon} size={24} color="#2563eb" />
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tabRow}>
        {["overview", "achievements", "activity"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabBtn, activeTab === tab && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "achievements"
                ? "Achievements"
                : "Recent Activity"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === "overview" && renderOverview()}

        {activeTab === "achievements" && (
          <FlatList
            data={achievements}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.achievement}>
                <Feather name={item.icon} size={22} color={item.color} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.achTitle}>{item.title}</Text>
                  <Text style={styles.achDesc}>{item.description}</Text>
                  <Text style={styles.achDate}>
                    Earned {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            )}
          />
        )}

        {activeTab === "activity" && (
          <FlatList
            data={recentActivity}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.activity}>
                <Feather name={item.icon} size={18} color="#2563eb" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityDate}>{item.date}</Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f9fafb", padding: 16 },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,
  },
  avatar: {
    backgroundColor: "#2563eb",
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  name: { fontSize: 22, fontWeight: "700" },
  email: { color: "#6b7280" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  meta: { color: "#6b7280", marginLeft: 4 },
  editBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  btnText: { fontWeight: "600", color: "#fff", marginLeft: 4 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { color: "#6b7280" },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 16,
  },
  tabBtn: { flex: 1, alignItems: "center", paddingVertical: 8 },
  tabActive: { borderBottomWidth: 2, borderColor: "#2563eb" },
  tabText: { color: "#6b7280" },
  tabTextActive: { color: "#2563eb", fontWeight: "600" },
  content: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  grid: { flexDirection: "row", justifyContent: "space-between" },
  section: { width: "48%" },
  sectionTitle: { fontWeight: "600", fontSize: 16, marginBottom: 8 },
  field: { marginBottom: 12 },
  label: { fontSize: 13, color: "#6b7280" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  textArea: { height: 80, textAlignVertical: "top" },
  value: { marginTop: 4, color: "#111827" },
  achievement: { flexDirection: "row", marginBottom: 12, alignItems: "center" },
  achTitle: { fontWeight: "600", fontSize: 15 },
  achDesc: { color: "#6b7280" },
  achDate: { color: "#9ca3af", fontSize: 12 },
  activity: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  activityTitle: { fontSize: 14 },
  activityDate: { fontSize: 12, color: "#9ca3af" },
});

export default ProfileStudent;
