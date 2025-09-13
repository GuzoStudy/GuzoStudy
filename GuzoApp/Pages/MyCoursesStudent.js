import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { PlayCircle, CheckCircle2, Clock, Award } from "lucide-react-native";
import api from "../utils/api";

const StatsCard = ({ icon, label, value, bgColor }) => (
  <View style={[styles.statCard, { backgroundColor: "#fff" }]}>
    <View style={[styles.statIcon, { backgroundColor: bgColor }]}>{icon}</View>
    <View style={styles.statContent}>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const CourseItem = ({ item, navigation }) => (
  <View style={styles.courseCard}>
    <Image source={{ uri: item.image }} style={styles.courseImage} />
    <View style={styles.courseContent}>
      <View style={styles.courseHeaderRow}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => Alert.alert("Continue to course", item.courseId)}>
          <PlayCircle size={16} color="#fff" />
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.courseInstructor}>by {item.instructor}</Text>
      <View style={styles.progressRow}>
        <Text>
          {item.completedLessons}/{item.totalLessons} lessons
        </Text>
        <Text>{item.estimatedTime}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
      </View>
      <Text style={styles.lastAccessed}>Last accessed {item.lastAccessed}</Text>
    </View>
  </View>
);

const MyCoursesStudent = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.get("/enrollments/student/my-courses");
        if (!mounted) return;
        setEnrollments(res.data || []);
      } catch (e) {
        setErr(
          e?.response?.data?.message ||
            "Failed to load your courses. Try again."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const withComputed = useMemo(() => {
    return (enrollments || []).map((en) => {
      const course = en.course || {};
      const totalLessons = Array.isArray(course.lessons)
        ? course.lessons.length
        : course.totalLessons || 0;
      const completedLessons = Array.isArray(en.progress)
        ? en.progress.filter((p) => p.completed).length
        : 0;
      const progressPct = totalLessons
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

      return {
        _id: en._id,
        courseId: course._id,
        title: course.title || "Untitled Course",
        instructor:
          course.instructor?.name || course.instructor || "Instructor",
        image:
          course.image ||
          "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400",
        totalLessons,
        completedLessons,
        progress: progressPct,
        estimatedTime: course.estimatedTime || "",
        lastAccessed: en.updatedAt
          ? new Date(en.updatedAt).toLocaleString()
          : "—",
        certificateAvailable: progressPct === 100,
        completedDate: en.completedAt || null,
        rating: en.rating || 0,
      };
    });
  }, [enrollments]);

  const activeCourses = useMemo(
    () => withComputed.filter((c) => c.progress < 100),
    [withComputed]
  );
  const completedCourses = useMemo(
    () => withComputed.filter((c) => c.progress >= 100),
    [withComputed]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  if (err) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{err}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>My Courses</Text>
      <Text style={styles.pageSubtitle}>
        Track your learning progress and continue your journey.
      </Text>

      <View style={styles.statsGrid}>
        <StatsCard
          icon={<PlayCircle size={24} color="#fff" />}
          label="Active Courses"
          value={activeCourses.length}
          bgColor="#3b82f6"
        />
        <StatsCard
          icon={<CheckCircle2 size={24} color="#fff" />}
          label="Completed"
          value={completedCourses.length}
          bgColor="#10b981"
        />
        <StatsCard
          icon={<Clock size={24} color="#fff" />}
          label="Hours Remaining"
          value={`${withComputed.length * 10}h`}
          bgColor="#f59e0b"
        />
        <StatsCard
          icon={<Award size={24} color="#fff" />}
          label="Certificates"
          value={completedCourses.length}
          bgColor="#8b5cf6"
        />
      </View>

      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setActiveTab("active")}
          style={[
            styles.tabButton,
            activeTab === "active" && styles.activeTabButton,
          ]}>
          <PlayCircle
            size={16}
            color={activeTab === "active" ? "#2563eb" : "#6b7280"}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "active" ? "#2563eb" : "#6b7280" },
            ]}>
            Active ({activeCourses.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("completed")}
          style={[
            styles.tabButton,
            activeTab === "completed" && styles.activeTabButton,
          ]}>
          <CheckCircle2
            size={16}
            color={activeTab === "completed" ? "#2563eb" : "#6b7280"}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "completed" ? "#2563eb" : "#6b7280" },
            ]}>
            Completed ({completedCourses.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "active" ? (
        <FlatList
          data={activeCourses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <CourseItem item={item} />}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          data={completedCourses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <CourseItem item={item} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "red" },
  pageTitle: { fontSize: 28, fontWeight: "700", color: "#1f2937" },
  pageSubtitle: { color: "#6b7280", marginBottom: 16 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  statContent: { marginLeft: 12 },
  statNumber: { fontSize: 24, fontWeight: "700", color: "#1f2937" },
  statLabel: { fontSize: 12, color: "#6b7280" },
  tabRow: { flexDirection: "row", marginVertical: 16 },
  tabButton: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  activeTabButton: { borderBottomWidth: 2, borderBottomColor: "#2563eb" },
  tabText: { marginLeft: 4 },
  listContainer: { paddingBottom: 20 },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  courseImage: { width: "100%", height: 180 },
  courseContent: { padding: 12 },
  courseHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseTitle: { fontSize: 18, fontWeight: "600", color: "#1f2937" },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 8,
  },
  continueText: { color: "#fff", marginLeft: 4 },
  courseInstructor: { fontSize: 14, color: "#6b7280", marginVertical: 4 },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: { height: "100%", backgroundColor: "#2563eb" },
  lastAccessed: { fontSize: 12, color: "#6b7280" },
});

export default MyCoursesStudent;
