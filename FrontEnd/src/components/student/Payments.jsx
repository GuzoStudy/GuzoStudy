import { useState } from "react";

export const Payments = () => {
  const [payments] = useState([
    {
      id: 1,
      created_at: "2025-09-10T10:30:00Z",
      courses: { title: "Full Stack Web Development" },
      payment_method: "Credit Card",
      amount: 120,
      status: "completed",
      invoice_url: "#",
    },
    {
      id: 2,
      created_at: "2025-08-15T12:00:00Z",
      courses: { title: "UI/UX Design Essentials" },
      payment_method: "PayPal",
      amount: 80,
      status: "pending",
      invoice_url: null,
    },
    {
      id: 3,
      created_at: "2025-07-25T09:15:00Z",
      courses: { title: "Advanced JavaScript" },
      payment_method: "Credit Card",
      amount: 60,
      status: "failed",
      invoice_url: "#",
    },
  ]);

  const [subscriptions] = useState([
    {
      id: 1,
      plan_name: "Pro Plan",
      price: 25,
      status: "active",
      start_date: "2025-08-01",
      end_date: "2025-12-01",
      auto_renew: true,
    },
    {
      id: 2,
      plan_name: "Basic Plan",
      price: 10,
      status: "expired",
      start_date: "2025-04-01",
      end_date: "2025-08-01",
      auto_renew: false,
    },
  ]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-blue-500",
      pending: "bg-yellow-500",
      failed: "bg-red-500",
      active: "bg-blue-500",
      cancelled: "bg-gray-400",
      expired: "bg-red-400",
    };
    return colors[status] || "bg-gray-400";
  };

  const totalSpent = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto bg-white min-h-screen rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800">
        Payments & Enrollments
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <div className="p-5 bg-blue-50 border border-blue-300 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm text-blue-700 font-medium mb-2">
            Total Spent
          </h3>
          <p className="text-3xl font-bold text-blue-800">
            {formatCurrency(totalSpent)}
          </p>
        </div>

        <div className="p-5 bg-indigo-50 border border-indigo-300 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm text-indigo-700 font-medium mb-2">
            Active Subscriptions
          </h3>
          <p className="text-3xl font-bold text-indigo-800">
            {activeSubscriptions.length}
          </p>
        </div>

        <div className="p-5 bg-sky-50 border border-sky-300 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <h3 className="text-sm text-sky-700 font-medium mb-2">
            Total Transactions
          </h3>
          <p className="text-3xl font-bold text-sky-800">{payments.length}</p>
        </div>
      </div>

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <section className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Active Subscriptions
          </h3>
          <div className="grid gap-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {sub.plan_name}
                    </h4>
                    <p className="text-2xl font-bold text-[#3B82F6]">
                      {formatCurrency(sub.price)}
                      <span className="text-sm text-gray-500 font-normal">
                        /month
                      </span>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white capitalize ${getStatusColor(
                      sub.status
                    )}`}
                  >
                    {sub.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Start Date: {new Date(sub.start_date).toLocaleDateString()}</p>
                  <p>End Date: {new Date(sub.end_date).toLocaleDateString()}</p>
                  <p>Auto-Renew: {sub.auto_renew ? "Yes" : "No"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Purchase History */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Purchase History
        </h3>
        {payments.length === 0 ? (
          <p className="text-gray-500">No purchase history available</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {["Date", "Course", "Payment Method", "Amount", "Status", "Invoice"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-sm font-semibold text-gray-700"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {p.courses?.title || "Subscription"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {p.payment_method || "Credit Card"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-gray-800">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold text-white capitalize ${getStatusColor(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {p.invoice_url ? (
                        <a
                          href={p.invoice_url}
                          className="text-[#3B82F6] hover:underline text-sm font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
