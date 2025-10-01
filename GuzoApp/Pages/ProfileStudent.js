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
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
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
      Alert.alert("Error", "Could not update profile.");
    }
  };

  const handleCancel = () => setIsEditing(false);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const renderOverview = () => (
    <View>
      {["name", "email", "phone", "location", "bio"].map((field) => (
        <View key={field} style={styles.field}>
          <Text style={styles.label}>{field}</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, field === "bio" && styles.textArea]}
              multiline={field === "bio"}
              value={profile[field] || ""}
              onChangeText={(val) => handleInputChange(field, val)}
            />
          ) : (
            <Text style={styles.value}>{profile[field] || "Not set"}</Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Feather name="user" size={40} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>

          {profile.joinDate && (
            <View style={styles.metaRow}>
              <Feather name="calendar" size={16} color="#6b7280" />
              <Text style={styles.meta}>
                Joined {new Date(profile.joinDate).toLocaleDateString()}
              </Text>
            </View>
          )}
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

      <Text style={styles.sectionTitle}>Profile Information</Text>
      <View style={styles.content}>{renderOverview()}</View>
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
  sectionTitle: { fontWeight: "600", fontSize: 16, marginBottom: 8 },
  content: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
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
});

export default ProfileStudent;
