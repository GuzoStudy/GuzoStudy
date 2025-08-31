import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Bell, Search, Menu, User } from 'lucide-react-native'; // Use lucide-react-native for RN icons

const StudentHeader = ({ onMenuClick }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {/* Left side */}
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuButton} onPress={onMenuClick}>
            <Menu size={24} color="#6b7280" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Search size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              placeholder="Search courses, assignments..."
              placeholderTextColor="#6b7280"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Right side */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#6b7280" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.userMenu}>
            <View style={styles.userAvatar}>
              <User size={20} color="white" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>John Doe</Text>
              <Text style={styles.userRole}>Student</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 16,
    paddingHorizontal: 32,
    ...Platform.select({
      ios: { paddingTop: 50 }, // To handle status bar in iOS
      android: { paddingTop: 20 },
      default: { paddingTop: 16 },
    }),
    zIndex: 100,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // gap is not supported in RN, will use margin
    flex: 1,
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    maxWidth: 400,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    marginTop: -10, // half icon size for vertical center
  },
  searchInput: {
    height: 40,
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 40,
    fontSize: 14,
    color: '#1e293b',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ef4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  userMenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '500',
    fontSize: 14,
    color: '#1e293b',
  },
  userRole: {
    fontSize: 12,
    color: '#6b7280',
  },
});

// Optional: You can add responsiveness with react-native-responsive or react-native-media-query if needed.

export default StudentHeader;
