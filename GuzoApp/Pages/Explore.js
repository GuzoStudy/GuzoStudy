import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Explore() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const fetchCourses = async () => {
      const data = [
        {
          title: "Graphic Design",
          image:
            "https://i.pinimg.com/736x/d5/59/b1/d559b13fafb7f7946d6d9f6fcf9cb3ec.jpg",
          description:
            "Learn design principles and tools for stunning graphics.",
          tags: ["Design", "Graphics", "Creativity"],
          rating: 5,
          teacher: { name: "Bob Lee", photo: "https://i.pravatar.cc/40?img=6" },
          studentsEnrolled: 950,
        },
        {
          title: "JavaScript Basics",
          image:
            "https://i.pinimg.com/1200x/0e/4f/dc/0e4fdce8ac22e09688c580e5bc4dcd7d.jpg",
          description: "Master the fundamentals of JavaScript programming.",
          tags: ["Programming", "JavaScript", "Web"],
          rating: 4.5,
          teacher: {
            name: "Alice Kim",
            photo: "https://i.pravatar.cc/40?img=7",
          },
          studentsEnrolled: 1200,
        },
        {
          title: "Programming",
          image:
            "https://i.pinimg.com/736x/da/40/4b/da404bf7bd4398c9f256c65507d3c860.jpg",
          description: "Master the fundamentals of JavaScript programming.",
          tags: ["Programming", "BasicProgrammings", "Web"],
          rating: 4.5,
          teacher: {
            name: "Alice Kim",
            photo: "https://i.pravatar.cc/40?img=7",
          },
          studentsEnrolled: 1200,
        },
        {
          title: "Python Basics",
          image:
            "https://i.pinimg.com/1200x/d1/e0/e4/d1e0e4d8b16641b1cf652e190d62bbf2.jpg",
          description: "Master the fundamentals of Python programming.",
          tags: ["Programming", "Python", "WebServer"],
          rating: 4.5,
          teacher: {
            name: "Alice Kim",
            photo: "https://i.pravatar.cc/40?img=7",
          },
          studentsEnrolled: 1200,
        },
      ];
      const fullCourses = Array.from({ length: 5 }, () => data)
        .flat()
        .slice(0, 20);
      setCourses(fullCourses);
    };

    fetchCourses();
  }, []);

  const handleEnroll = () => {
    navigation.navigate("Login");
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const renderCourse = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.courseImage} />
      <View style={styles.cardContent}>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseDescription}>{item.description}</Text>

        <View style={styles.tagsContainer}>
          {item.tags.map((tag, idx) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.ratingStudents}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.students}>{item.studentsEnrolled} students</Text>
        </View>

        <View style={styles.teacherInfo}>
          <Image
            source={{ uri: item.teacher.photo }}
            style={styles.teacherPhoto}
          />
          <Text style={styles.teacherName}>{item.teacher.name}</Text>
        </View>

        <TouchableOpacity
          onPress={handleEnroll}
          style={styles.enrollButton}
          activeOpacity={0.8}>
          <Text style={styles.enrollButtonText}>Enroll</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.content}>
        <Text style={styles.pageTitle}>Explore Courses</Text>

        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {filteredCourses.length > 0 ? (
          <FlatList
            data={filteredCourses}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderCourse}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={<Footer />}
          />
        ) : (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No courses found.</Text>
            <Footer />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827",
  },
  searchWrapper: {
    marginBottom: 20,
    alignItems: "center",
  },
  searchInput: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
    borderColor: "#CBD5E1",
    borderWidth: 1,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  courseImage: {
    width: "100%",
    height: 120,
  },
  cardContent: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#BFDBFE",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: "#1E40AF",
    fontSize: 12,
  },
  ratingStudents: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rating: {
    color: "#6B7280",
    fontSize: 14,
  },
  students: {
    color: "#6B7280",
    fontSize: 14,
  },
  teacherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  enrollButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  enrollButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  noResults: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  noResultsText: {
    color: "#6B7280",
    fontSize: 16,
  },
});
