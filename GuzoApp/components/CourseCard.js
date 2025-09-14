import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const CourseCard = ({
  title,
  image,
  description,
  tags,
  rating,
  teacher,
  studentsEnrolled,
}) => {
  return (
    <View style={styles.card}>
      {/* Course Image */}
      <Image source={{ uri: image }} style={styles.image} />

      {/* Course Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {tags?.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        {/* Rating & Enrollment */}
        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {Array.from({ length: rating }, (_, i) => (
              <Text key={i} style={styles.star}>
                ★
              </Text>
            ))}
          </View>
          <Text style={styles.enrolledText}>{studentsEnrolled} enrolled</Text>
        </View>

        {/* Teacher Info */}
        <View style={styles.teacherRow}>
          <Image source={{ uri: teacher?.photo }} style={styles.teacherImage} />
          <Text style={styles.teacherName}>{teacher?.name}</Text>
        </View>

        {/* Enroll Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Enroll Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CourseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: {
    height: 192,
    width: "100%",
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#2563eb",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stars: {
    flexDirection: "row",
  },
  star: {
    color: "#facc15",
    fontSize: 16,
    marginRight: 2,
  },
  enrolledText: {
    fontSize: 12,
    color: "#6b7280",
  },
  teacherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  teacherImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  teacherName: {
    fontSize: 14,
    color: "#334155",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
