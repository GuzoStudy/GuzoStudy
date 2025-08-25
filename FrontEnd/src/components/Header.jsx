import { Link } from "react-router-dom";

function Header({userRole}) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="text-blue-600">Guzo</span>
              <span className="text-gray-800">Study</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/explore" className="text-gray-700 hover:text-blue-600 transition-colors">Explore</Link>
            
            {userRole === "teacher" && <Link to="/teacher-dashboard">Teacher Dashboard</Link>}
            {userRole === "student" && <Link to="/student-dashboard">Student Dashboard</Link>}

            {!userRole && <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Login</Link>}
            {!userRole && <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Sign up</Link>}
          </nav>
          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;