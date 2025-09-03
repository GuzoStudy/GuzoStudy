import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  PlayCircle,
  Clock,
  Users,
  Star,
  CheckCircle2,
  Lock,
  Download,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from "lucide-react-native";

const CourseDetailStudent = ({ route }) => {
  const { id } = route.params;
  const [activeModule, setActiveModule] = useState(-1);

  // Mock course data
  const course = {
    id: parseInt(id),
    title: "Complete React Development Course",
    instructor: "Sarah Johnson",
    rating: 4.8,
    students: 2840,
    duration: "42 hours",
    level: "Intermediate",
    language: "English",
    image:
      "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=600",
    description:
      "Master React from fundamentals to advanced concepts including hooks, context, and testing. This comprehensive course covers everything you need to become a professional React developer.",
    learningOutcomes: [
      "Build modern React applications from scratch",
      "Understand React hooks and functional components",
      "Implement state management with Context API",
      "Create responsive and accessible user interfaces",
      "Write comprehensive tests for React components",
      "Deploy React applications to production",
    ],
    prerequisites: [
      "Basic JavaScript knowledge",
      "HTML and CSS fundamentals",
      "Understanding of ES6+ features",
    ],
    modules: [
      {
        title: "Getting Started with React",
        lessons: [
          {
            id: 1,
            title: "Introduction to React",
            duration: "12:30",
            completed: true,
            locked: false,
          },
          {
            id: 2,
            title: "Setting up Development Environment",
            duration: "18:45",
            completed: true,
            locked: false,
          },
          {
            id: 3,
            title: "Your First React Component",
            duration: "15:20",
            completed: true,
            locked: false,
          },
          {
            id: 4,
            title: "JSX and React Elements",
            duration: "22:10",
            completed: false,
            locked: false,
          },
        ],
      },
      {
        title: "Components and Props",
        lessons: [
          {
            id: 5,
            title: "Functional vs Class Components",
            duration: "16:30",
            completed: false,
            locked: false,
          },
          {
            id: 6,
            title: "Props and Component Communication",
            duration: "20:15",
            completed: false,
            locked: false,
          },
          {
            id: 7,
            title: "Component Composition",
            duration: "14:45",
            completed: false,
            locked: false,
          },
          {
            id: 8,
            title: "Props Validation with PropTypes",
            duration: "11:20",
            completed: false,
            locked: false,
          },
        ],
      },
      {
        title: "State Management",
        lessons: [
          {
            id: 9,
            title: "Introduction to React Hooks",
            duration: "19:30",
            completed: false,
            locked: true,
          },
          {
            id: 10,
            title: "useState Hook Deep Dive",
            duration: "25:45",
            completed: false,
            locked: true,
          },
          {
            id: 11,
            title: "useEffect and Side Effects",
            duration: "28:20",
            completed: false,
            locked: true,
          },
          {
            id: 12,
            title: "Custom Hooks",
            duration: "22:15",
            completed: false,
            locked: true,
          },
        ],
      },
    ],
  };

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const completedLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.filter((lesson) => lesson.completed).length,
    0
  );
  const progress = Math.round((completedLessons / totalLessons) * 100);

  const toggleModule = (idx) => {
    setActiveModule(activeModule === idx ? -1 : idx);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.breadcrumb}>Courses / {course.title}</Text>
            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.instructor}>by {course.instructor}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Star size={16} color="#6b7280" />
                <Text style={styles.metaText}>
                  {course.rating} ({course.students.toLocaleString()} students)
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.metaText}>{course.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={16} color="#6b7280" />
                <Text style={styles.metaText}>{course.level}</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <Text style={styles.progressInfo}>
                Your Progress: {completedLessons}/{totalLessons} lessons
                completed
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
            </View>
          </View>

          <View style={styles.imageWrapper}>
            <Image source={{ uri: course.image }} style={styles.courseImage} />
            <TouchableOpacity style={styles.overlay}>
              <PlayCircle size={48} color="white" />
              <Text style={styles.overlayText}>Continue Learning</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Course</Text>
          <Text style={styles.sectionText}>{course.description}</Text>
        </View>

        {/* Learning Outcomes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          {course.learningOutcomes.map((outcome, i) => (
            <View style={styles.listItem} key={i}>
              <CheckCircle2 size={16} color="#059669" />
              <Text style={styles.listText}>{outcome}</Text>
            </View>
          ))}
        </View>

        {/* Prerequisites */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prerequisites</Text>
          {course.prerequisites.map((pr, i) => (
            <Text style={styles.listText} key={i}>
              • {pr}
            </Text>
          ))}
        </View>

        {/* Curriculum */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Course Curriculum ({totalLessons} lessons)
          </Text>
          {course.modules.map((mod, idx) => (
            <View key={idx} style={styles.module}>
              <TouchableOpacity
                style={styles.moduleHeader}
                onPress={() => toggleModule(idx)}>
                {activeModule === idx ? (
                  <ChevronDown size={16} color="#111827" />
                ) : (
                  <ChevronRight size={16} color="#111827" />
                )}
                <Text style={styles.moduleTitle}>{mod.title}</Text>
                <Text style={styles.lessonCount}>
                  {mod.lessons.length} lessons
                </Text>
              </TouchableOpacity>
              {activeModule === idx && (
                <View style={styles.lessonsList}>
                  {mod.lessons.map((lesson) => (
                    <View
                      key={lesson.id}
                      style={[
                        styles.lessonItem,
                        lesson.completed && styles.completed,
                        lesson.locked && styles.locked,
                      ]}>
                      <View style={styles.lessonInfo}>
                        {lesson.locked ? (
                          <Lock size={14} color="#6b7280" />
                        ) : lesson.completed ? (
                          <CheckCircle2 size={14} color="#059669" />
                        ) : (
                          <PlayCircle size={14} color="#6b7280" />
                        )}
                        <Text
                          style={[
                            styles.lessonTitle,
                            lesson.completed && styles.completedText,
                          ]}>
                          {lesson.title}
                        </Text>
                      </View>
                      <Text style={styles.lessonDuration}>
                        {lesson.duration}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.buttonPrimary}>
            <PlayCircle size={16} color="white" />
            <Text style={styles.buttonPrimaryText}> Continue Learning</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSecondary}>
            <Download size={16} color="#2563eb" />
            <Text style={styles.buttonSecondaryText}> Download Resources</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 16, backgroundColor: "white", marginBottom: 12 },
  headerInfo: { marginBottom: 12 },
  breadcrumb: { color: "#6b7280", marginBottom: 4 },
  title: { fontWeight: "700", fontSize: 24, color: "#1e293b" },
  instructor: { color: "#6b7280", marginVertical: 8 },
  metaRow: { flexDirection: "row", gap: 16, marginVertical: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { color: "#4b5563", fontSize: 14 },
  progressSection: { marginTop: 12 },
  progressInfo: { marginBottom: 8 },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 4,
  },
  imageWrapper: { marginTop: 12, position: "relative", alignSelf: "center" },
  courseImage: { width: 300, height: 180, borderRadius: 8 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  overlayText: { color: "white", marginTop: 8, fontWeight: "500" },
  section: { padding: 16, marginBottom: 12, backgroundColor: "white" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  sectionText: { color: "#4b5563", fontSize: 14, lineHeight: 20 },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  listText: { color: "#4b5563", fontSize: 14 },
  module: { marginBottom: 8, backgroundColor: "#F3F4F6", borderRadius: 4 },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    justifyContent: "space-between",
  },
  moduleTitle: {
    fontWeight: "600",
    color: "#1e293b",
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  lessonCount: { color: "#6b7280", fontSize: 12 },
  lessonsList: { paddingHorizontal: 12, paddingBottom: 8 },
  lessonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  lessonInfo: { flexDirection: "row", alignItems: "center", gap: 8 },
  lessonTitle: { color: "#4b5563", fontSize: 14 },
  completedText: { color: "#059669" },
  lessonDuration: { color: "#6b7280", fontSize: 12 },
  completed: {},
  locked: { opacity: 0.5 },
  buttonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: "center",
  },
  buttonPrimaryText: { color: "white", fontWeight: "600", marginLeft: 4 },
  buttonSecondary: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#2563eb",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    justifyContent: "center",
  },
  buttonSecondaryText: { color: "#2563eb", fontWeight: "600", marginLeft: 4 },
});

export default CourseDetailStudent;
