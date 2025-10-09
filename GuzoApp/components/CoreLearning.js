import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export const CoreLearning = () => {
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [upcomingLessons, setUpcomingLessons] = useState([]);
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setEnrollments([
        {
          id: 1,
          courses: { title: "React Fundamentals", instructor_name: "John Doe" },
          status: "in-progress",
          progress_percentage: 65,
        },
        {
          id: 2,
          courses: {
            title: "Advanced JavaScript",
            instructor_name: "Jane Smith",
          },
          status: "completed",
          progress_percentage: 100,
        },
      ]);

      setUpcomingLessons([
        {
          id: 1,
          title: "React Hooks Deep Dive",
          courses: { title: "React Fundamentals" },
          scheduled_at: "2025-10-05T15:00:00Z",
        },
        {
          id: 2,
          title: "JavaScript Closures Workshop",
          courses: { title: "Advanced JavaScript" },
          scheduled_at: "2025-10-08T18:00:00Z",
        },
      ]);

      setUpcomingQuizzes([
        {
          id: 1,
          title: "React Basics Quiz",
          courses: { title: "React Fundamentals" },
          total_questions: 10,
          scheduled_at: "2025-10-06T14:00:00Z",
        },
      ]);

      setCertificates([
        {
          id: 1,
          courses: {
            title: "Advanced JavaScript",
            instructor_name: "Jane Smith",
          },
          issued_at: "2025-08-01T00:00:00Z",
          certificate_url: "#",
        },
      ]);

      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#8BD02A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>My Learning Journey</Text>
        <Text style={styles.subtitle}>
          Track your progress and continue learning
        </Text>

        {/* --- Enrolled Courses --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Enrolled Courses</Text>
          {enrollments.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📖</Text>
              <Text style={styles.emptyText}>No enrolled courses yet</Text>
              <Text style={styles.emptySub}>
                Start your learning journey today!
              </Text>
            </View>
          ) : (
            enrollments.map((enrollment) => (
              <View key={enrollment.id} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <View>
                    <Text style={styles.courseTitle}>
                      {enrollment.courses?.title}
                    </Text>
                    <Text style={styles.instructor}>
                      Instructor: {enrollment.courses?.instructor_name}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          enrollment.status === "completed"
                            ? "#22C55E"
                            : "#3B82F6",
                      },
                    ]}>
                    <Text style={styles.statusText}>
                      {enrollment.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={{ marginBottom: 12 }}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={styles.progressValue}>
                      {enrollment.progress_percentage}%
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${enrollment.progress_percentage}%` },
                      ]}
                    />
                  </View>
                </View>

                <TouchableOpacity style={styles.continueButton}>
                  <Text style={styles.continueButtonText}>
                    ▶️ Continue Learning
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* --- Upcoming Lessons --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Upcoming Lessons</Text>
          {upcomingLessons.length === 0 ? (
            <View style={styles.emptyBoxSmall}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyTextSmall}>No upcoming lessons</Text>
            </View>
          ) : (
            upcomingLessons.map((lesson) => (
              <View key={lesson.id} style={styles.lessonCard}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonSub}>{lesson.courses?.title}</Text>
                <Text style={styles.lessonDate}>
                  ⏰{" "}
                  {new Date(lesson.scheduled_at).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* --- Upcoming Quizzes --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✍️ Upcoming Quizzes</Text>
          {upcomingQuizzes.length === 0 ? (
            <View style={styles.emptyBoxSmall}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyTextSmall}>No upcoming quizzes</Text>
            </View>
          ) : (
            upcomingQuizzes.map((quiz) => (
              <View key={quiz.id} style={styles.quizCard}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizSub}>{quiz.courses?.title}</Text>
                <View style={styles.quizMeta}>
                  <Text style={styles.quizInfo}>
                    {quiz.total_questions} questions
                  </Text>
                  <Text style={styles.quizDate}>
                    {new Date(quiz.scheduled_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* --- Certificates --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Certificates Earned</Text>
          {certificates.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🎖️</Text>
              <Text style={styles.emptyText}>No certificates yet</Text>
              <Text style={styles.emptySub}>
                Complete courses to earn certificates!
              </Text>
            </View>
          ) : (
            certificates.map((cert) => (
              <View key={cert.id} style={styles.certCard}>
                <Text style={styles.certEmoji}>🏆</Text>
                <Text style={styles.certTitle}>{cert.courses?.title}</Text>
                <Text style={styles.certDate}>
                  Issued:{" "}
                  {new Date(cert.issued_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                <TouchableOpacity style={styles.certButton}>
                  <Text style={styles.certButtonText}>📜 View Certificate</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// 💅 Styles
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#16A34A",
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  emptyBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 16,
    alignItems: "center",
    padding: 24,
  },
  emptyBoxSmall: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    borderRadius: 12,
    alignItems: "center",
    padding: 16,
  },
  emptyEmoji: {
    fontSize: 30,
  },
  emptyText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
  },
  emptySub: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  emptyTextSmall: {
    color: "#6B7280",
    fontSize: 13,
  },
  courseCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCFCE7",
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  instructor: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  progressValue: {
    color: "#16A34A",
    fontWeight: "700",
  },
  progressBarContainer: {
    backgroundColor: "#ECFDF5",
    height: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  progressFill: {
    backgroundColor: "#8BD02A",
    height: "100%",
    borderRadius: 6,
  },
  continueButton: {
    backgroundColor: "#16A34A",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  lessonCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  lessonTitle: {
    fontWeight: "600",
    color: "#111827",
  },
  lessonSub: {
    color: "#6B7280",
    fontSize: 12,
  },
  lessonDate: {
    color: "#16A34A",
    fontSize: 12,
    marginTop: 4,
  },
  quizCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  quizTitle: {
    fontWeight: "600",
    color: "#111827",
  },
  quizSub: {
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 4,
  },
  quizMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quizInfo: {
    fontSize: 11,
    color: "#4B5563",
  },
  quizDate: {
    fontSize: 11,
    color: "#16A34A",
  },
  certCard: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  certEmoji: {
    fontSize: 30,
    marginBottom: 4,
  },
  certTitle: {
    fontWeight: "600",
    color: "#78350F",
  },
  certDate: {
    fontSize: 12,
    color: "#92400E",
    marginBottom: 8,
  },
  certButton: {
    backgroundColor: "#FCD34D",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  certButtonText: {
    color: "#78350F",
    fontWeight: "700",
  },
});

export default CoreLearning;
