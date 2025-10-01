import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  PlayCircle,
  ArrowRight,
  ExternalLink, // 👈 add icon for clarity
} from "lucide-react";

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load enrolled courses for "Continue Learning" and stats
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/enrollments/student/my-courses");
        if (!mounted) return;
        setEnrollments(res.data || []);
      } catch (e) {
        // ignore for dashboard
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const recentCourses = useMemo(() => {
    const mapped = (enrollments || []).map((en) => {
      const c = en.course || {};
      const totalLessons = Array.isArray(c.lessons) ? c.lessons.length : c.totalLessons || 0;
      const done = Array.isArray(en.progress)
        ? en.progress.filter((p) => p.completed).length
        : 0;
      const pct = totalLessons > 0 ? Math.round((done / totalLessons) * 100) : 0;

      return {
        id: c._id,
        title: c.title || "Untitled Course",
        instructor: c.instructor?.name || c.instructor || "Instructor",
        progress: pct,
        lastAccessed: en.updatedAt ? new Date(en.updatedAt).toLocaleString() : "—",
        image:
          c.image ||
          "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300",
      };
    });

    return mapped
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
      .slice(0, 3);
  }, [enrollments]);

  const stats = useMemo(() => {
    const active = enrollments.filter((en) => {
      const total = Array.isArray(en.course?.lessons)
        ? en.course.lessons.length
        : en.course?.totalLessons || 0;
      const done = Array.isArray(en.progress)
        ? en.progress.filter((p) => p.completed).length
        : 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return pct < 100;
    }).length;

    const certs = enrollments.length - active;
    const hours = enrollments.length * 10;
    const avgScore = 87;

    return [
      { icon: BookOpen, label: "Active Courses", value: String(active), color: "bg-gradient-to-tr from-blue-500 to-indigo-500 text-white" },
      { icon: Clock, label: "Hours Studied", value: String(hours), color: "bg-gradient-to-tr from-green-500 to-emerald-500 text-white" },
      { icon: Award, label: "Certificates", value: String(certs), color: "bg-gradient-to-tr from-yellow-400 to-orange-400 text-white" },
      { icon: TrendingUp, label: "Average Score", value: `${avgScore}%`, color: "bg-gradient-to-tr from-purple-500 to-fuchsia-500 text-white" },
    ];
  }, [enrollments]);

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Project Submission",
      course: "Any Course",
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      priority: "high",
    },
  ];

  return (
    <div className="dashboard max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome back to <span className="text-blue-600">Guzo</span>! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Keep pushing forward — your learning journey is moving strong!
          </p>
        </div>
-
        {/* 👇 New Button */}
        <button
          onClick={() => window.open("https://vc-frontend2.vercel.app/", "_blank")}
          className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          <ExternalLink size={18} />
          Go To LiveClass
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-2xl shadow-md bg-white hover:shadow-lg transition"
          >
            <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-4`}>
              <stat.icon size={28} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Continue Learning + Deadlines */}
      {/* ... rest of your code unchanged ... */}
    </div>
  );
};

export default StudentDashboard;
