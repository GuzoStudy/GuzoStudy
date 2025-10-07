// src/pages/Terms.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Terms = () => {
  return (
    <View style={styles.screen}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Terms & Conditions</Text>

        <View style={styles.section}>
          <Text style={styles.paragraph}>
            Welcome to <Text style={styles.bold}>GuzoStudy</Text>! By accessing
            or using our platform, you agree to comply with and be bound by
            these Terms and Conditions. Please read them carefully.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>1. Use of Service: </Text>
            You agree to use our platform for lawful purposes only. You shall
            not engage in any activity that could harm, disrupt, or interfere
            with the platform or its users.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>2. Account Responsibility: </Text>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>3. Content: </Text>
            All course content provided on GuzoStudy is the property of its
            respective creators. You may not copy, distribute, or reproduce
            content without permission.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>4. Payments: </Text>
            Any paid courses or services must be purchased through our official
            payment channels. Refunds and cancellations are subject to our
            payment policies.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>5. Modifications: </Text>
            GuzoStudy reserves the right to update or modify these Terms at any
            time. Continued use of the platform constitutes acceptance of the
            updated Terms.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>6. Limitation of Liability: </Text>
            GuzoStudy is not responsible for any damages, losses, or issues
            arising from the use of the platform or courses.
          </Text>

          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us via
            our Contact page.
          </Text>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 12,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
});

export default Terms;
