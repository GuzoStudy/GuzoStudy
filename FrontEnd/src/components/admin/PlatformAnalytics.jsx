// src/pages/PlatformAnalytics.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("adminToken"); // JWT from admin login
        const res = await axios.get("http://localhost:5000/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAnalytics(res.data);
      } catch (err) {
        console.error(err.response || err);
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  if (error)
    return <div className="p-8 text-center text-red-500">{error}</div>;

  const stats = [
    {
      icon: "👥",
      label: "Total Users",
      value: Object.values(analytics.totalUsers || {}).reduce((a, b) => a + b, 0),
      color: "from-blue-500 to-blue-700",
      accent: "text-blue-500",
      note: "All registered users",
    },
    {
      icon: "📚",
      label: "Total Courses",
      value: (analytics.totalCourses?.active || 0) + (analytics.totalCourses?.pending || 0),
      color: "from-purple-500 to-purple-700",
      accent: "text-purple-500",
      note: "Published + pending",
    },
    {
      icon: "💰",
      label: "Total Revenue",
      value: `$${(analytics.totalRevenue || 0).toLocaleString()}`,
      color: "from-emerald-500 to-emerald-700",
      accent: "text-emerald-500",
      note: `Platform fee: ${analytics.platformFee || 0}%`,
    },
    {
      icon: "📈",
      label: "Total Enrollments",
      value: analytics.totalEnrollments || 0,
      color: "from-amber-500 to-amber-700",
      accent: "text-amber-500",
      note: "Completed enrollments",
    },
  ];

  const enrollmentGrowth = (analytics.enrollmentsGrowth || []).map((item, i) => ({
    id: i,
    date: item._id,
    newEnrollments: item.count,
    revenue: 0, // Admin controller does not return per-day revenue, can add if needed
    newUsers: 0, // Optional placeholder
  }));

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          Platform Analytics
        </h2>
        <p className="text-gray-500 text-sm">
          Overview of platform performance and growth
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 mb-10 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md shadow-blue-100"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}
            >
              {card.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">{card.label}</h3>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            <p className={`text-xs font-semibold mt-2 ${card.accent}`}>{card.note}</p>
          </div>
        ))}
      </div>

      {/* Enrollment Growth */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md shadow-blue-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span>📊</span> Enrollment Growth (Monthly)
        </h3>

        {enrollmentGrowth.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No analytics data available yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left font-semibold text-gray-500">
                    Month
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-500">
                    New Users
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-gray-500">
                    New Enrollments
                  </th>
                  <th className="py-3 px-4 text-right font-semibold text-gray-500">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollmentGrowth.map((day) => (
                  <tr key={day.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-800">
                      {day.date}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-blue-500">
                      {day.newUsers}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-purple-500">
                      {day.newEnrollments}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-500">
                      ${day.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
