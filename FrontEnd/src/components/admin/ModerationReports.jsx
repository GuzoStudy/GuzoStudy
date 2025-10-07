import { useState } from "react";

export const ModerationReports = () => {
  const [activeView, setActiveView] = useState("users");

  // Mock data
  const reportedUsers = [
    {
      id: 1,
      reason: "Harassment",
      description: "User sent inappropriate messages.",
      created_at: "2025-10-01",
    },
    {
      id: 2,
      reason: "Spam",
      description: "User repeatedly posted promotional links.",
      created_at: "2025-10-02",
    },
  ];

  const supportTickets = [
    {
      id: 1,
      subject: "App not loading",
      profiles: { full_name: "Alice Johnson" },
      message: "The dashboard takes forever to load.",
      priority: "urgent",
      created_at: "2025-10-03",
    },
    {
      id: 2,
      subject: "Feature suggestion",
      profiles: { full_name: "Bob Smith" },
      message: "Please add dark mode!",
      priority: "medium",
      created_at: "2025-10-04",
    },
  ];

  const systemLogs = [
    {
      id: 1,
      created_at: "2025-10-05T12:30:00",
      profiles: { full_name: "Admin User" },
      action: "User ban executed",
      suspicious: true,
    },
    {
      id: 2,
      created_at: "2025-10-06T09:45:00",
      profiles: { full_name: "System" },
      action: "Daily backup completed",
      suspicious: false,
    },
  ];

  return (
    <div className="px-8 py-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          Moderation & Reports
        </h2>
        <p className="text-gray-500 text-sm">
          Handle reports, support tickets, and system logs
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["users", "tickets", "logs"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-6 py-3 rounded-xl font-semibold capitalize text-sm transition-all duration-200 ${
              activeView === view
                ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg"
                : "bg-white text-gray-600 border border-blue-100 hover:bg-blue-50"
            }`}
          >
            {view === "users"
              ? `Reported Users (${reportedUsers.length})`
              : view === "tickets"
              ? `Support Tickets (${supportTickets.length})`
              : "System Logs"}
          </button>
        ))}
      </div>

      {/* Reported Users */}
      {activeView === "users" && (
        <div className="grid gap-5">
          {reportedUsers.length === 0 ? (
            <div className="p-12 text-center bg-white border-2 border-dashed border-blue-100 rounded-2xl">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-gray-500 text-base">No reported users</p>
            </div>
          ) : (
            reportedUsers.map((report) => (
              <div
                key={report.id}
                className="border border-orange-200 rounded-2xl p-6 bg-white shadow-md shadow-orange-100/50"
              >
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Reported by:</strong> Reporter User
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Reason:</strong> {report.reason}
                </p>
                <p className="text-sm text-gray-600">{report.description}</p>
                <p className="text-xs text-gray-400 mt-3">
                  Reported: {new Date(report.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Support Tickets */}
      {activeView === "tickets" && (
        <div className="grid gap-5">
          {supportTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border border-blue-100 rounded-2xl p-6 bg-white shadow-md shadow-blue-100/50"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">
                  {ticket.subject}
                </h3>
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold text-white uppercase ${
                    ticket.priority === "urgent"
                      ? "bg-gradient-to-r from-red-500 to-red-700"
                      : ticket.priority === "high"
                      ? "bg-gradient-to-r from-amber-500 to-amber-700"
                      : "bg-gradient-to-r from-blue-500 to-blue-700"
                  }`}
                >
                  {ticket.priority}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                From: {ticket.profiles.full_name}
              </p>
              <p className="text-sm text-gray-600">{ticket.message}</p>
              <p className="text-xs text-gray-400 mt-3">
                Created: {new Date(ticket.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* System Logs */}
      {activeView === "logs" && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-md shadow-blue-100/50 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">
              Recent System Activity
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">
                    Time
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">
                    User
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500">
                    Action
                  </th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {systemLogs.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100">
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-semibold">
                      {log.profiles.full_name}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{log.action}</td>
                    <td className="px-5 py-4 text-center">
                      {log.suspicious && (
                        <span className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-700">
                          ⚠️ SUSPICIOUS
                        </span>
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
