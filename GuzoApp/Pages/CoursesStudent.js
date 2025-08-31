// CourseStudent.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  Star,
  Users,
  Clock,
  BookOpen,
  Filter,
  Search,
} from "lucide-react-native";

const CoursesStudent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "programming", label: "Programming" },
    { value: "design", label: "Design" },
    { value: "business", label: "Business" },
    { value: "marketing", label: "Marketing" },
    { value: "data-science", label: "Data Science" },
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const courses = [
    {
      id: 1,
      title: "Complete React Development Course",
      instructor: "Sarah Johnson",
      category: "programming",
      level: "intermediate",
      rating: 4.8,
      students: 2840,
      duration: "42 hours",
      price: 89.99,
      image:
        "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Master React from fundamentals to advanced concepts including hooks, context, and testing.",
    },
    {
      id: 2,
      title: "Advanced JavaScript ES6+",
      instructor: "Mike Chen",
      category: "programming",
      level: "advanced",
      rating: 4.9,
      students: 1920,
      duration: "38 hours",
      price: 79.99,
      image:
        "https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Deep dive into modern JavaScript features, async programming, and best practices.",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Emily Davis",
      category: "design",
      level: "beginner",
      rating: 4.7,
      students: 3150,
      duration: "28 hours",
      price: 69.99,
      image:
        "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Learn design principles, user research, wireframing, and prototyping.",
    },
    {
      id: 4,
      title: "Digital Marketing Strategy",
      instructor: "Alex Rodriguez",
      category: "marketing",
      level: "intermediate",
      rating: 4.6,
      students: 2640,
      duration: "32 hours",
      price: 74.99,
      image:
        "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Comprehensive digital marketing including SEO, social media, and analytics.",
    },
    {
      id: 5,
      title: "Python for Data Science",
      instructor: "Dr. Lisa Wang",
      category: "data-science",
      level: "beginner",
      rating: 4.8,
      students: 4200,
      duration: "45 hours",
      price: 94.99,
      image:
        "https://images.pexels.com/photos/574070/pexels-photo-574070.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Learn Python programming for data analysis, visualization, and machine learning.",
    },
    {
      id: 6,
      title: "Business Strategy & Leadership",
      instructor: "James Wilson",
      category: "business",
      level: "advanced",
      rating: 4.7,
      students: 1580,
      duration: "24 hours",
      price: 84.99,
      image:
        "https://images.pexels.com/photos/416405/pexels-photo-416405.jpeg?auto=compress&cs=tinysrgb&w=400",
      description:
        "Strategic thinking, leadership skills, and business management principles.",
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const renderCourse = ({ item }) => (
    <View style={styles.courseCard}>
      <Image source={{ uri: item.image }} style={styles.courseImage} />
      <View style={styles.courseContent}>
        <Text style={styles.categoryText}>
          {categories.find((c) => c.value === item.category)?.label}
        </Text>
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.instructorText}>by {item.instructor}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Star size={16} color="#f59e0b" />
            <Text style={styles.statText}>{item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Users size={16} color="#6b7280" />
            <Text style={styles.statText}>
              {item.students.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Clock size={16} color="#6b7280" />
            <Text style={styles.statText}>{item.duration}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.priceText}>${item.price}</Text>
          <TouchableOpacity style={styles.enrollButton}>
            <BookOpen size={16} color="#ffffff" />
            <Text style={styles.enrollText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Explore Courses</Text>
      <Text style={styles.subHeader}>
        Discover new skills and advance your career.
      </Text>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Search courses..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value)}>
            {categories.map((c) => (
              <Picker.Item key={c.value} label={c.label} value={c.value} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLevel}
            onValueChange={(value) => setSelectedLevel(value)}>
            {levels.map((l) => (
              <Picker.Item key={l.value} label={l.label} value={l.value} />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.resultsCount}>
        {filteredCourses.length} courses found
      </Text>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subHeader: {
    color: "#6b7280",
    marginBottom: 16,
  },
  searchContainer: {
    position: "relative",
    marginBottom: 16,
  },
  searchIcon: {
    position: "absolute",
    top: 14,
    left: 12,
  },
  searchInput: {
    padding: 12,
    paddingLeft: 40,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  resultsCount: {
    marginBottom: 16,
    color: "#4b5563",
    fontWeight: "500",
  },
  courseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  courseImage: {
    height: 180,
    width: "100%",
  },
  courseContent: {
    padding: 16,
  },
  categoryText: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  instructorText: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 12,
  },
  stats: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#6b7280",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  enrollButton: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  enrollText: {
    color: "#ffffff",
    marginLeft: 6,
  },
});

export default CoursesStudent;
