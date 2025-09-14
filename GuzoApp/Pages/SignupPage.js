import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Footer from "../components/Footer";

function SignupPage() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!agreeTerms) {
      Alert.alert("Terms Required", "Please agree to the terms & conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://guzostudy.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("OtpVerificationPage", { email });
    } catch (err) {
      Alert.alert("Signup Failed", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>
          <Text style={styles.subtitle}>Join us and get started</Text>

          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
          />
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.options}>
            <TouchableOpacity
              style={styles.checkboxWrapper}
              onPress={() => setAgreeTerms(!agreeTerms)}>
              <View
                style={[
                  styles.checkboxBox,
                  agreeTerms && styles.checkboxChecked,
                ]}>
                {agreeTerms && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.optionText}>Agree to terms</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL("#")}>
              <Text style={styles.forgotPassword}>View Terms</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleSignup}
            disabled={loading}>
            <Text style={styles.loginBtnText}>
              {loading ? "Signing up..." : "Sign Up"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Already have an account?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("Login")}>
              Log in
            </Text>
          </Text>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

export default SignupPage;

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
