import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Input, Select } from './Input';
import { Button } from './Button';
import { BookCheck, BookX, AlertTriangle, Clock } from 'lucide-react';
import api from '../../api';

interface Transaction {
  _id: string;
  book: { _id: string; title: string; isbn: string };
  member: { _id: string; name: string; email: string };
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  fine: number;
  createdAt?: string;
}

export const LibrarianDashboard: React.FC = () => {
  const [issueBookId, setIssueBookId] = useState('');
  const [issueMemberId, setIssueMemberId] = useState('');
  const [issueDays, setIssueDays] = useState('14');
  const [returnTransactionId, setReturnTransactionId] = useState('');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/api/transactions');
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const normalizedBook = issueBookId.trim();
      const normalizedMember = issueMemberId.trim();
      await api.post('/api/transactions/issue', {
        bookId: normalizedBook,
        memberId: normalizedMember,
        days: parseInt(issueDays)
      });
      alert('Book issued successfully!');
      setIssueBookId('');
      setIssueMemberId('');
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to issue book.');
    }
  };

  const handleReturnBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const normalizedTransaction = returnTransactionId.trim();
      await api.post(`/api/transactions/return/${normalizedTransaction}`);
      alert('Book returned successfully!');
      setReturnTransactionId('');
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to return book. Check Transaction ID.');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const issuesToday = transactions.filter(t => t.issueDate?.startsWith(today)).length;
  const returnsToday = transactions.filter(t => t.returnDate?.startsWith(today)).length;
  const overdueList = transactions.filter(t => t.status === 'Active' && new Date(t.dueDate) < new Date());
  const dueToday = transactions.filter(t => t.status === 'Active' && t.dueDate?.startsWith(today)).length;


  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Librarian Dashboard</h1>
        <p className="text-muted-foreground">Manage daily book transactions and member requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Issues</p>
                <h3 className="text-2xl font-bold text-foreground">{issuesToday}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <BookCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Today's Returns</p>
                <h3 className="text-2xl font-bold text-foreground">{returnsToday}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <BookX className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overdue Books</p>
                <h3 className="text-2xl font-bold text-foreground">{overdueList.length}</h3>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Due Today</p>
                <h3 className="text-2xl font-bold text-foreground">{dueToday}</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Issue Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleIssueBook} className="space-y-4">
              <Input
                label="Book ID / ISBN"
                placeholder="Enter book ID or ISBN"
                value={issueBookId}
                onChange={(e) => setIssueBookId(e.target.value)}
                required
              />
              <Input
                label="Member ID"
                placeholder="Enter member ID or email"
                value={issueMemberId}
                onChange={(e) => setIssueMemberId(e.target.value)}
                required
              />
              <Select label="Issue Duration" value={issueDays} onChange={(e) => setIssueDays(e.target.value)}>
                <option value="7">7 Days</option>
                <option value="14">14 Days</option>
                <option value="30">30 Days</option>
              </Select>
              <Button type="submit" variant="primary" className="w-full">
                Issue Book
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Return Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReturnBook} className="space-y-4">
              <Input
                label="Transaction ID"
                placeholder="Enter active transaction ID"
                value={returnTransactionId}
                onChange={(e) => setReturnTransactionId(e.target.value)}
                required
              />
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="text-foreground">No overdue fine</p>
                <p className="text-sm text-muted-foreground mt-2">Return Date: May 7, 2026</p>
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Process Return
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Books Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Book Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fine</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {overdueList.map((item) => (
                  <tr key={item._id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">{item.book?.title}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{item.member?.name}</td>
                    <td className="py-3 px-4 text-sm text-red-600 dark:text-red-400">{new Date(item.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">${item.fine}</td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">Send Reminder</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Book Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction._id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                    <td className="py-3 px-4 text-sm text-foreground">{transaction.book?.title}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{transaction.member?.name}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                      {transaction.status === 'Active' ? transaction._id : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{transaction.status}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(transaction.createdAt || transaction.issueDate).toLocaleTimeString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'Active'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}
                      >
                        {transaction.status}
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
