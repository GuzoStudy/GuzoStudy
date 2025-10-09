import { useState } from 'react';

export const FinanceTransactions = () => {
  const [activeView, setActiveView] = useState('overview');

  // Mock Data
  const revenue = 12500;
  const payouts = [
    {
      id: 1,
      instructors: { profiles: { full_name: 'John Doe' } },
      period_start: '2025-09-01',
      period_end: '2025-09-30',
      amount: 1500,
      status: 'completed',
    },
    {
      id: 2,
      instructors: { profiles: { full_name: 'Jane Smith' } },
      period_start: '2025-09-01',
      period_end: '2025-09-30',
      amount: 1200,
      status: 'processing',
    },
    {
      id: 3,
      instructors: { profiles: { full_name: 'Alex Brown' } },
      period_start: '2025-09-01',
      period_end: '2025-09-30',
      amount: 1100,
      status: 'pending',
    },
  ];

  const refundRequests = [
    {
      id: 1,
      courses: { title: 'Advanced React' },
      profiles: { full_name: 'Samuel Green' },
      reason: 'Course not as described',
      amount: 80,
    },
    {
      id: 2,
      courses: { title: 'Intro to AI' },
      profiles: { full_name: 'Lina White' },
      reason: 'Technical issues',
      amount: 60,
    },
  ];

  return (
    <div className="px-8 py-10 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
          Finance & Transactions
        </h2>
        <p className="text-gray-500 text-[15px]">
          Manage platform revenue, payouts, and refunds
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] mb-8">
        {/* Revenue */}
        <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-md shadow-blue-100/50">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-emerald-400/30">
            💰
          </div>
          <h3 className="text-sm text-gray-500 mb-2 font-semibold">Platform Revenue</h3>
          <p className="text-3xl font-bold text-gray-800">${revenue.toLocaleString()}</p>
        </div>

        {/* Pending Payouts */}
        <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-md shadow-blue-100/50">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-blue-700 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-blue-400/30">
            💸
          </div>
          <h3 className="text-sm text-gray-500 mb-2 font-semibold">Pending Payouts</h3>
          <p className="text-3xl font-bold text-gray-800">
            {payouts.filter((p) => p.status === 'pending').length}
          </p>
        </div>

        {/* Refund Requests */}
        <div className="p-6 rounded-2xl bg-white border border-blue-100 shadow-md shadow-blue-100/50">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-amber-400/30">
            🔄
          </div>
          <h3 className="text-sm text-gray-500 mb-2 font-semibold">Refund Requests</h3>
          <p className="text-3xl font-bold text-gray-800">{refundRequests.length}</p>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex gap-3 mb-6">
        {['overview', 'payouts', 'refunds'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-6 py-3 font-bold text-[15px] capitalize rounded-xl transition-all shadow-sm ${
              activeView === view
                ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-400/40'
                : 'bg-white text-gray-600 border border-blue-100 hover:bg-blue-50'
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Payouts Table */}
      {activeView === 'payouts' && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-md shadow-blue-100/40 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">Instructor Payouts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-500">
                    Instructor
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-500">
                    Period
                  </th>
                  <th className="px-5 py-3 text-right text-sm font-semibold text-gray-500">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-center text-sm font-semibold text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-gray-100">
                    <td className="px-5 py-4 text-sm text-gray-800 font-semibold">
                      {payout.instructors?.profiles?.full_name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {new Date(payout.period_start).toLocaleDateString()} -{' '}
                      {new Date(payout.period_end).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-bold text-emerald-500">
                      ${payout.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase ${
                          payout.status === 'completed'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                            : payout.status === 'processing'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-700'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600'
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Refunds Section */}
      {activeView === 'refunds' && (
        <div className="grid gap-5">
          {refundRequests.length === 0 ? (
            <div className="p-12 text-center bg-white border-2 border-dashed border-blue-100 rounded-2xl">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-gray-500 text-base">No pending refund requests</p>
            </div>
          ) : (
            refundRequests.map((refund) => (
              <div
                key={refund.id}
                className="border border-blue-100 rounded-2xl p-6 bg-white shadow-md shadow-blue-100/40"
              >
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2 text-gray-800">
                      {refund.courses?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      Student: {refund.profiles?.full_name}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Reason:</strong> {refund.reason}
                    </p>
                    <p className="text-base font-bold text-emerald-500 mt-2">
                      Amount: ${refund.amount.toLocaleString()}
                    </p>
                  </div>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold text-sm shadow-lg shadow-emerald-400/40 hover:scale-[1.02] transition-transform">
                    Approve Refund
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
