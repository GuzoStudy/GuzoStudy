import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { DollarSign, Users, BookOpen, TrendingUp } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#2563eb',
  },
};

const stats = [
  {
    title: 'Total Revenue',
    value: '$47,250',
    change: '+12.5%',
    icon: DollarSign,
    color: '#10b981',
  },
  {
    title: 'Active Users',
    value: '2,847',
    change: '+8.2%',
    icon: Users,
    color: '#2563eb',
  },
  {
    title: 'Published Courses',
    value: '163',
    change: '+23.1%',
    icon: BookOpen,
    color: '#8b5cf6',
  },
  {
    title: 'Engagement Rate',
    value: '87.3%',
    change: '+5.4%',
    icon: TrendingUp,
    color: '#f59e0b',
  },
];

export default function AnalyticsDashboard() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics Dashboard</Text>
      <Text style={styles.subtext}>Track performance, revenue, and engagement metrics</Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <View key={index} style={styles.statCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.statTitle}>{stat.title}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={{ color: stat.color, fontWeight: '600' }}>
                  {stat.change} from last month
                </Text>
              </View>
              <View style={[styles.iconWrapper, { backgroundColor: `${stat.color}20` }]}>
                <Icon size={28} color={stat.color} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Monthly Revenue */}
      <Text style={styles.chartTitle}>Monthly Revenue</Text>
      <BarChart
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{ data: [30000, 35000, 32000, 40000, 45000, 47250] }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      {/* Course Categories */}
      <Text style={styles.chartTitle}>Course Categories</Text>
      <PieChart
        data={[
          { name: 'Web Dev', population: 30, color: '#2563eb', legendFontColor: '#64748b', legendFontSize: 12 },
          { name: 'Data Science', population: 25, color: '#10b981', legendFontColor: '#64748b', legendFontSize: 12 },
          { name: 'Mobile Apps', population: 20, color: '#f59e0b', legendFontColor: '#64748b', legendFontSize: 12 },
          { name: 'Design', population: 15, color: '#8b5cf6', legendFontColor: '#64748b', legendFontSize: 12 },
          { name: 'Marketing', population: 10, color: '#ef4444', legendFontColor: '#64748b', legendFontSize: 12 },
        ]}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={styles.chart}
      />

      {/* Engagement Trends */}
      <Text style={styles.chartTitle}>Engagement Trends</Text>
      <LineChart
        data={{
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              data: [1200, 1500, 1800, 2100],
              color: () => '#2563eb',
              strokeWidth: 2,
            },
            {
              data: [800, 950, 1100, 1400],
              color: () => '#10b981',
              strokeWidth: 2,
            },
          ],
          legend: ['Course Views', 'Course Completions'],
        }}
        width={screenWidth - 32}
        height={240}
        chartConfig={chartConfig}
        style={styles.chart}
      />

      {/* Recent Activity */}
      <Text style={styles.chartTitle}>Recent Activity</Text>
      <View style={{ gap: 12 }}>
        {[
          { action: 'New course published', user: 'Dr. Sarah Johnson', time: '2 hours ago' },
          { action: 'Payment received', user: 'John Smith', time: '4 hours ago' },
          { action: 'Teacher verification completed', user: 'Prof. Mike Chen', time: '6 hours ago' },
          { action: 'Fraud alert resolved', user: 'System', time: '8 hours ago' },
        ].map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <View>
              <Text style={{ fontWeight: '500' }}>{activity.action}</Text>
              <Text style={{ fontSize: 13, color: '#64748b' }}>{activity.user}</Text>
            </View>
            <Text style={{ fontSize: 13, color: '#64748b' }}>{activity.time}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statTitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  chart: {
    borderRadius: 12,
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
