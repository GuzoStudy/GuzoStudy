import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet,
} from "react-native";

const Profile = () => {
  const mockProfile = {
    full_name: "Cedy N.",
    bio: "Passionate learner exploring web development and UI design.",
    profile_picture: "https://i.pravatar.cc/120?img=12",
    contact_info: {
      email: "cedy@example.com",
      phone: "+251912345678",
    },
    learning_preferences: {
      topics: ["React", "TailwindCSS", "Laravel"],
      language: "en",
      notifications: true,
    },
  };

  const [formData, setFormData] = useState(mockProfile);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleContactChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      contact_info: { ...prev.contact_info, [key]: value },
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      learning_preferences: {
        ...prev.learning_preferences,
        [key]: value,
      },
    }));
  };

  const handleTopicsChange = (text) => {
    const topics = text.split(",").map((t) => t.trim());
    handlePreferenceChange("topics", topics);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Profile</Text>

      {/* PERSONAL INFO */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {!editing ? (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setEditing(false)}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditing(false)}
                style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Image
            source={{ uri: formData.profile_picture }}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.label}>Profile Picture URL</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          value={formData.profile_picture}
          onChangeText={(val) => handleChange("profile_picture", val)}
          editable={editing}
        />

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          value={formData.full_name}
          onChangeText={(val) => handleChange("full_name", val)}
          editable={editing}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            !editing && styles.disabledInput,
          ]}
          multiline
          numberOfLines={3}
          value={formData.bio}
          onChangeText={(val) => handleChange("bio", val)}
          editable={editing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          value={formData.contact_info.email}
          onChangeText={(val) => handleContactChange("email", val)}
          editable={editing}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          value={formData.contact_info.phone}
          onChangeText={(val) => handleContactChange("phone", val)}
          editable={editing}
        />
      </View>

      {/* LEARNING PREFERENCES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Preferences</Text>

        <Text style={styles.label}>Topics of Interest</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          value={formData.learning_preferences.topics.join(", ")}
          onChangeText={handleTopicsChange}
          editable={editing}
        />

        <Text style={styles.label}>Preferred Language</Text>
        <TextInput
          style={[styles.input, !editing && styles.disabledInput]}
          value={formData.learning_preferences.language}
          onChangeText={(val) => handlePreferenceChange("language", val)}
          editable={editing}
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Enable Notifications</Text>
          <Switch
            value={formData.learning_preferences.notifications}
            onValueChange={(val) =>
              handlePreferenceChange("notifications", val)
            }
            disabled={!editing}
            thumbColor={
              formData.learning_preferences.notifications ? "#8BD02A" : "#ccc"
            }
          />
        </View>
      </View>

      {/* SECURITY SECTION */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity
            onPress={() => setChangingPassword(!changingPassword)}
            style={[
              styles.passwordButton,
              changingPassword
                ? styles.cancelPasswordButton
                : styles.changePasswordButton,
            ]}>
            <Text
              style={[
                styles.passwordButtonText,
                changingPassword && { color: "#333" },
              ]}>
              {changingPassword ? "Cancel" : "Change Password"}
            </Text>
          </TouchableOpacity>
        </View>

        {changingPassword && (
          <View>
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="New Password"
              value={passwordData.newPassword}
              onChangeText={(text) =>
                setPasswordData((prev) => ({ ...prev, newPassword: text }))
              }
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChangeText={(text) =>
                setPasswordData((prev) => ({ ...prev, confirmPassword: text }))
              }
            />
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    color: "#111827",
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
  },
  textArea: {
    height: 80,
  },
  editButton: {
    backgroundColor: "#8BD02A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#8BD02A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  passwordButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changePasswordButton: {
    backgroundColor: "#8BD02A",
  },
  cancelPasswordButton: {
    backgroundColor: "#E5E7EB",
  },
  passwordButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
