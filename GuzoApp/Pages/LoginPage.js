import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ForgetPassword from "./ForgetPassword";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

function LoginPage() {
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  return showForgetPassword ? (
    <ForgetPassword onBack={() => setShowForgetPassword(false)} />
  ) : (
    <LoginForm onForgotPassword={() => setShowForgetPassword(true)} />
  );
}

function LoginForm({ onForgotPassword }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://guzostudy.onrender.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      await AsyncStorage.setItem("token", data.token);

      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("StudentDashboard");
    } catch (err) {
      Alert.alert("Login Failed", err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Hey, welcome back</Text>

          <TextInput
            style={styles.input}
            placeholder="Your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.checkboxWrapper}
              onPress={() => setRememberMe(!rememberMe)}>
              <View
                style={[
                  styles.checkboxBox,
                  rememberMe && styles.checkboxChecked,
                ]}>
                {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.optionText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={styles.loginBtnText}>
              {loading ? "Loading..." : "Login"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            No account yet?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("Signup")}>
              Create one
            </Text>
          </Text>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f8fe",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#555",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  checkboxTick: {
    color: "#fff",
    fontSize: 12,
  },
  optionText: {
    color: "#555",
    fontSize: 14,
  },
  forgotPassword: {
    color: "#3b82f6",
    fontSize: 14,
  },
  loginBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  signupText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  signupLink: {
    color: "#3b82f6",
    fontWeight: "500",
  },
});
