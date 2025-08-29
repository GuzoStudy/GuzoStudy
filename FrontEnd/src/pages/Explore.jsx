import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const API_BASE = "https://guzostudy.onrender.com/api";

const Explore = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_BASE}/courses`);
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/enrollments/${courseId}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully enrolled!");
      navigate("/my-courses");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll.");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.tags || []).some(tag =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    (course.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <div className="p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore Courses</h1>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={course.thumbnail || "https://source.unsplash.com/400x300/?education,course"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {course.language}
                    </span>
                    {(course.tags || []).slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                    <span>⭐ {course.averageRating?.toFixed(1) || 0}</span>
                    <span>{course.enrollmentCount || 0} students</span>
                  </div>

                  <div className="text-lg font-semibold mb-3">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </div>

                  <div className="flex items-center mb-3">
                    {course.teacher?.photo && (
                      <img
                        src={course.teacher.photo}
                        alt={course.teacher?.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <span className="text-gray-700 text-sm">
                      {course.teacher?.name || "Instructor"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleEnroll(course._id)}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No courses found.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
