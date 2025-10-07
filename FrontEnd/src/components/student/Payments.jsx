import { useState } from "react";

export const Payments = () => {
  // Mock data (replace later with API fetch)
  const [payments] = useState([
    {
      id: 1,
      amount: 49.99,
      status: "completed",
      payment_method: "Credit Card",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      courses: { title: "React for Beginners" },
      invoice_url: "#",
    },
    {
      id: 2,
      amount: 29.99,
      status: "pending",
      payment_method: "PayPal",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      courses: { title: "TailwindCSS Advanced" },
      invoice_url: null,
    },
  ]);

  const [subscriptions] = useState([
    {
      id: 1,
      plan_name: "Pro Plan",
      price: 19.99,
      status: "active",
      start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      end_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      auto_renew: true,
    },
    {
      id: 2,
      plan_name: "Basic Plan",
      price: 9.99,
      status: "expired",
      start_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      end_date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
      auto_renew: false,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "active":
        return "bg-green-500";
      case "pending":
        return "bg-orange-500";
      case "failed":
      case "expired":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getTotalSpent = () =>
    payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const activeSubscriptions = subscriptions.filter((s) => s.status === "active");

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-semibold">Payments & Enrollments</h2>

      {/* Stats Cards */}
      <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-5 rounded-lg border border-green-600 bg-green-50">
          <h3 className="text-sm font-medium text-green-700 mb-2">Total Spent</h3>
          <p className="text-3xl font-bold text-green-800">
            {formatCurrency(getTotalSpent())}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-blue-600 bg-blue-50">
          <h3 className="text-sm font-medium text-blue-700 mb-2">
            Active Subscriptions
          </h3>
          <p className="text-3xl font-bold text-blue-800">
            {activeSubscriptions.length}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-orange-600 bg-orange-50">
          <h3 className="text-sm font-medium text-orange-700 mb-2">
            Total Transactions
          </h3>
          <p className="text-3xl font-bold text-orange-800">{payments.length}</p>
        </div>
      </div>

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Active Subscriptions</h3>
          <div className="grid gap-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="p-5 rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">
                      {subscription.plan_name}
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(subscription.price)}
                      <span className="text-sm font-normal text-gray-600 ml-1">
                        /month
                      </span>
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(
                      subscription.status
                    )}`}
                  >
                    {subscription.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Start Date:{" "}
                    {new Date(subscription.start_date).toLocaleDateString()}
                  </p>
                  <p>
                    End Date:{" "}
                    {new Date(subscription.end_date).toLocaleDateString()}
                  </p>
                  <p>Auto-Renew: {subscription.auto_renew ? "Yes" : "No"}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Payments Table */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Purchase History</h3>
        {payments.length === 0 ? (
          <p className="text-gray-600">No purchase history available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold">Date</th>
                  <th className="p-3 text-left text-sm font-semibold">Course</th>
                  <th className="p-3 text-left text-sm font-semibold">
                    Payment Method
                  </th>
                  <th className="p-3 text-right text-sm font-semibold">Amount</th>
                  <th className="p-3 text-center text-sm font-semibold">
                    Status
                  </th>
                  <th className="p-3 text-center text-sm font-semibold">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 text-sm">
                    <td className="p-3 text-gray-600">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {payment.courses?.title || "Subscription"}
                    </td>
                    <td className="p-3 text-gray-600">
                      {payment.payment_method || "Credit Card"}
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {payment.invoice_url ? (
                        <a
                          href={payment.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
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
