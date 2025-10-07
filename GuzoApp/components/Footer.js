// Footer.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Terms")}>
            <Text style={styles.linkText}>Terms</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Contact")}>
            <Text style={styles.linkText}>Contact</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyText}>
          © 2025 GuzoStudy. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 24,
  },
  container: {
    maxWidth: 1024,
    alignSelf: "center",
    paddingHorizontal: 16,
    width: "100%",
    gap: 16,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  linkText: {
    color: "#4B5563",
    fontSize: 16,
  },
  copyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
  },
});
