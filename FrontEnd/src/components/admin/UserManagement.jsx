// src/pages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export const UserManagement = () => {
  const [activeView, setActiveView] = useState("students");
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken"); // your JWT

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allUsers = res.data.users || [];
      setStudents(allUsers.filter((u) => u.role === "student"));
      setInstructors(allUsers.filter((u) => u.role === "instructor"));
    } catch (err) {
      console.error(err.response || err);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle student suspend/activate
  const toggleStudentStatus = async (id, suspended) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/manage`,
        { userId: id, action: suspended ? "activate" : "suspend" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // refresh data
    } catch (err) {
      console.error(err.response || err);
      alert("Failed to update student status");
    }
  };

  // Handle instructor approval
  const approveInstructor = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/manage`,
        { userId: id, action: "approve" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); // refresh data
    } catch (err) {
      console.error(err.response || err);
      alert("Failed to approve instructor");
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-500">Loading users...</div>;

  if (error)
    return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          User Management
        </h2>
        <p className="text-gray-500 text-sm">Manage students and instructors</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["students", "instructors"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all ${
              activeView === view
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md"
                : "bg-white border border-blue-100 text-gray-700 hover:bg-blue-50"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Students Table */}
      {activeView === "students" ? (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">
              Students ({students.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="py-3 px-5 text-left">Name</th>
                  <th className="py-3 px-5 text-left">Email</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id} className="border-b last:border-0">
                    <td className="py-4 px-5 font-medium text-gray-800">{s.fullName}</td>
                    <td className="py-4 px-5 text-gray-600">{s.email}</td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${
                          s.isSuspended
                            ? "bg-gradient-to-r from-red-500 to-red-700"
                            : "bg-gradient-to-r from-green-500 to-emerald-600"
                        }`}
                      >
                        {s.isSuspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => toggleStudentStatus(s._id, s.isSuspended)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold text-white ${
                          s.isSuspended
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : "bg-gradient-to-r from-red-500 to-red-700"
                        }`}
                      >
                        {s.isSuspended ? "Activate" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Instructors Table
        <div className="bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">
              Instructors ({instructors.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="py-3 px-5 text-left">Name</th>
                  <th className="py-3 px-5 text-left">Expertise</th>
                  <th className="py-3 px-5 text-center">Status</th>
                  <th className="py-3 px-5 text-center">Verification</th>
                  <th className="py-3 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((i) => (
                  <tr key={i._id} className="border-b last:border-0">
                    <td className="py-4 px-5 font-medium text-gray-800">{i.fullName}</td>
                    <td className="py-4 px-5 text-gray-600">{i.expertise.join(", ")}</td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${
                          i.status === "approved"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : i.status === "pending"
                            ? "bg-gradient-to-r from-yellow-500 to-amber-600"
                            : "bg-gradient-to-r from-red-500 to-red-700"
                        }`}
                      >
                        {i.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${
                          i.isVerified
                            ? "bg-gradient-to-r from-blue-500 to-blue-700"
                            : "bg-gradient-to-r from-gray-500 to-gray-700"
                        }`}
                      >
                        {i.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      {i.status === "pending" && (
                        <button
                          onClick={() => approveInstructor(i._id)}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
