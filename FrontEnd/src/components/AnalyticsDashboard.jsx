import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  TrendingUp,
  DollarSign,
  Users,
  BookOpen,
  Percent,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const API_BASE = "http://localhost:5000/api"; // update to your backend URL

const AnalyticsDashboard = ({ courseId }) => {
  const [courseAnalytics, setCourseAnalytics] = useState(null);
  const [instructorAnalytics, setInstructorAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [courseRes, instructorRes] = await Promise.all([
          axios.get(`${API_BASE}/analytics/course/${courseId}`, {
            withCredentials: true,
          }),
          axios.get(`${API_BASE}/analytics/instructor`, {
            withCredentials: true,
          }),
        ]);
        setCourseAnalytics(courseRes.data);
        setInstructorAnalytics(instructorRes.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [courseId]);

  if (loading) return <p>Loading analytics...</p>;
  if (!courseAnalytics || !instructorAnalytics)
    return <p>No analytics available.</p>;

  // --- Derived metrics ---
  const completionRate =
    courseAnalytics.enrollmentCount > 0
      ? (
          (courseAnalytics.completedStudents /
            courseAnalytics.enrollmentCount) *
          100
        ).toFixed(1) + "%"
      : "0%";

  const avgRevenuePerStudent =
    courseAnalytics.enrollmentCount > 0
      ? "$" + (courseAnalytics.totalRevenue / courseAnalytics.enrollmentCount).toFixed(2)
      : "$0";

  const stats = [
    {
      title: "Total Revenue",
      value: `$${courseAnalytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "#10b981",
    },
    {
      title: "Instructor Earnings",
      value: `$${courseAnalytics.instructorShare.toLocaleString()}`,
      icon: DollarSign,
      color: "#2563eb",
    },
    {
      title: "Enrolled Students",
      value: courseAnalytics.enrollmentCount,
      icon: Users,
      color: "#8b5cf6",
    },
    {
      title: "Completion Rate",
      value: completionRate,
      icon: Percent,
      color: "#f59e0b",
    },
    {
      title: "Avg. Quiz Score",
      value: courseAnalytics.averageQuizScore.toFixed(1),
      icon: TrendingUp,
      color: "#ef4444",
    },
    {
      title: "Avg. Revenue / Student",
      value: avgRevenuePerStudent,
      icon: BookOpen,
      color: "#14b8a6",
    },
  ];

  // Sample chart data (replace with backend aggregated stats later if available)
  const revenueData = {
    labels: ["Course Revenue", "Instructor Earnings"],
    datasets: [
      {
        label: "Amount",
        data: [courseAnalytics.totalRevenue, courseAnalytics.instructorShare],
        backgroundColor: ["#2563eb", "#10b981"],
        borderRadius: 8,
      },
    ],
  };

  const completionData = {
    labels: ["Completed", "In Progress"],
    datasets: [
      {
        data: [
          courseAnalytics.completedStudents,
          courseAnalytics.enrollmentCount - courseAnalytics.completedStudents,
        ],
        backgroundColor: ["#10b981", "#f59e0b"],
      },
    ],
  };

  const engagementData = {
    labels: ["Enrollments", "Completions", "Revenue"],
    datasets: [
      {
        label: "Metrics",
        data: [
          courseAnalytics.enrollmentCount,
          courseAnalytics.completedStudents,
          courseAnalytics.totalRevenue,
        ],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "8px" }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px" }}>
          Track performance, revenue, and engagement for your courses
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid-3" style={{ marginBottom: "32px", display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card" style={{ padding: "16px", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}>{stat.title}</p>
                  <p style={{ fontSize: "24px", fontWeight: "700", marginBottom: "4px" }}>{stat.value}</p>
                </div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    backgroundColor: `${stat.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={24} color={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: "32px", display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="card" style={{ padding: "16px", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Revenue Breakdown</h3>
          <Bar data={revenueData} options={chartOptions} />
        </div>

        <div className="card" style={{ padding: "16px", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Course Completion</h3>
          <Doughnut data={completionData} options={chartOptions} />
        </div>
      </div>

      <div className="card" style={{ padding: "16px", borderRadius: "12px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>Engagement Trends</h3>
        <Line data={engagementData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
