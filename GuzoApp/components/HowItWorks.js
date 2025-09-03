import React from "react";
import { View, Text, ScrollView } from "react-native";

export default function HowItWorks() {
  const steps = [
    {
      icon: "👤", 
      title: "Sign up",
      subtitle: "",
    },
    {
      icon: "📋", 
      title: "Enroll in a course",
      subtitle: "",
    },
    {
      icon: "▶️",
      title: "Join live class or learn at your place",
      subtitle: "",
    },
  ];

  return (
    <ScrollView style={{ backgroundColor: "#F9FAFB", paddingVertical: 32 }}>
      <View
        style={{ maxWidth: 1024, alignSelf: "center", paddingHorizontal: 16 }}>
        {/* Header */}
        <View style={{ marginBottom: 48, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "#111827",
              textAlign: "center",
            }}>
            How It Works
          </Text>
        </View>

        {/* Steps Grid */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}>
          {steps.map((step, index) => (
            <View
              key={index}
              style={{
                width: "30%",
                alignItems: "center",
                marginBottom: 32,
              }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 24,
                  backgroundColor: "#22C55E", 
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 24,
                }}>
                <Text style={{ color: "white", fontSize: 32 }}>
                  {step.icon}
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: step.subtitle ? 8 : 0,
                  textAlign: "center",
                }}>
                {step.title}
              </Text>

              {step.subtitle ? (
                <Text style={{ color: "#4B5563", textAlign: "center" }}>
                  {step.subtitle}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
