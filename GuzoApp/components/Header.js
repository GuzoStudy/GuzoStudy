import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Header({ userRole }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
        paddingVertical: 16,
      }}>
      <View
        style={{
          maxWidth: 1024,
          alignSelf: "center",
          paddingHorizontal: 16,
          width: "100%",
          paddingTop: 20, 
        }}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
          }}>
          {/* Logo */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12, 
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#2563EB",
              }}>
              Guzo
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#1F2937",
                marginLeft: 4,
              }}>
              Study
            </Text>
          </TouchableOpacity>

          {/* Navigation (navbar under logo) */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <TouchableOpacity onPress={() => navigation.navigate("Explore")}>
              <Text
                style={{
                  color: "#374151", 
                  fontSize: 16,
                  marginHorizontal: 8,
                }}>
                Explore
              </Text>
            </TouchableOpacity>

            {userRole === "teacher" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("TeacherDashboard")}>
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 16,
                    marginHorizontal: 8,
                  }}>
                  Teacher Dashboard
                </Text>
              </TouchableOpacity>
            )}

            {userRole === "student" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("StudentDashboard")}>
                <Text
                  style={{
                    color: "#374151",
                    fontSize: 16,
                    marginHorizontal: 8,
                  }}>
                  Student Dashboard
                </Text>
              </TouchableOpacity>
            )}

            {!userRole && (
              <>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text
                    style={{
                      color: "#374151",
                      fontSize: 16,
                      marginHorizontal: 8,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("Signup")}
                  style={{
                    backgroundColor: "#2563EB",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    marginLeft: 8,
                  }}>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                    }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
