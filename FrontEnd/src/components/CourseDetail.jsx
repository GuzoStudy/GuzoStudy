import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const API_BASE = "https://guzostudy.onrender.com/api";

const CourseDetail = () => {
  const { id } = useParams(); // courseId from route
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_BASE}/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Failed to load course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/enrollments/${course._id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully enrolled!");
      navigate("/my-courses");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-500">Course not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
          <img
            src={course.thumbnail || "https://source.unsplash.com/600x400/?education"}
            alt={course.title}
            className="w-full lg:w-1/2 h-64 object-cover rounded-xl"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex gap-2 flex-wrap mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded">
                  {course.category}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded">
                  {course.language}
                </span>
                {(course.tags || []).slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-gray-600 text-sm flex gap-6">
                <span>⭐ {course.averageRating?.toFixed(1) || 0} Rating</span>
                <span>{course.enrollmentCount} students</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold">
                {course.price === 0 ? "Free" : `$${course.price}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Lessons & Description */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">About this Course</h2>
          <p className="text-gray-700 mb-6">{course.description}</p>

          <h3 className="text-xl font-semibold mb-3">Course Lessons</h3>
          <div className="space-y-3">
            {course.lessons.length > 0 ? (
              course.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="p-4 bg-white rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{index + 1}. {lesson.title}</p>
                      <p className="text-sm text-gray-500">{lesson.description}</p>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      Lesson
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No lessons added yet.</p>
            )}
          </div>
        </div>

        {/* Right Column: Instructor & Enroll */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md self-start">
          <h3 className="text-lg font-semibold mb-4">Instructor</h3>
          <div className="flex items-center mb-4">
            {course.teacher?.photo && (
              <img
                src={course.teacher.photo}
                alt={course.teacher?.name}
                className="w-12 h-12 rounded-full mr-3"
              />
            )}
            <div>
              <p className="font-medium">{course.teacher?.name || "Instructor"}</p>
            </div>
          </div>

          <button
            onClick={handleEnroll}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Enroll Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;
