import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

function PrivacyPolicy() {
  return (
    <>
      <Header />
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Privacy Policy</Text>

          <Text style={styles.paragraph}>
            At <Text style={styles.bold}>GuzoStudy</Text>, your privacy is very
            important to us. This Privacy Policy explains how we collect, use,
            and protect your personal information when you use our services.
          </Text>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Personal details like your name, email address, and password.
            </Text>
            <Text style={styles.listItem}>
              • Information related to your role as a student or teacher,
              including course activity.
            </Text>
            <Text style={styles.listItem}>
              • Usage data such as IP address, browser type, and device info.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            2. How We Use Your Information
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • To create and manage your account.
            </Text>
            <Text style={styles.listItem}>
              • To personalize your learning experience.
            </Text>
            <Text style={styles.listItem}>
              • To improve our platform’s performance, security, and usability.
            </Text>
            <Text style={styles.listItem}>
              • To communicate updates, announcements, or support.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
          <Text style={styles.paragraph}>
            We do not sell or rent your personal information. We may share
            information only with trusted partners who help us operate our
            platform, comply with legal obligations, or protect our users.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.paragraph}>
            We use industry-standard security practices to protect your data.
            However, no method of transmission over the internet is 100% secure.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>
              • Access, update, or delete your personal data.
            </Text>
            <Text style={styles.listItem}>
              • Request a copy of the data we hold about you.
            </Text>
            <Text style={styles.listItem}>
              • Opt-out of promotional communications.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>6. Updates to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. Any changes
            will be posted here with an updated “last updated” date.
          </Text>

          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact
            us at:{" "}
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:support@guzostudy.com")}>
            <Text style={styles.link}>support@guzostudy.com</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Last updated: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 12,
    lineHeight: 20,
  },
  list: {
    marginLeft: 12,
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "600",
  },
  link: {
    color: "#2563EB",
    textDecorationLine: "underline",
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 20,
  },
});

export default PrivacyPolicy;
