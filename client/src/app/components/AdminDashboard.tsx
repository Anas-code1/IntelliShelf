import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { BookOpen, Users, AlertCircle, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const borrowingTrends = [
  { month: 'Jan', borrowed: 320, returned: 280 },
  { month: 'Feb', borrowed: 380, returned: 340 },
  { month: 'Mar', borrowed: 420, returned: 390 },
  { month: 'Apr', borrowed: 380, returned: 360 },
  { month: 'May', borrowed: 450, returned: 420 },
  { month: 'Jun', borrowed: 490, returned: 460 }
];

const categoryData = [
  { name: 'Fiction', value: 450, color: '#2563EB' },
  { name: 'Non-Fiction', value: 320, color: '#10B981' },
  { name: 'Science', value: 280, color: '#F59E0B' },
  { name: 'History', value: 190, color: '#8B5CF6' },
  { name: 'Technology', value: 240, color: '#EC4899' }
];

const recentActivities = [
  { id: 1, action: 'Book Issued', book: 'The Great Gatsby', member: 'John Doe', time: '10 minutes ago', type: 'issue' },
  { id: 2, action: 'Book Returned', book: '1984', member: 'Jane Smith', time: '25 minutes ago', type: 'return' },
  { id: 3, action: 'Fine Paid', book: 'To Kill a Mockingbird', member: 'Bob Johnson', time: '1 hour ago', type: 'payment' },
  { id: 4, action: 'New Member', book: '-', member: 'Alice Williams', time: '2 hours ago', type: 'member' },
  { id: 5, action: 'Book Issued', book: 'Pride and Prejudice', member: 'Charlie Brown', time: '3 hours ago', type: 'issue' }
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your library.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Books</p>
                <h3 className="text-2xl font-bold text-foreground">12,458</h3>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+12.5%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Issued Books</p>
                <h3 className="text-2xl font-bold text-foreground">3,847</h3>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+8.2%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overdue Books</p>
                <h3 className="text-2xl font-bold text-foreground">127</h3>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500">-5.3%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Members</p>
                <h3 className="text-2xl font-bold text-foreground">2,341</h3>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+15.8%</span>
                  <span className="text-sm text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Borrowing Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={borrowingTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.5rem'
                  }}
                />
                <Line type="monotone" dataKey="borrowed" stroke="#2563EB" strokeWidth={2} />
                <Line type="monotone" dataKey="returned" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Books by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Book</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">{activity.action}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{activity.book}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{activity.member}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{activity.time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          activity.type === 'issue'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : activity.type === 'return'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : activity.type === 'payment'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}
                      >
                        {activity.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
