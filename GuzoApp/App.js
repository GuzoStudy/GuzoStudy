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
import Explore from "./Pages/Explore";
import ExploreStudent from "./Pages/ExploreStudent";
import MyCoursesStudent from "./Pages/MyCoursesStudent";
import ProfileStudent from "./Pages/ProfileStudent";
import CourseDetailStudent from "./Pages/CourseDetailStudent";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import Terms from "./Pages/Terms";
import Contact from "./Pages/Contact";
import Notification from "./Pages/Notification";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
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
        <Stack.Screen name="Explore" component={Explore} />
        <Stack.Screen name="MyCoursesStudent" component={MyCoursesStudent} />
        <Stack.Screen name="ProfileStudent" component={ProfileStudent} />
        <Stack.Screen name="CourseDetail" component={CourseDetailStudent} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{ title: "Notifications" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
