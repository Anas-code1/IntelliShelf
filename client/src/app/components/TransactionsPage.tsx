import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './Card';
import { BookCheck, BookX, Clock, RotateCcw } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import api from '../../api';

interface Transaction {
  _id: string;
  book: { title: string; isbn: string };
  member: { name: string; email: string };
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  renewedOn?: string;
  status: string;
  fine: number;
}

export const TransactionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('issued');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/api/transactions');
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (transactionId: string) => {
    try {
      await api.post(`/api/transactions/approve/${transactionId}`);
      alert('Reservation approved successfully!');
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve reservation');
    }
  };

  const issuedTransactions = transactions.filter(t => t.status === 'Active' || t.status === 'Reserved');
  const returnedTransactions = transactions.filter(t => t.status === 'Returned');
  const overdueTransactions = transactions.filter(t => t.status === 'Active' && new Date(t.dueDate) < new Date());
  const renewalTransactions = transactions.filter(t => t.renewedOn);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
        <p className="text-muted-foreground">Track all book transactions across your library.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Issued</p>
                <h3 className="text-2xl font-bold text-foreground">{issuedTransactions.length}</h3>
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
                <p className="text-sm text-muted-foreground mb-1">Total Returned</p>
                <h3 className="text-2xl font-bold text-foreground">{returnedTransactions.length}</h3>
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
                <p className="text-sm text-muted-foreground mb-1">Overdue</p>
                <h3 className="text-2xl font-bold text-foreground">{overdueTransactions.length}</h3>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Renewals</p>
                <h3 className="text-2xl font-bold text-foreground">{renewalTransactions.length}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex border-b border-border mb-6">
              <Tabs.Trigger
                value="issued"
                className="px-4 py-2 border-b-2 transition-colors data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground"
              >
                Issued Books
              </Tabs.Trigger>
              <Tabs.Trigger
                value="returned"
                className="px-4 py-2 border-b-2 transition-colors data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground"
              >
                Returned Books
              </Tabs.Trigger>
              <Tabs.Trigger
                value="overdue"
                className="px-4 py-2 border-b-2 transition-colors data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground"
              >
                Overdue Books
              </Tabs.Trigger>
              <Tabs.Trigger
                value="renewals"
                className="px-4 py-2 border-b-2 transition-colors data-[state=active]:border-primary data-[state=active]:text-primary data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground"
              >
                Renewals
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="issued">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Book Title</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuedTransactions.map((transaction) => (
                      <tr key={transaction._id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{transaction.book?.title}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{transaction.member?.name}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground font-mono">
                          {transaction.status === 'Active' ? transaction._id : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(transaction.issueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(transaction.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${transaction.status === 'Reserved' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                              {transaction.status}
                            </span>
                            {transaction.status === 'Reserved' && (
                              <button
                                onClick={() => handleApprove(transaction._id)}
                                className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded transition-colors"
                              >
                                Approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tabs.Content>

            <Tabs.Content value="returned">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Book Title</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Return Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedTransactions.map((transaction) => (
                      <tr key={transaction._id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{transaction.book?.title}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{transaction.member?.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(transaction.issueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : '-'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-sm font-medium ${
                              transaction.fine === 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-orange-600 dark:text-orange-400'
                            }`}
                          >
                            ${transaction.fine}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tabs.Content>

            <Tabs.Content value="overdue">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Book Title</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Days Overdue</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdueTransactions.map((transaction) => {
                      const daysOverdue = Math.ceil(Math.abs(new Date().getTime() - new Date(transaction.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                      return (
                      <tr key={transaction._id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{transaction.book?.title}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{transaction.member?.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(transaction.issueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm text-red-600 dark:text-red-400">{new Date(transaction.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                            {daysOverdue} days
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-red-600 dark:text-red-400">${daysOverdue}</td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </Tabs.Content>

            <Tabs.Content value="renewals">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Book Title</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Member</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Original Due Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">New Due Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Renewed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renewalTransactions.map((transaction) => (
                      <tr key={transaction._id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                        <td className="py-3 px-4 text-sm font-medium text-foreground">{transaction.book?.title}</td>
                        <td className="py-3 px-4 text-sm text-foreground">{transaction.member?.name}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">-</td>
                        <td className="py-3 px-4 text-sm text-green-600 dark:text-green-400">{new Date(transaction.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.renewedOn ? new Date(transaction.renewedOn).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </CardContent>
      </Card>
    </div>
  );
};
