import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

export default function ResetPasswordPage({ route, navigation }) {
  const { email } = route.params;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter your new password.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://guzostudy.onrender.com/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to reset password.");
      Alert.alert("Success", "Password changed successfully!");
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handlePasswordChange}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Change Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f8fe",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
