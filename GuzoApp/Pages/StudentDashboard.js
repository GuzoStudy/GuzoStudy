import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  PlayCircle,
  ArrowRight,
  Menu,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../utils/api";

// ✅ Import your SidebarDashboard
import SidebarDashboard from "../components/SidebarStudent";

const StudentDashboard = () => {
  const navigation = useNavigation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Enrollments
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/enrollments/student/my-courses");
        if (!mounted) return;
        setEnrollments(res.data || []);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // ✅ Recent Courses
  const recentCourses = useMemo(() => {
    const mapped = (enrollments || []).map((en) => {
      const c = en.course || {};
      const totalLessons = Array.isArray(c.lessons)
        ? c.lessons.length
        : c.totalLessons || 0;
      const done = Array.isArray(en.progress)
        ? en.progress.filter((p) => p.completed).length
        : 0;
      const pct =
        totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0;

      return {
        id: c._id,
        title: c.title || "Untitled Course",
        instructor: c.instructor?.name || c.instructor || "Instructor",
        progress: pct,
        lastAccessed: en.updatedAt
          ? new Date(en.updatedAt).toLocaleString()
          : "—",
        image:
          c.image ||
          "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300",
      };
    });

    return mapped
      .sort(
        (a, b) =>
          new Date(b.lastAccessed).getTime() -
          new Date(a.lastAccessed).getTime()
      )
      .slice(0, 3);
  }, [enrollments]);

  // ✅ Stats
  const stats = useMemo(() => {
    const active = enrollments.filter((en) => {
      const total = Array.isArray(en.course?.lessons)
        ? en.course.lessons.length
        : en.course?.totalLessons || 0;
      const done = Array.isArray(en.progress)
        ? en.progress.filter((p) => p.completed).length
        : 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return pct < 100;
    }).length;

    const certs = enrollments.length - active;
    const hours = enrollments.length * 10;
    const avgScore = 87;

    return [
      {
        icon: BookOpen,
        label: "Active Courses",
        value: String(active),
        change: "",
        color: "#3b82f6",
      },
      {
        icon: Clock,
        label: "Hours Studied",
        value: String(hours),
        change: "",
        color: "#10b981",
      },
      {
        icon: Award,
        label: "Certificates",
        value: String(certs),
        change: "",
        color: "#facc15",
      },
      {
        icon: TrendingUp,
        label: "Average Score",
        value: `${avgScore}%`,
        change: "",
        color: "#a855f7",
      },
    ];
  }, [enrollments]);

  // ✅ Deadlines
  const upcomingDeadlines = [
    {
      id: 1,
      title: "Project Submission",
      course: "Any Course",
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      priority: "high",
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* ✅ Menu Bar */}
      <View style={styles.menuBar}>
        <TouchableOpacity
          onPress={() => setIsSidebarOpen(!isSidebarOpen)}
          style={styles.menuBtn}>
          <Menu size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Student Dashboard</Text>
      </View>

      {/* ✅ Sidebar */}
      {isSidebarOpen && (
        <SidebarDashboard
          style={styles.sidebar}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ✅ Main Content */}
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcome}>
            Welcome back to <Text style={styles.brand}>Guzo</Text> 👋
          </Text>
          <Text style={styles.subtitle}>
            Keep pushing forward — your learning journey is moving strong!
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View
                style={[styles.iconWrapper, { backgroundColor: stat.color }]}>
                <stat.icon size={28} color="white" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Continue Learning */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate("MyCoursesStudent")}>
              {/* 🔥 Changed from "Explore" to "MyCoursesStudent" */}
              <Text style={styles.link}>View All</Text>
              <ArrowRight size={16} color="#2563eb" />
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text>Loading…</Text>
          ) : recentCourses.length ? (
            recentCourses.map((course) => (
              <View key={course.id} style={styles.courseCard}>
                <Image
                  source={{ uri: course.image }}
                  style={styles.courseImage}
                />
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={styles.courseInstructor}>
                    by {course.instructor}
                  </Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${course.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{course.progress}%</Text>
                  </View>
                </View>
                <View style={styles.courseActions}>
                  <TouchableOpacity style={styles.continueBtn}>
                    <PlayCircle size={14} color="white" />
                    <Text style={styles.continueText}>Continue</Text>
                  </TouchableOpacity>
                  <Text style={styles.lastAccess}>{course.lastAccessed}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ color: "#6b7280" }}>No recent courses.</Text>
          )}
        </View>

        {/* Deadlines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
            <Calendar size={20} color="#6b7280" />
          </View>
          {upcomingDeadlines.map((deadline) => (
            <View
              key={deadline.id}
              style={[
                styles.deadlineCard,
                deadline.priority === "high"
                  ? styles.high
                  : deadline.priority === "medium"
                  ? styles.medium
                  : styles.low,
              ]}>
              <Text style={styles.deadlineTitle}>{deadline.title}</Text>
              <Text style={styles.deadlineCourse}>{deadline.course}</Text>
              <View style={styles.deadlineFooter}>
                <Text style={styles.deadlineDate}>
                  Due: {new Date(deadline.dueDate).toLocaleDateString()}
                </Text>
                <Text style={styles.deadlinePriority}>{deadline.priority}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.calendarBtn}>
            <Calendar size={16} color="#374151" />
            <Text style={styles.calendarText}>View Calendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ Styles (same as before with menubar added)
const styles = StyleSheet.create({
  menuBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    elevation: 3,
    marginTop: 16,
  },
  menuBtn: { marginRight: 12 },
  menuTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  header: { marginBottom: 24 },
  welcome: { fontSize: 22, fontWeight: "800", color: "#111827" },
  brand: { color: "#2563eb" },
  subtitle: { marginTop: 4, color: "#6b7280" },
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
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },
  iconWrapper: { padding: 8, borderRadius: 12, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: "700", color: "#111827" },
  statLabel: { color: "#6b7280" },
  section: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  row: { flexDirection: "row", alignItems: "center" },
  link: { color: "#2563eb", fontWeight: "600", marginRight: 4 },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
  },
  courseImage: { width: 64, height: 64, borderRadius: 8 },
  courseInfo: { flex: 1, marginLeft: 12 },
  courseTitle: { fontWeight: "600", color: "#111827" },
  courseInstructor: { fontSize: 12, color: "#6b7280" },
  progressRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    marginRight: 8,
  },
  progressFill: { height: "100%", backgroundColor: "#2563eb", borderRadius: 6 },
  progressText: { fontSize: 12, color: "#374151" },
  courseActions: { alignItems: "center", marginLeft: 8 },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  continueText: { color: "white", marginLeft: 4, fontSize: 12 },
  lastAccess: { fontSize: 10, color: "#9ca3af", marginTop: 4 },
  deadlineCard: { padding: 12, borderRadius: 8, marginBottom: 12 },
  high: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
    backgroundColor: "#fee2e2",
  },
  medium: {
    borderLeftWidth: 4,
    borderLeftColor: "#facc15",
    backgroundColor: "#fef9c3",
  },
  low: {
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
    backgroundColor: "#dcfce7",
  },
  deadlineTitle: { fontWeight: "600", color: "#111827" },
  deadlineCourse: { fontSize: 12, color: "#6b7280" },
  deadlineFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  deadlineDate: { fontSize: 10, color: "#6b7280" },
  deadlinePriority: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  calendarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  calendarText: { marginLeft: 6, color: "#374151", fontWeight: "600" },
});

export default StudentDashboard;
