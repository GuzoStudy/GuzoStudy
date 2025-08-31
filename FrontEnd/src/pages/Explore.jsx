import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Star } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
// import CourseDetail from "./components/CourseDetail";

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
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header />

      <div className="p-6 flex-1 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Explore Courses</h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col"
              >
                <img
                  src={course.thumbnail || "https://source.unsplash.com/400x300/?education,course"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold mb-1 text-gray-800">{course.title}</h2>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                      {course.language}
                    </span>
                    {(course.tags || []).slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {course.averageRating?.toFixed(1) || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.enrollmentCount || 0}
                    </span>
                  </div>

                  <div className="text-lg font-bold text-gray-800 mb-4">
                    {course.price === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${course.price}`
                    )}
                  </div>

                  <button
  onClick={() => navigate(`/course/${course._id}`)}
  className="mt-auto w-full bg-blue-600 text-white py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
>
  View Details
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
