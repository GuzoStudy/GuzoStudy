import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {
  Search,
  Play,
  Users,
  Clock,
  Star,
  MoreVertical,
} from 'lucide-react-native';

const CoursesMonitor = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [searchTerm, setSearchTerm] = useState('');

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. James Miller',
      category: 'Web Development',
      students: 1245,
      rating: 4.8,
      price: 199,
      status: 'published',
      lastUpdated: '2024-01-20',
    },
    {
      id: 2,
      title: 'Data Science with Python',
      instructor: 'Prof. Lisa Anderson',
      category: 'Data Science',
      students: 892,
      rating: 4.9,
      price: 249,
      status: 'published',
      lastUpdated: '2024-01-22',
    },
    {
      id: 3,
      title: 'Mobile App Development',
      instructor: 'Dr. Robert Taylor',
      category: 'Mobile Development',
      students: 567,
      rating: 4.7,
      price: 179,
      status: 'draft',
      lastUpdated: '2024-01-25',
    },
  ];

  const liveClasses = [
    {
      id: 1,
      title: 'Advanced React Patterns',
      instructor: 'Dr. James Miller',
      course: 'Complete Web Development Bootcamp',
      scheduledTime: '2024-01-30T14:00:00',
      duration: 90,
      attendees: 45,
      maxAttendees: 50,
      status: 'scheduled',
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      instructor: 'Prof. Lisa Anderson',
      course: 'Data Science with Python',
      scheduledTime: '2024-01-30T16:00:00',
      duration: 120,
      attendees: 38,
      maxAttendees: 40,
      status: 'live',
    },
    {
      id: 3,
      title: 'iOS Development Workshop',
      instructor: 'Dr. Robert Taylor',
      course: 'Mobile App Development',
      scheduledTime: '2024-01-31T10:00:00',
      duration: 180,
      attendees: 25,
      maxAttendees: 30,
      status: 'scheduled',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return '#10b981';
      case 'draft':
        return '#f59e0b';
      case 'suspended':
      case 'live':
        return '#ef4444';
      case 'scheduled':
        return '#2563eb';
      case 'completed':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  const filteredData = (activeTab === 'courses' ? courses : liveClasses).filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCard = ({ item }) => {
    if (activeTab === 'courses') {
      return (
        <View style={styles.itemCard}>
          <View style={styles.itemRow}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemSubtext}>Instructor: {item.instructor}</Text>
            <Text style={styles.itemSubtext}>Category: {item.category}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
              <Text style={{ color: getStatusColor(item.status), fontWeight: '600' }}>
                {item.status}
              </Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <Users size={16} color="#64748b" />
            <Text style={styles.itemLabel}>{item.students} students</Text>
            <Star size={16} color="#f59e0b" />
            <Text style={styles.itemLabel}>{item.rating}</Text>
            <TouchableOpacity style={styles.actionButton}>
              <MoreVertical size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtext}>Instructor: {item.instructor}</Text>
          <Text style={styles.itemSubtext}>Course: {item.course}</Text>
          <Text style={styles.itemSubtext}>
            Scheduled: {new Date(item.scheduledTime).toLocaleString()}
          </Text>
          <View style={styles.itemRow}>
            <Clock size={16} color="#64748b" />
            <Text style={styles.itemLabel}>{item.duration} min</Text>
            <Users size={16} color="#64748b" />
            <Text style={styles.itemLabel}>{item.attendees}/{item.maxAttendees}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
              <Text style={{ color: getStatusColor(item.status), fontWeight: '600' }}>
                {item.status}
              </Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <MoreVertical size={16} color="#64748b" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Courses & Live Classes Monitor</Text>
      <Text style={styles.subtext}>
        Monitor course performance, manage live classes, and track engagement
      </Text>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total Courses', value: '163', icon: Play, color: '#2563eb', bg: '#dbeafe' },
          { label: 'Total Enrollments', value: '12,847', icon: Users, color: '#10b981', bg: '#dcfce7' },
          { label: 'Live Classes Today', value: '8', icon: Clock, color: '#ef4444', bg: '#fee2e2' },
          { label: 'Avg Rating', value: '4.8', icon: Star, color: '#f59e0b', bg: '#fef3c7' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <View key={i} style={styles.statsCard}>
              <View style={[styles.statIconBg, { backgroundColor: stat.bg }]}>
                <Icon size={24} color={stat.color} />
              </View>
              <View>
                <Text style={styles.statsLabel}>{stat.label}</Text>
                <Text style={[styles.statsValue, { color: stat.color }]}>{stat.value}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabRow}>
        {['courses', 'live-classes'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.tabButtonActive,
            ]}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.tabTextActive,
            ]}>
              {tab.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Search size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab.replace('-', ' ')}`}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Filter / Action Buttons */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>
            {activeTab === 'courses' ? 'Add Course' : 'Schedule Class'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Data List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CoursesMonitor;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtext: {
    color: '#64748b',
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  statIconBg: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    color: '#64748b',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  tabTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  btnSecondary: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#64748b',
    fontWeight: '600',
  },
  btnPrimary: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 50,
  },
  itemCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 16,
  },
  itemRow: {
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtext: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  itemLabel: {
    marginHorizontal: 6,
    color: '#64748b',
    fontSize: 13,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  actionButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
});
