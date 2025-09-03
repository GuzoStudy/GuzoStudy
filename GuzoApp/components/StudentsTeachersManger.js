import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
} from 'lucide-react-native'; // Use lucide-react-native for RN

const StudentsTeachersManager = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      phone: '+1 234 567 8901',
      courses: 3,
      status: 'active',
      joinDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Emma Davis',
      email: 'emma@example.com',
      phone: '+1 234 567 8902',
      courses: 5,
      status: 'active',
      joinDate: '2024-02-20',
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+1 234 567 8903',
      courses: 2,
      status: 'suspended',
      joinDate: '2024-03-10',
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1 234 567 8904',
      courses: 4,
      status: 'active',
      joinDate: '2024-01-05',
    },
  ];

  const teachers = [
    {
      id: 1,
      name: 'Dr. James Miller',
      email: 'james@example.com',
      phone: '+1 234 567 9001',
      courses: 12,
      students: 450,
      status: 'verified',
      rating: 4.9,
      joinDate: '2023-09-15',
    },
    {
      id: 2,
      name: 'Prof. Lisa Anderson',
      email: 'lisa@example.com',
      phone: '+1 234 567 9002',
      courses: 8,
      students: 320,
      status: 'verified',
      rating: 4.8,
      joinDate: '2023-11-20',
    },
    {
      id: 3,
      name: 'Dr. Robert Taylor',
      email: 'robert@example.com',
      phone: '+1 234 567 9003',
      courses: 15,
      students: 680,
      status: 'pending',
      rating: 4.7,
      joinDate: '2024-01-10',
    },
    {
      id: 4,
      name: 'Maria Garcia',
      email: 'maria@example.com',
      phone: '+1 234 567 9004',
      courses: 6,
      students: 200,
      status: 'verified',
      rating: 4.9,
      joinDate: '2023-12-05',
    },
  ];

  const filteredData = (activeTab === 'students' ? students : teachers).filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={[styles.cell, { flex: 2 }]}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.idText}>ID: {item.id}</Text>
      </View>
      <View style={[styles.cell, { flex: 2 }]}>
        <View style={styles.contactRow}>
          <Mail size={14} color="#64748b" />
          <Text style={styles.contactText}>{item.email}</Text>
        </View>
        <View style={styles.contactRow}>
          <Phone size={14} color="#64748b" />
          <Text style={styles.contactText}>{item.phone}</Text>
        </View>
      </View>
      <View style={styles.cell}>
        <Text style={styles.boldText}>{item.courses}</Text>
      </View>
      {activeTab === 'teachers' && (
        <>
          <View style={styles.cell}>
            <Text style={styles.boldText}>{item.students}</Text>
          </View>
          <View style={[styles.cell, styles.ratingBadge]}>
            <Text style={styles.ratingText}>⭐ {item.rating}</Text>
          </View>
        </>
      )}
      <View style={styles.cell}>
        <View style={[styles.statusBadge, styles[`status_${item.status}`]]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.cell}>
        <Text style={styles.joinDate}>{item.joinDate}</Text>
      </View>
      <View style={styles.cell}>
        <TouchableOpacity style={styles.actionButton}>
          <MoreVertical size={16} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Students & Teachers Management</Text>
        <Text style={styles.subtitle}>
          Manage user accounts, permissions, and monitor activity
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Students</Text>
          <Text style={[styles.cardValue, { color: '#2563eb' }]}>2,485</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Teachers</Text>
          <Text style={[styles.cardValue, { color: '#10b981' }]}>158</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pending Verifications</Text>
          <Text style={[styles.cardValue, { color: '#f59e0b' }]}>23</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suspended Accounts</Text>
          <Text style={[styles.cardValue, { color: '#ef4444' }]}>12</Text>
        </View>
      </View>

      <View style={styles.card}>
        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          {['students', 'teachers'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === tab && styles.tabButtonTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search and Filter Bar */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBox}>
            <Search
              size={20}
              color="#94a3b8"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder={`Search ${activeTab}...`}
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <TouchableOpacity style={styles.btnSecondary}>
            <Filter size={16} color="#000" />
            <Text style={styles.btnSecondaryText}>Filter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>
              Add New {activeTab === 'students' ? 'Student' : 'Teacher'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Data List */}
        <View horizontal>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No {activeTab} found.</Text>
            }
            style={{ minWidth: 800 }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerSection: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 8, color: '#000' },
  subtitle: { fontSize: 16, color: '#64748b' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  card: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, color: '#64748b', marginBottom: 8 },
  cardValue: { fontSize: 24, fontWeight: '700' },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 24,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#2563eb',
  },
  tabButtonText: {
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'capitalize',
  },
  tabButtonTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 10,
  },
  searchInput: {
    paddingLeft: 40,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnSecondaryText: {
    fontSize: 16,
    color: '#000',
  },
  btnPrimary: {
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    paddingHorizontal: 8,
  },
  nameText: { fontWeight: '600', fontSize: 16, color: '#000' },
  idText: { fontSize: 14, color: '#64748b' },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  contactText: { fontSize: 14, color: '#000' },
  boldText: { fontWeight: '600', fontSize: 16, color: '#000' },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    color: '#92400e',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  status_active: {
    backgroundColor: '#d1fae5',
  },
  status_suspended: {
    backgroundColor: '#fee2e2',
  },
  status_verified: {
    backgroundColor: '#d1fae5',
  },
  status_pending: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  joinDate: {
    fontSize: 14,
    color: '#64748b',
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#64748b',
    fontSize: 16,
  },
});

export default StudentsTeachersManager;
