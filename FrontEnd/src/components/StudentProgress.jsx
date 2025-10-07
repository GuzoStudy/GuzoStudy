import React, { useState, useEffect } from "react";
import { Users, BookOpen, BarChart3, Activity } from "lucide-react";

const StudentProgress = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    avgProgress: 0,
    activeNow: 0,
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Placeholder: shows zeros until API connected
    setStats({
      totalStudents: 0,
      activeCourses: 0,
      avgProgress: 0,
      activeNow: 0,
    });
    setStudents([]);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <BarChart3 className="text-blue-500" /> Student Progress Dashboard
      </h2>

      {/* --- Top Summary Boxes --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Students"
          value={stats.totalStudents}
          icon={<Users className="text-blue-500" />}
        />
        <StatCard
          label="Active Courses"
          value={stats.activeCourses}
          icon={<BookOpen className="text-green-500" />}
        />
        <StatCard
          label="Average Progress"
          value={`${stats.avgProgress}%`}
          icon={<BarChart3 className="text-purple-500" />}
        />
        <StatCard
          label="Active Now"
          value={stats.activeNow}
          icon={<Activity className="text-red-500" />}
        />
      </div>

      {/* --- Student Table --- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Student Name</th>
              <th className="px-4 py-2 border-b">Course</th>
              <th className="px-4 py-2 border-b">Progress</th>
              <th className="px-4 py-2 border-b">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-gray-500 py-10 border-b"
                >
                  No student data available
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{student.name}</td>
                  <td className="px-4 py-2 border-b">{student.course}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b text-gray-500">
                    {student.lastActive}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentProgress;

/* ------------------------------
   Helper: Stat Card Component
-------------------------------- */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center shadow-sm">
    <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
    <div className="ml-3">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);
