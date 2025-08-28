import React, { useState } from 'react';
import { DollarSign, CreditCard, TrendingUp, Calendar, Search, Filter } from 'lucide-react';

const PaymentsSubscriptions = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    {
      id: 'TXN-2024-001',
      user: 'Alex Johnson',
      email: 'alex@example.com',
      amount: 199.00,
      course: 'Complete Web Development Bootcamp',
      method: 'Credit Card',
      status: 'completed',
      date: '2024-01-25 14:30'
    },
    {
      id: 'TXN-2024-002',
      user: 'Emma Davis',
      email: 'emma@example.com',
      amount: 249.00,
      course: 'Data Science with Python',
      method: 'PayPal',
      status: 'completed',
      date: '2024-01-25 16:45'
    },
    {
      id: 'TXN-2024-003',
      user: 'Michael Brown',
      email: 'michael@example.com',
      amount: 179.00,
      course: 'Mobile App Development',
      method: 'Bank Transfer',
      status: 'pending',
      date: '2024-01-26 09:15'
    },
    {
      id: 'TXN-2024-004',
      user: 'Sarah Wilson',
      email: 'sarah@example.com',
      amount: 299.00,
      course: 'Advanced Machine Learning',
      method: 'Credit Card',
      status: 'failed',
      date: '2024-01-26 11:20'
    }
  ];

  const subscriptions = [
    {
      id: 'SUB-2024-001',
      user: 'John Carter',
      email: 'john@example.com',
      plan: 'Premium Monthly',
      amount: 29.99,
      status: 'active',
      startDate: '2024-01-01',
      nextBilling: '2024-02-01',
      coursesAccess: 'All Courses'
    },
    {
      id: 'SUB-2024-002',
      user: 'Lisa Zhang',
      email: 'lisa@example.com',
      plan: 'Standard Yearly',
      amount: 199.99,
      status: 'active',
      startDate: '2023-12-15',
      nextBilling: '2024-12-15',
      coursesAccess: 'Standard Courses'
    },
    {
      id: 'SUB-2024-003',
      user: 'David Kim',
      email: 'david@example.com',
      plan: 'Premium Yearly',
      amount: 299.99,
      status: 'cancelled',
      startDate: '2023-08-20',
      nextBilling: 'N/A',
      coursesAccess: 'All Courses'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed':
      case 'cancelled': return '#ef4444';
      default: return '#64748b';
    }
  };

  const filteredData = (activeTab === 'transactions' ? transactions : subscriptions).filter(item =>
    item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Payments & Subscriptions
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Monitor transactions, manage subscriptions, and track revenue
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: '12px' }}>
              <DollarSign size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Total Revenue</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>$47,250</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#dbeafe', borderRadius: '12px' }}>
              <CreditCard size={24} color="#2563eb" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Active Subscriptions</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb' }}>1,247</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
              <TrendingUp size={24} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Monthly Growth</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>+12.5%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#e0f2fe', borderRadius: '12px' }}>
              <Calendar size={24} color="#0369a1" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#64748b', marginBottom: '4px' }}>Pending Payments</h3>
              <p style={{ fontSize: '24px', fontWeight: '700', color: '#0369a1' }}>23</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Revenue Overview
        </h3>
        <div style={{
          height: '200px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b'
        }}>
          Revenue Chart Visualization Area
        </div>
      </div>

      <div className="card">
        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          {['transactions', 'subscriptions'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                border: 'none',
                backgroundColor: 'transparent',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                color: activeTab === tab ? '#2563eb' : '#64748b',
                fontWeight: activeTab === tab ? '600' : '500',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="input"
              style={{ paddingLeft: '44px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} />
            Filter
          </button>
          <button className="btn-primary">Export Data</button>
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          {activeTab === 'transactions' ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(transaction => (
                  <tr key={transaction.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                        {transaction.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: '600' }}>{transaction.user}</p>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>{transaction.email}</p>
                      </div>
                    </td>
                    <td style={{ fontSize: '14px' }}>
                      {transaction.course}
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#10b981' }}>
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span style={{ 
                        backgroundColor: '#f1f5f9', 
                        color: '#475569',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {transaction.method}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: `${getStatusColor(transaction.status)}20`,
                        color: getStatusColor(transaction.status)
                      }}>
                        {transaction.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '14px', color: '#64748b' }}>
                      {new Date(transaction.date).toLocaleString()}
                    </td>
                    <td>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Subscription ID</th>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Next Billing</th>
                  <th>Course Access</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(subscription => (
                  <tr key={subscription.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                        {subscription.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p style={{ fontWeight: '600' }}>{subscription.user}</p>
                        <p style={{ fontSize: '14px', color: '#64748b' }}>{subscription.email}</p>
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        backgroundColor: '#e0f2fe', 
                        color: '#0369a1',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {subscription.plan}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: '#10b981' }}>
                        ${subscription.amount}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: `${getStatusColor(subscription.status)}20`,
                        color: getStatusColor(subscription.status)
                      }}>
                        {subscription.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '14px', color: '#64748b' }}>
                      {subscription.nextBilling}
                    </td>
                    <td style={{ fontSize: '14px' }}>
                      {subscription.coursesAccess}
                    </td>
                    <td>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsSubscriptions;