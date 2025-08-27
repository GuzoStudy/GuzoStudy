import React from 'react';
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
  LineElementa
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { TrendingUp, DollarSign, Users, BookOpen } from 'lucide-react';

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

const AnalyticsDashboard = () => {
  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$47,250', 
      change: '+12.5%', 
      icon: DollarSign,
      color: '#10b981'
    },
    { 
      title: 'Active Users', 
      value: '2,847', 
      change: '+8.2%', 
      icon: Users,
      color: '#2563eb'
    },
    { 
      title: 'Published Courses', 
      value: '163', 
      change: '+23.1%', 
      icon: BookOpen,
      color: '#8b5cf6'
    },
    { 
      title: 'Engagement Rate', 
      value: '87.3%', 
      change: '+5.4%', 
      icon: TrendingUp,
      color: '#f59e0b'
    }
  ];

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [30000, 35000, 32000, 40000, 45000, 47250],
      backgroundColor: '#2563eb',
      borderRadius: 8,
    }]
  };

  const coursePopularityData = {
    labels: ['Web Development', 'Data Science', 'Mobile Apps', 'Design', 'Marketing'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const engagementData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Course Views',
        data: [1200, 1500, 1800, 2100],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Course Completions',
        data: [800, 950, 1100, 1400],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Track performance, revenue, and engagement metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '4px' }}>
                    {stat.title}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '14px', color: stat.color, fontWeight: '600' }}>
                    {stat.change} from last month
                  </p>
                </div>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  backgroundColor: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={28} color={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Monthly Revenue
          </h3>
          <Bar data={revenueData} options={chartOptions} />
        </div>
        
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Course Categories
          </h3>
          <Doughnut data={coursePopularityData} options={chartOptions} />
        </div>
      </div>

      <div className="grid-1">
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Engagement Trends
          </h3>
          <Line data={engagementData} options={chartOptions} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { action: 'New course published', user: 'Dr. Sarah Johnson', time: '2 hours ago' },
            { action: 'Payment received', user: 'John Smith', time: '4 hours ago' },
            { action: 'Teacher verification completed', user: 'Prof. Mike Chen', time: '6 hours ago' },
            { action: 'Fraud alert resolved', user: 'System', time: '8 hours ago' }
          ].map((activity, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px'
            }}>
              <div>
                <p style={{ fontWeight: '500' }}>{activity.action}</p>
                <p style={{ fontSize: '14px', color: '#64748b' }}>{activity.user}</p>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b' }}>{activity.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;