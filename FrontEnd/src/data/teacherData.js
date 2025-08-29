// Teacher Dashboard Mock Data

// Dashboard Stats
export const teacherStats = [
  {
    title: 'Total Students',
    value: '1,847',
    change: '+12.5%',
    trend: 'up',
    icon: {
      path: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      bgColor: 'bg-blue-500'
    }
  },
  {
    title: 'Active Courses',
    value: '8',
    change: '+2',
    trend: 'up',
    icon: {
      path: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      bgColor: 'bg-green-500'
    }
  },
  {
    title: 'Monthly Earnings',
    value: '$8,247',
    change: '+18.2%',
    trend: 'up',
    icon: {
      path: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      bgColor: 'bg-purple-500'
    }
  },
  {
    title: 'Average Rating',
    value: '4.8',
    change: '+0.2',
    trend: 'up',
    icon: {
      path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      bgColor: 'bg-yellow-500'
    }
  }
];

// Revenue and Earnings Data
export const revenueData = [
  { month: 'Jan', courseSales: 4200, liveSessions: 1800, totalEarnings: 6000 },
  { month: 'Feb', courseSales: 3800, liveSessions: 2200, totalEarnings: 6000 },
  { month: 'Mar', courseSales: 5100, liveSessions: 1900, totalEarnings: 7000 },
  { month: 'Apr', courseSales: 4600, liveSessions: 2400, totalEarnings: 7000 },
  { month: 'May', courseSales: 5800, liveSessions: 2200, totalEarnings: 8000 },
  { month: 'Jun', courseSales: 6200, liveSessions: 2500, totalEarnings: 8700 },
  { month: 'Jul', courseSales: 5900, liveSessions: 2800, totalEarnings: 8700 },
  { month: 'Aug', courseSales: 6400, liveSessions: 2600, totalEarnings: 9000 },
];

// Student Enrollment Data
export const enrollmentData = [
  { month: 'Jan', newStudents: 120, totalStudents: 1200 },
  { month: 'Feb', newStudents: 145, totalStudents: 1345 },
  { month: 'Mar', newStudents: 180, totalStudents: 1525 },
  { month: 'Apr', newStudents: 165, totalStudents: 1690 },
  { month: 'May', newStudents: 195, totalStudents: 1885 },
  { month: 'Jun', newStudents: 210, totalStudents: 2095 },
];

// Course Performance Data
export const coursePerformanceData = [
  { course: 'JavaScript Basics', students: 425, rating: 4.9, revenue: 12750 },
  { course: 'React Advanced', students: 312, rating: 4.8, revenue: 18720 },
  { course: 'Python for Beginners', students: 380, rating: 4.7, revenue: 11400 },
  { course: 'Web Design Fundamentals', students: 298, rating: 4.6, revenue: 8940 },
  { course: 'Node.js Backend', students: 245, rating: 4.8, revenue: 14700 },
  { course: 'Data Structures', students: 187, rating: 4.9, revenue: 11220 },
];

// Live Classes Schedule
export const liveClassesData = [
  {
    id: 1,
    title: 'JavaScript Advanced Concepts',
    date: '2025-08-26',
    time: '10:00 AM',
    duration: '2 hours',
    type: 'Team Class',
    students: 45,
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'React Hooks Deep Dive',
    date: '2025-08-26',
    time: '2:00 PM',
    duration: '1.5 hours',
    type: 'Team Class',
    students: 32,
    status: 'upcoming'
  },
  {
    id: 3,
    title: '1-on-1 Career Counseling',
    date: '2025-08-26',
    time: '4:00 PM',
    duration: '1 hour',
    type: '1-to-1',
    students: 1,
    status: 'upcoming'
  },
  {
    id: 4,
    title: 'Python Data Analysis',
    date: '2025-08-27',
    time: '11:00 AM',
    duration: '2 hours',
    type: 'Team Class',
    students: 28,
    status: 'scheduled'
  }
];

// Student Progress Data
export const studentProgressData = [
  { name: 'Emily Chen', course: 'JavaScript Basics', progress: 85, lastActive: '2 hours ago', grade: 'A' },
  { name: 'Michael Rodriguez', course: 'React Advanced', progress: 72, lastActive: '5 hours ago', grade: 'B+' },
  { name: 'Sarah Williams', course: 'Python Basics', progress: 94, lastActive: '1 hour ago', grade: 'A+' },
  { name: 'David Kim', course: 'Web Design', progress: 68, lastActive: '1 day ago', grade: 'B' },
  { name: 'Lisa Johnson', course: 'Node.js Backend', progress: 91, lastActive: '3 hours ago', grade: 'A' },
];

// Messages Data
export const messagesData = [
  {
    id: 1,
    student: 'Emily Chen',
    course: 'JavaScript Basics',
    message: 'Hi Professor, I have a question about async/await functions...',
    time: '10 min ago',
    unread: true
  },
  {
    id: 2,
    student: 'Michael Rodriguez',
    course: 'React Advanced',
    message: 'Thank you for the detailed explanation in today\'s class!',
    time: '2 hours ago',
    unread: true
  },
  {
    id: 3,
    student: 'Sarah Williams',
    course: 'Python Basics',
    message: 'Could you please review my assignment submission?',
    time: '5 hours ago',
    unread: false
  }
];

// Course Categories
export const courseCategories = [
  { name: 'Programming', count: 5, color: 'bg-blue-500' },
  { name: 'Web Development', count: 2, color: 'bg-green-500' },
  { name: 'Data Science', count: 1, color: 'bg-purple-500' },
];

// Recent Activities
export const recentActivities = [
  { type: 'enrollment', message: 'New student enrolled in JavaScript Basics', time: '5 min ago' },
  { type: 'completion', message: 'Sarah Williams completed Python Basics', time: '1 hour ago' },
  { type: 'payment', message: 'Payment received for 1-on-1 session', time: '2 hours ago' },
  { type: 'review', message: 'New 5-star review on React Advanced course', time: '3 hours ago' },
  { type: 'question', message: 'Student question in Web Design Fundamentals', time: '4 hours ago' },
];

export const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];