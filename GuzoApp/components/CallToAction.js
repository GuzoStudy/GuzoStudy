import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

function CallToAction() {
  const navigation = useNavigation();
  return (
    <View style={styles.section}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.heading}>Ready to start learning?</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={styles.button}>
            <Text style={styles.buttonText}>Join Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 64,
  },
  container: {
    maxWidth: 1024,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  box: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 48,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 32,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonText: {
    color: "#2563eb",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default CallToAction;
