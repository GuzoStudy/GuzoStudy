import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

export default function OtpVerificationPage({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Verify OTP function
  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://guzostudy.onrender.com/api/users/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response. Try again later.");
      }

      if (!response.ok) throw new Error(data.message || "Invalid OTP.");
      Alert.alert("Success", "OTP verified!");
      navigation.navigate("ResetPassword", { email });
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function
  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await fetch(
        "https://guzostudy.onrender.com/api/users/resend-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid server response.");
      }

      if (!response.ok)
        throw new Error(data.message || "Failed to resend OTP.");
      Alert.alert("Success", "OTP resent successfully!");
      setTimer(30); 
    } catch (err) {
      Alert.alert("Error", err.message || "Could not resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter OTP sent to {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleVerifyOtp}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 15, alignItems: "center" }}>
        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={resendLoading || timer > 0}>
          <Text
            style={[
              styles.resendText,
              (resendLoading || timer > 0) && { color: "#999" },
            ]}>
            {resendLoading
              ? "Resending..."
              : timer > 0
              ? `Resend OTP in ${timer}s`
              : "Resend OTP"}
          </Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendText: {
    fontSize: 15,
    color: "#3b82f6",
    fontWeight: "bold",
  },
});
