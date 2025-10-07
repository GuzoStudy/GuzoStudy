import React, { useState } from "react";

export const PlatformAnalytics = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  const mockAnalytics = {
    totalUsers: 1842,
    totalCourses: 42,
    totalRevenue: 12450,
    totalEnrollments: 983,
  };

  const mockEnrollmentGrowth = [
    { id: 1, date: "2025-09-07", newUsers: 45, newEnrollments: 32, revenue: 900 },
    { id: 2, date: "2025-09-06", newUsers: 39, newEnrollments: 28, revenue: 740 },
    { id: 3, date: "2025-09-05", newUsers: 41, newEnrollments: 25, revenue: 670 },
    { id: 4, date: "2025-09-04", newUsers: 48, newEnrollments: 30, revenue: 800 },
  ];

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
        {[
          {
            icon: "👥",
            label: "Total Users",
            value: mockAnalytics.totalUsers,
            color: "from-blue-500 to-blue-700",
            accent: "text-blue-500",
            note: "Active members",
          },
          {
            icon: "📚",
            label: "Total Courses",
            value: mockAnalytics.totalCourses,
            color: "from-purple-500 to-purple-700",
            accent: "text-purple-500",
            note: "Available courses",
          },
          {
            icon: "💰",
            label: "Total Revenue",
            value: `$${mockAnalytics.totalRevenue.toLocaleString()}`,
            color: "from-emerald-500 to-emerald-700",
            accent: "text-emerald-500",
            note: "Platform earnings",
          },
          {
            icon: "📈",
            label: "Total Enrollments",
            value: mockAnalytics.totalEnrollments,
            color: "from-amber-500 to-amber-700",
            accent: "text-amber-500",
            note: "Student enrollments",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md shadow-blue-100"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}
            >
              {card.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              {card.label}
            </h3>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
            <p className={`text-xs font-semibold mt-2 ${card.accent}`}>
              {card.note}
            </p>
          </div>
        ))}
      </div>

      {/* Enrollment Growth */}
      <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-md shadow-blue-100">
        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span>📊</span> Enrollment Growth (Last 30 Days)
        </h3>

        {mockEnrollmentGrowth.length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            No analytics data available yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4 text-left font-semibold text-gray-500">
                    Date
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
                {mockEnrollmentGrowth.map((day) => (
                  <tr key={day.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-800">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-blue-500">
                      +{day.newUsers}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-purple-500">
                      {day.newEnrollments}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-500">
                      ${day.revenue.toLocaleString()}
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
