import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Auth & onboarding
import OtpVerificationPage from "./Pages/OtpVerificationPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";

// Main pages
import Home from "./Pages/Home";
import StudentDashboard from "./Pages/StudentDashboard";
import ExploreStudent from "./Pages/ExploreStudent";
import MyCoursesStudent from "./Pages/MyCoursesStudent";
import ProfileStudent from "./Pages/ProfileStudent";
import CourseDetailStudent from "./Pages/CourseDetailStudent"; // ✅ IMPORTED

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        {/* Public / entry routes */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen
          name="OtpVerificationPage"
          component={OtpVerificationPage}
          options={{ headerShown: true, title: "Verify OTP" }}
        />

        {/* Student area */}
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        <Stack.Screen name="ExploreStudent" component={ExploreStudent} />
        <Stack.Screen name="MyCoursesStudent" component={MyCoursesStudent} />
        <Stack.Screen name="ProfileStudent" component={ProfileStudent} />
        <Stack.Screen name="CourseDetail" component={CourseDetailStudent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
