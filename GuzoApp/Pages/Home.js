import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, FlatList } from "react-native";

import Header from "../components/Header";
import Hero from "../components/Hero";
import PopularCourses from "../components/PopularCourses";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  // create an array just to drive FlatList
  const sections = [
    { key: "hero", component: <Hero /> },
    { key: "popular", component: <PopularCourses /> },
    { key: "howitworks", component: <HowItWorks /> },
    { key: "cta", component: <CallToAction /> },
    { key: "footer", component: <Footer /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.component}
        
        ListHeaderComponent={<Header />}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
