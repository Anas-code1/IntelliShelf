import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { BookOpen, Users, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../api';

interface Book {
  _id: string;
  category: string;
}

interface User {
  _id: string;
  role: string;
}

interface Transaction {
  _id: string;
  status: string;
  issueDate: string;
  dueDate?: string;
  returnDate?: string;
  createdAt?: string;
  book?: { title?: string };
  member?: { name?: string };
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, usersRes, transactionsRes] = await Promise.all([
          api.get('/api/books'),
          api.get('/api/users'),
          api.get('/api/transactions')
        ]);
        setBooks(booksRes.data);
        setUsers(usersRes.data);
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error('Error loading admin dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeMembers = users.filter(user => user.role === 'member').length;
  const issuedBooks = transactions.filter(t => t.status === 'Active').length;
  const overdueBooks = transactions.filter(t => t.status === 'Active' && new Date(t.dueDate || '') < new Date()).length;
  const trendData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    return {
      key,
      month: date.toLocaleString('en-US', { month: 'short' }),
      borrowed: 0,
      returned: 0
    };
  });

  transactions.forEach((tx) => {
    const issueDate = new Date(tx.issueDate);
    const issueKey = `${issueDate.getFullYear()}-${issueDate.getMonth()}`;
    const issueBucket = trendData.find((item) => item.key === issueKey);
    if (issueBucket) issueBucket.borrowed += 1;

    if (tx.returnDate) {
      const returnDate = new Date(tx.returnDate);
      const returnKey = `${returnDate.getFullYear()}-${returnDate.getMonth()}`;
      const returnBucket = trendData.find((item) => item.key === returnKey);
      if (returnBucket) returnBucket.returned += 1;
    }
  });
  const categoryCounts = books.reduce((acc: Record<string, number>, book) => {
    const key = book.category || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

  const recentActivities = transactions
    .slice(0, 8)
    .map((tx) => ({
      id: tx._id,
      action: tx.status === 'Returned' ? 'Book Returned' : tx.status === 'Reserved' ? 'Book Reserved' : 'Book Issued',
      book: tx.book?.title || 'Unknown Book',
      member: tx.member?.name || 'Unknown Member',
      time: new Date(tx.createdAt || tx.issueDate).toLocaleString(),
      type: tx.status === 'Returned' ? 'return' : tx.status === 'Reserved' ? 'reserve' : 'issue'
    }));

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                <h3 className="text-2xl font-bold text-foreground">{books.length}</h3>
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
                <h3 className="text-2xl font-bold text-foreground">{issuedBooks}</h3>
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
                <h3 className="text-2xl font-bold text-foreground">{overdueBooks}</h3>
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
                <h3 className="text-2xl font-bold text-foreground">{activeMembers}</h3>
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
              <LineChart data={trendData.map(({ key, ...rest }) => rest)}>
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
                            : activity.type === 'reserve'
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
