import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import SidebarStudent from "../components/SidebarStudent";
import { Menu, Search } from "lucide-react-native";

const API_BASE = "https://guzostudy.onrender.com/api/courses";

const ExploreStudent = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const isLoggedIn = !!token;

  useEffect(() => {
    const loadTokenAndCourses = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) setToken(savedToken);

        const res = await axios.get(`${API_BASE}/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTokenAndCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!isLoggedIn) {
      navigation.navigate("Signup");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/enrollments/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Successfully enrolled!");
      navigation.navigate("MyCoursesStudent");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Failed to enroll.");
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (course.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setIsSidebarOpen(!isSidebarOpen)}
          style={styles.menuBtn}>
          <Menu size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Explore Courses</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Sidebar */}
      {isSidebarOpen && (
        <SidebarStudent
          style={styles.sidebar}
          navigation={navigation}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Courses */}
        <View style={styles.grid}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <View key={course._id} style={styles.card}>
                <Image
                  source={{
                    uri:
                      course.thumbnail ||
                      "https://i.pinimg.com/1200x/69/e2/b3/69e2b3be6001c33141a95557a5f2cbcd.jpg",
                  }}
                  style={styles.thumbnail}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseDescription}>
                    {course.description}
                  </Text>
                  <View style={styles.tagContainer}>
                    <Text style={styles.tag}>{course.category}</Text>
                    <Text style={styles.tag}>{course.language}</Text>
                    {(course.tags || []).slice(0, 2).map((tag, i) => (
                      <Text key={i} style={[styles.tag, styles.greenTag]}>
                        {tag}
                      </Text>
                    ))}
                  </View>
                  <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>
                      ⭐ {course.averageRating?.toFixed(1) || 0}
                    </Text>
                    <Text style={styles.metaText}>
                      👥 {course.enrollmentCount || 0}
                    </Text>
                  </View>
                  <Text style={styles.price}>
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("CourseDetail", { id: course._id })
                    }>
                    <Text style={styles.buttonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noCourses}>No courses found.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "white",
    elevation: 3,
    marginTop: 16,
    justifyContent: "space-between",
  },
  menuBtn: {
    marginRight: 12,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  container: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    paddingBottom: 60,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: "#6B7280" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    padding: 10,
    paddingLeft: 36,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    width: "48%",
    overflow: "hidden",
    elevation: 2,
  },
  thumbnail: { width: "100%", height: 120, resizeMode: "cover" },
  cardContent: { padding: 12 },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  courseDescription: { fontSize: 12, color: "#6B7280", marginBottom: 8 },
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  tag: {
    fontSize: 10,
    backgroundColor: "#E5E7EB",
    color: "#374151",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  greenTag: { backgroundColor: "#D1FAE5", color: "#065F46" },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metaText: { fontSize: 12, color: "#6B7280" },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  noCourses: { textAlign: "center", color: "#6B7280", marginTop: 20 },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    elevation: 5,
    zIndex: 100,
  },
});

export default ExploreStudent;
