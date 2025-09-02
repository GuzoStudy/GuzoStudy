import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="text-blue-600">Guzo</span>
              <span className="text-gray-800">Study</span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/explore"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Explore
            </Link>

            {user ? (
              <>
                {/* Dashboard */}
                {user.role === "teacher" && (
                  <Link
                    to="/teacher-dashboard"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Teacher Dashboard
                  </Link>
                )}
                {user.role === "student" && (
                  <Link
                    to="/student/dashboard"
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Student Dashboard
                  </Link>
                )}

                {/* Profile button */}
                <div className="relative group">
                  <button
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
                    onClick={() => navigate("/student/profile")}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </button>

                  {/* Hover dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                    <p className="font-semibold text-gray-800">
                      {user.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.email || "No email"}
                    </p>
                    <Link
                      to="/student/profile"
                      className="mt-2 block text-blue-600 hover:underline text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Not logged in */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
