import Header from "../components/Header";
import Hero from "../components/Hero";
import PopularCourses from "../components/PopularCourses";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

function Home() {
  const [currentUser, setCurrentUser] = useState(() => {
    // Load user initially
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  });

  // Listen for login/logout changes across tabs or components
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("currentUser");
      setCurrentUser(user ? JSON.parse(user) : null);
    };

    // Trigger when localStorage changes (even from another tab)
    window.addEventListener("storage", handleStorageChange);

    // Optional: check periodically for instant updates
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const reviews = [
    {
      name: "Mr. Daniel",
      role: "Physics Instructor",
      testimonial: "This platform makes teaching interactive and rewarding!",
      avatar: "https://ui-avatars.com/api/?name=Daniel",
      stars: 5,
    },
    {
      name: "Ms. Helen",
      role: "Math Teacher",
      testimonial: "My students love the live sessions feature!",
      avatar: "https://ui-avatars.com/api/?name=Helen",
      stars: 4,
    },
    {
      name: "Mr. Solomon",
      role: "ICT Instructor",
      testimonial: "An excellent space for sharing and learning together.",
      avatar: "https://ui-avatars.com/api/?name=Solomon",
      stars: 5,
    },
  ];

  return (
    <>
      <Header />
      <Hero currentUser={currentUser} /> {/* Pass user for dynamic buttons */}
      <PopularCourses />

      {currentUser ? (
        // Show Reviews after login
        <section className="bg-gray-50 py-16 lg:py-24 transition-all duration-500">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              💬 Teacher Reviews
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((r, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center"
                >
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-16 h-16 rounded-full mb-4"
                  />
                  <div className="flex mb-2">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-2">"{r.testimonial}"</p>
                  <p className="text-sm text-gray-500">
                    {r.name}, {r.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <HowItWorks />
      )}

      {!currentUser && <CallToAction />}

      <Footer />
    </>
  );
}

export default Home;
