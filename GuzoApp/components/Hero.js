import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Hero() {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ backgroundColor: "#F9FAFB" }}>
      <View
        style={{
          maxWidth: 1024,
          alignSelf: "center",
          padding: 16,
          paddingVertical: 32,
        }}>
        <View style={{ flexDirection: "column", gap: 24 }}>
          {/* Text Content */}
          <View style={{ gap: 24 }}>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
                color: "#111827",
                lineHeight: 50,
              }}>
              Learn{"\n"}
              Anywhere,{"\n"}
              Anytime
            </Text>

            <Text
              style={{
                fontSize: 18,
                color: "#4B5563",
                lineHeight: 26,
              }}>
              Join live classes or explore on-demand courses.
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Signup")}
                style={{
                  backgroundColor: "#2563EB",
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 18,
                    fontWeight: "600",
                  }}>
                  Get Started
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Explore")}
                style={{
                  backgroundColor: "#E5E7EB",
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  borderRadius: 12,
                }}>
                <Text
                  style={{
                    color: "#1F2937",
                    fontSize: 18,
                    fontWeight: "600",
                  }}>
                  Browse Courses
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Decorative Illustration Box */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 24,
            }}>
            {/* Main Box */}
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 20,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                transform: [{ rotate: "3deg" }],
              }}>
              <View
                style={{
                  backgroundColor: "#F3F4F6",
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 16,
                  alignItems: "center",
                }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "#FACC15",
                    marginBottom: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Text style={{ color: "white", fontSize: 28 }}>✔</Text>
                </View>
                <View
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 48,
                    backgroundColor: "#FEF9C3",
                  }}
                />
              </View>
            </View>

            {/* Floating Icon Box */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 16,
                transform: [{ rotate: "-6deg" }],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#3B82F6",
                  borderRadius: 8,
                  marginBottom: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text style={{ color: "white", fontSize: 20 }}>★</Text>
              </View>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: "#2563EB",
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
