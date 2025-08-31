import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";

function CourseCard({
  title,
  image,
  description,
  tags,
  rating,
  teacher,
  studentsEnrolled,
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{title}</Text>
      <Text style={styles.courseDescription}>{description}</Text>

      <View style={styles.tagContainer}>
        {tags.map((tag, idx) => (
          <View key={idx} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.teacherInfoColumn}>
          <View style={styles.teacherInfo}>
            <Image source={{ uri: teacher.photo }} style={styles.teacherPhoto} />
            <Text style={styles.teacherName}>{teacher.name}</Text>
          </View>
          <Text style={styles.students}>{studentsEnrolled} students</Text>
        </View>
      </View>
    </View>
  );
}

export default function PopularCourses() {
  const courses = [
    {
      title: "Digital Marketing",
      image:
        "https://i.pinimg.com/736x/c6/e0/c6/c6e0c62998bf53d547fb099f6bc831e2.jpg",
      description: "Master online marketing strategies and grow your business.",
      tags: ["Marketing", "Digital", "Business"],
      rating: 5,
      teacher: { name: "Alice Smith", photo: "https://i.pravatar.cc/40?img=5" },
      studentsEnrolled: 800,
    },
    {
      title: "Graphic Design",
      image:
        "https://i.pinimg.com/736x/d5/59/b1/d559b13fafb7f7946d6d9f6fcf9cb3ec.jpg",
      description: "Learn design principles and tools for stunning graphics.",
      tags: ["Design", "Graphics", "Creativity"],
      rating: 5,
      teacher: { name: "Bob Lee", photo: "https://i.pravatar.cc/40?img=6" },
      studentsEnrolled: 950,
    },
    {
      title: "Programming",
      image:
        "https://i.pinimg.com/736x/da/40/4b/da404bf7bd4398c9f256c65507d3c860.jpg",
      description: "Start coding with hands-on projects and expert guidance.",
      tags: ["Programming", "Coding", "Development"],
      rating: 5,
      teacher: { name: "Carol White", photo: "https://i.pravatar.cc/40?img=7" },
      studentsEnrolled: 1200,
    },
    {
      title: "Data Science",
      image:
        "https://i.pinimg.com/1200x/14/cb/c1/14cbc10e848a3e5e794c11b57bf1ba3c.jpg",
      description:
        "Analyze data and build predictive models for real-world problems.",
      tags: ["Data", "Science", "Analytics", "Machine Learning"],
      rating: 5,
      teacher: { name: "David Black", photo: "https://i.pravatar.cc/40?img=8" },
      studentsEnrolled: 1100,
    },
  ];

  return (
    <ScrollView style={{ backgroundColor: "white", paddingVertical: 32 }}>
      <View style={{ maxWidth: 1024, alignSelf: "center", paddingHorizontal: 16 }}>
        <View style={{ marginBottom: 48, alignItems: "center" }}>
          <Text style={styles.heading}>Explore Popular Courses</Text>
        </View>

        <FlatList
          data={courses}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 24,
          }}
          renderItem={({ item }) => <CourseCard {...item} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
  },
  courseImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  courseDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#E0E7FF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#4338CA",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  teacherInfoColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  teacherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  teacherPhoto: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  teacherName: {
    fontSize: 14,
    color: "#374151",
  },
  students: {
    fontSize: 12,
    color: "#6B7280",
  },
});
