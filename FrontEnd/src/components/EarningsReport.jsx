import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const EarningsReport = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [earningsStats, setEarningsStats] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  // Simulate API call
  useEffect(() => {
    setEarningsStats([
      { title: 'Total Earnings', value: '$0', change: null, trend: 'neutral', icon: '' },
      { title: 'Course Sales', value: '$0', change: null, trend: 'neutral', icon: '' },
      { title: 'Live Sessions', value: '$0', change: null, trend: 'neutral', icon: '' },
      { title: 'Pending Payouts', value: '$0', change: null, trend: 'neutral', icon: '' }
    ]);

    setPaymentHistory([]); // Empty until API loads
    setRevenueBreakdown([]); // Empty until API loads
    setRevenueData([]); // Empty until API loads
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Earnings & Payments</h1>
        <div className="flex space-x-3">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
          </select>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Request Payout
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Download Report
          </button>
        </div>
      </div>

      {/* Earnings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {earningsStats.map((stat, index) => (
    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center">
        <div className="p-3 bg-blue-100 rounded-lg">
          {/* Use the real icon if exists, otherwise fallback to a default chart icon */}
          {stat.icon ? (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" /> {/* simple square chart */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h4v6H6v-6zM14 6h4v12h-4V6z" /> {/* bars */}
            </svg>
          )}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
          <div className="flex items-center">
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            {stat.change && (
              <span className={`ml-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Revenue Trends</h2>
            <select className="text-sm border border-gray-300 rounded px-3 py-1">
              <option>Last 8 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Area type="monotone" dataKey="courseSales" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Course Sales" />
              <Area type="monotone" dataKey="liveSessions" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Live Sessions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Revenue Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueBreakdown || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(revenueBreakdown || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Payment History</h2>
            <div className="flex space-x-2">
              <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
              <button className="text-sm text-gray-500 hover:text-gray-700">Filter</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(paymentHistory.length > 0 ? paymentHistory : [{id: 0}]).map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${payment.amount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.type || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsReport;
