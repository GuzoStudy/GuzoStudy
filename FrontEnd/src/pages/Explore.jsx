import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../components/Header";
import Footer from "../components/Footer";

const Explore = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const data = [
        {
          title: "Graphic Design",
          image: "https://source.unsplash.com/400x300/?graphic,design",
          description: "Learn design principles and tools for stunning graphics.",
          tags: ["Design", "Graphics", "Creativity"],
          rating: 5,
          teacher: { name: "Bob Lee", photo: "https://i.pravatar.cc/40?img=6" },
          studentsEnrolled: 950,
        },
        {
          title: "JavaScript Basics",
          image: "https://source.unsplash.com/400x300/?javascript,code",
          description: "Master the fundamentals of JavaScript programming.",
          tags: ["Programming", "JavaScript", "Web"],
          rating: 4.5,
          teacher: { name: "Alice Kim", photo: "https://i.pravatar.cc/40?img=7" },
          studentsEnrolled: 1200,
        },
      ];
      const fullCourses = Array.from({ length: 5 }, () => data).flat().slice(0, 20);
      setCourses(fullCourses);
    };

    fetchCourses();
  }, []);

  const handleEnroll = (course) => {
    if (isLoggedIn) {
      alert(`You are enrolled in ${course.title}!`);
    } else {
      navigate("/signup");
    }
  };

  // Filter courses by search query
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Header />

      <div className="p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore Courses</h1>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-gray-600 text-sm mb-3">{course.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                    <span>⭐ {course.rating}</span>
                    <span>{course.studentsEnrolled} students</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <img
                      src={course.teacher.photo}
                      alt={course.teacher.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-gray-700 text-sm">{course.teacher.name}</span>
                  </div>
                  <button
                    onClick={() => handleEnroll(course)}
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
