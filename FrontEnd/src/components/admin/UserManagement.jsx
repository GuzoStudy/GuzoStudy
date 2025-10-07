import { useState } from "react";

export const UserManagement = () => {
  const [activeView, setActiveView] = useState("students");

  // --- Mock Data ---
  const students = [
    { id: 1, full_name: "Marta Kidane", email: "marta@example.com", status: "active" },
    { id: 2, full_name: "Abel Teshome", email: "abel@example.com", status: "suspended" },
    { id: 3, full_name: "Sara Getaneh", email: "sara@example.com", status: "active" },
  ];

  const instructors = [
    {
      id: 1,
      full_name: "Yohannes Mekonnen",
      expertise: ["Web Dev", "UI/UX"],
      status: "approved",
      verification_status: "verified",
    },
    {
      id: 2,
      full_name: "Liya Abebe",
      expertise: ["Marketing", "SEO"],
      status: "pending",
      verification_status: "unverified",
    },
  ];

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

      {/* Students View */}
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
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-4 px-5 font-medium text-gray-800">{s.full_name}</td>
                    <td className="py-4 px-5 text-gray-600">{s.email}</td>
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${
                          s.status === "active"
                            ? "bg-gradient-to-r from-green-500 to-emerald-600"
                            : "bg-gradient-to-r from-red-500 to-red-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold text-white ${
                          s.status === "active"
                            ? "bg-gradient-to-r from-red-500 to-red-700"
                            : "bg-gradient-to-r from-green-500 to-emerald-600"
                        }`}
                      >
                        {s.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Instructors View
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
                  <tr key={i.id} className="border-b last:border-0">
                    <td className="py-4 px-5 font-medium text-gray-800">{i.full_name}</td>
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
                          i.verification_status === "verified"
                            ? "bg-gradient-to-r from-blue-500 to-blue-700"
                            : "bg-gradient-to-r from-gray-500 to-gray-700"
                        }`}
                      >
                        {i.verification_status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      {i.status === "pending" && (
                        <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600">
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
