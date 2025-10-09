import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";

export const Analytics = () => {
  const [enrollments] = useState([
    {
      id: 1,
      courseTitle: "React Fundamentals",
      progress: 75,
      enrolledAt: "2024-10-01",
      completedAt: null,
    },
    {
      id: 2,
      courseTitle: "Advanced Tailwind",
      progress: 90,
      enrolledAt: "2024-09-12",
      completedAt: "2024-09-28",
    },
  ]);

  const [quizAttempts] = useState([
    {
      id: 1,
      quizTitle: "React Basics Quiz",
      courseTitle: "React Fundamentals",
      score: 8,
      max: 10,
      percentage: 80,
      date: "2024-09-15",
    },
    {
      id: 2,
      quizTitle: "Tailwind Styling",
      courseTitle: "Advanced Tailwind",
      score: 9,
      max: 10,
      percentage: 90,
      date: "2024-09-29",
    },
  ]);

  const totalTimeSpent = 245; // minutes

  const averageProgress = enrollments.length
    ? Math.round(
        enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length
      )
    : 0;

  const averageScore = quizAttempts.length
    ? Math.round(
        quizAttempts.reduce((a, q) => a + q.percentage, 0) / quizAttempts.length
      )
    : 0;

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Analytics</Text>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View
            style={[
              styles.card,
              { backgroundColor: "#EFF6FF", borderColor: "#93C5FD" },
            ]}>
            <Text style={[styles.cardTitle, { color: "#2563EB" }]}>
              Average Progress
            </Text>
            <Text style={[styles.cardValue, { color: "#1E3A8A" }]}>
              {averageProgress}%
            </Text>
            <Text style={styles.cardSub}>
              Across {enrollments.length} courses
            </Text>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: "#F5F3FF", borderColor: "#C4B5FD" },
            ]}>
            <Text style={[styles.cardTitle, { color: "#7C3AED" }]}>
              Average Quiz Score
            </Text>
            <Text style={[styles.cardValue, { color: "#5B21B6" }]}>
              {averageScore}%
            </Text>
            <Text style={styles.cardSub}>
              {quizAttempts.length} quizzes taken
            </Text>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: "#ECFDF5", borderColor: "#6EE7B7" },
            ]}>
            <Text style={[styles.cardTitle, { color: "#059669" }]}>
              Time Spent Learning
            </Text>
            <Text style={[styles.cardValue, { color: "#065F46" }]}>
              {formatTime(totalTimeSpent)}
            </Text>
            <Text style={styles.cardSub}>Total learning time</Text>
          </View>
        </View>

        {/* Course Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Progress Overview</Text>
          {enrollments.length === 0 ? (
            <Text style={styles.emptyText}>No course data available</Text>
          ) : (
            enrollments.map((e) => (
              <View key={e.id} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <Text style={styles.courseTitle}>{e.courseTitle}</Text>
                  <Text style={styles.courseProgress}>{e.progress}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${e.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.courseDate}>
                  Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}
                  {e.completedAt &&
                    ` • Completed: ${new Date(
                      e.completedAt
                    ).toLocaleDateString()}`}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Quiz Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiz Performance</Text>
          {quizAttempts.length === 0 ? (
            <Text style={styles.emptyText}>No quiz attempts yet</Text>
          ) : (
            <View>
              {quizAttempts.map((q) => (
                <View key={q.id} style={styles.quizCard}>
                  <Text style={styles.quizTitle}>{q.quizTitle}</Text>
                  <Text style={styles.quizSub}>{q.courseTitle}</Text>
                  <Text style={styles.quizScore}>
                    {q.score}/{q.max} ({q.percentage}%)
                  </Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          q.percentage >= 80
                            ? "#10B981"
                            : q.percentage >= 60
                            ? "#F59E0B"
                            : "#EF4444",
                      },
                    ]}>
                    <Text style={styles.badgeText}>{q.percentage}%</Text>
                  </View>
                  <Text style={styles.quizDate}>
                    {new Date(q.date).toLocaleDateString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: "30%",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "800",
  },
  cardSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },
  emptyText: {
    color: "#6B7280",
    fontStyle: "italic",
  },
  courseCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 1,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  courseTitle: {
    fontWeight: "600",
    color: "#111827",
  },
  courseProgress: {
    fontWeight: "700",
    color: "#2563EB",
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginTop: 6,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 6,
  },
  courseDate: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  quizCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  quizSub: {
    fontSize: 12,
    color: "#6B7280",
  },
  quizScore: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 4,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  quizDate: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
});
export default Analytics;
