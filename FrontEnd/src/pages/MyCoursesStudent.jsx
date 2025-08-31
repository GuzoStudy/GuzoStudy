import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, CheckCircle2, Clock, Award } from "lucide-react";
import api from "../utils/api";

const MyCoursesStudent = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/enrollments/student/my-courses");
        if (!mounted) return;
        setEnrollments(res.data || []);
      } catch (e) {
        setErr(
          e?.response?.data?.message ||
            "Failed to load your courses. Please try again."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // Split into active vs completed by computed percent (naive: if 100% then completed)
  const withComputed = useMemo(() => {
    return (enrollments || []).map((en) => {
      const course = en.course || {};
      const totalLessons = Array.isArray(course?.lessons)
        ? course.lessons.length
        : course?.totalLessons || 0;
      const completedLessons = Array.isArray(en.progress)
        ? en.progress.filter((p) => p.completed).length
        : 0;
      const progressPct =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        _id: en._id,
        courseId: course._id,
        title: course.title || "Untitled Course",
        instructor: course.instructor?.name || course.instructor || "Instructor",
        image:
          course.image ||
          "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=400",
        totalLessons,
        completedLessons,
        progress: progressPct,
        estimatedTime: course.estimatedTime || "",
        lastAccessed: en.updatedAt
          ? new Date(en.updatedAt).toLocaleString()
          : "—",
        certificateAvailable: progressPct === 100,
        completedDate: en.completedAt || null,
        rating: en.rating || 0,
      };
    });
  }, [enrollments]);

  const activeCourses = useMemo(
    () => withComputed.filter((c) => c.progress < 100),
    [withComputed]
  );
  const completedCourses = useMemo(
    () => withComputed.filter((c) => c.progress >= 100),
    [withComputed]
  );

  if (loading) return <div className="p-6">Loading your courses…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="my-courses-page max-w-[1400px] mx-auto">
      <div className="page-header mb-8">
        <h1 className="text-4xl font-bold text-slate-800">My Courses</h1>
        <p className="text-gray-600">
          Track your learning progress and continue your educational journey.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="stat-icon w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <PlayCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number text-3xl font-bold text-slate-800">
              {activeCourses.length}
            </div>
            <div className="stat-label text-sm text-gray-500">Active Courses</div>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="stat-icon w-12 h-12 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number text-3xl font-bold text-slate-800">
              {completedCourses.length}
            </div>
            <div className="stat-label text-sm text-gray-500">Completed</div>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="stat-icon w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center text-white">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number text-3xl font-bold text-slate-800">
              {/* naive placeholder if no duration tracking */}
              {withComputed.length * 10}h
            </div>
            <div className="stat-label text-sm text-gray-500">Hours Remaining</div>
          </div>
        </div>

        <div className="stat-card bg-white rounded-xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="stat-icon w-12 h-12 rounded-lg bg-violet-600 flex items-center justify-center text-white">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number text-3xl font-bold text-slate-800">
              {completedCourses.length}
            </div>
            <div className="stat-label text-sm text-gray-500">Certificates</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 flex">
        <button
          className={`px-6 py-3 -mb-px border-b-2 transition ${
            activeTab === "active"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-slate-800"
          }`}
          onClick={() => setActiveTab("active")}
        >
          <div className="inline-flex items-center gap-2">
            <PlayCircle size={16} />
            Active Courses ({activeCourses.length})
          </div>
        </button>
        <button
          className={`px-6 py-3 -mb-px border-b-2 transition ${
            activeTab === "completed"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-slate-800"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          <div className="inline-flex items-center gap-2">
            <CheckCircle2 size={16} />
            Completed ({completedCourses.length})
          </div>
        </button>
      </div>

      {/* Lists */}
      {activeTab === "active" ? (
        <CoursesList items={activeCourses} />
      ) : (
        <CompletedList items={completedCourses} />
      )}
    </div>
  );
};

const CoursesList = ({ items }) => {
  if (!items.length)
    return <div className="text-gray-500">No active courses yet.</div>;

  return (
    <div className="grid gap-6">
      {items.map((course) => (
        <div
          key={course._id}
          className="course-card bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition"
        >
          <div className="course-image w-full md:w-64 h-48 md:h-auto relative shrink-0">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-full w-12 h-12 flex items-center justify-center text-sm font-semibold">
              {course.progress}%
            </div>
          </div>

          <div className="course-content p-5 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500">by {course.instructor}</p>
              </div>
              <Link
                to={`/course/${course.courseId}`}
                className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <PlayCircle size={16} />
                Continue
              </Link>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {course.completedLessons}/{course.totalLessons} lessons
                  completed
                </span>
                <span className="text-gray-500">{course.estimatedTime}</span>
              </div>
              <div className="h-2 bg-slate-200 rounded mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500 mt-3">
              Last accessed {course.lastAccessed}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CompletedList = ({ items }) => {
  if (!items.length)
    return <div className="text-gray-500">No completed courses yet.</div>;

  return (
    <div className="grid gap-6">
      {items.map((course) => (
        <div
          key={course._id}
          className="course-card bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm"
        >
          <div className="course-image w-full md:w-64 h-48 md:h-auto relative shrink-0">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full p-2">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="course-content p-5 flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {course.title}
            </h3>
            <p className="text-sm text-gray-500">by {course.instructor}</p>

            <div className="grid grid-cols-3 gap-4 text-sm mt-3">
              <div>
                <div className="text-gray-500">Completed</div>
                <div>
                  {course.completedDate
                    ? new Date(course.completedDate).toLocaleDateString()
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Grade</div>
                <div className="font-semibold text-emerald-600">A</div>
              </div>
              <div>
                <div className="text-gray-500">Lessons</div>
                <div>{course.totalLessons} completed</div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              {course.certificateAvailable && (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => alert("Issue/download certificate here")}
                >
                  <Award size={16} />
                  Download Certificate
                </button>
              )}
              <Link
                to={`/course/${course.courseId}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                Review Course
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyCoursesStudent;
