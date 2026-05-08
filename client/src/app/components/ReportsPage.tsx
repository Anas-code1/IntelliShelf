import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Download, FileText, TrendingUp, Users, BookOpen, Loader2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select } from './Input';
import api from '../../api';

export const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/api/reports');
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !reportData) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>;
  }

  const { summary, monthlyActivity, revenueBreakdown, categoryPerformance } = reportData;
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into library operations.</p>
        </div>
        <div className="flex gap-3">
          <Select className="w-40">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </Select>
          <Button variant="primary">
            <Download className="w-5 h-5 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                <h3 className="text-2xl font-bold text-foreground">{summary.totalTransactions}</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.5% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">New Members</p>
                <h3 className="text-2xl font-bold text-foreground">{summary.newMembers}</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+18.2% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Books Circulation</p>
                <h3 className="text-2xl font-bold text-foreground">{summary.booksCirculation}</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8.7% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <h3 className="text-2xl font-bold text-foreground">${summary.totalRevenue}</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+15.3% vs last period</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Borrowing & Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyActivity}>
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
                <Legend />
                <Line type="monotone" dataKey="borrowed" stroke="#2563EB" strokeWidth={2} name="Borrowed" />
                <Line type="monotone" dataKey="returned" stroke="#10B981" strokeWidth={2} name="Returned" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueBreakdown}>
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
                <Legend />
                <Area type="monotone" dataKey="fines" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Fines" />
                <Area type="monotone" dataKey="memberships" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} name="Memberships" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="category" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Bar dataKey="borrowed" fill="#2563EB" name="Borrowed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="returned" fill="#10B981" name="Returned" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Monthly Summary
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Member Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Transaction Log
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Financial Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Atomic Habits', author: 'James Clear', borrowed: 142, rating: 4.8 },
                { title: 'The Silent Patient', author: 'Alex Michaelides', borrowed: 128, rating: 4.6 },
                { title: 'Educated', author: 'Tara Westover', borrowed: 115, rating: 4.7 },
                { title: 'Where the Crawdads Sing', author: 'Delia Owens', borrowed: 98, rating: 4.5 }
              ].map((book, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{book.borrowed}</p>
                    <p className="text-sm text-muted-foreground">times borrowed</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
