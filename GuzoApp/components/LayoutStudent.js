import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Sidebar from "./Sidebar";
import Header from "./Header";

const LayoutStudent = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={styles.layout}>
      {sidebarOpen && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
      <View
        style={[
          styles.mainContent,
          { marginLeft: screenWidth > 768 && sidebarOpen ? 260 : 0 },
        ]}
      >
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <View style={styles.pageContent}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    flexDirection: "row",
    minHeight: "100%",
  },
  mainContent: {
    flex: 1,
    flexDirection: "column",
    transition: "margin-left 0.3s ease", // won’t work in RN, but left for clarity
  },
  pageContent: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
  },
});

export default LayoutStudent;
