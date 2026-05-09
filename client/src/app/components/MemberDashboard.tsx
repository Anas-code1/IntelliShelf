import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { BookOpen, Clock, Star, Calendar } from 'lucide-react';
import { Button } from './Button';
import api from '../../api';

interface Transaction {
  _id: string;
  book: { _id: string; title: string; author: string; cover?: string };
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  renewedOn?: string;
  status: string;
  fine: number;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  available: number;
  rating?: number;
}

export const MemberDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<'Borrowed' | 'Reserved' | 'History'>('Borrowed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, booksRes] = await Promise.all([
        api.get('/api/transactions'),
        api.get('/api/books')
      ]);
      setTransactions(transRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (transactionId: string) => {
    try {
      await api.post(`/api/transactions/renew/${transactionId}`);
      alert('Book renewed successfully!');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to renew book');
    }
  };

  const borrowedBooks = transactions.filter(t => t.status === 'Active');
  const reservedBooks = transactions.filter(t => t.status === 'Reserved');
  const pastBooks = transactions
    .filter(t => t.status === 'Returned')
    .sort((a, b) => new Date(b.returnDate || b.issueDate).getTime() - new Date(a.returnDate || a.issueDate).getTime());
  const orderedTransactions = [...transactions].sort(
    (a, b) => new Date(b.returnDate || b.issueDate).getTime() - new Date(a.returnDate || a.issueDate).getTime()
  );
  const totalFines = transactions.reduce((sum, t) => sum + (t.fine || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">Track your reading journey and discover new books.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Books Borrowed</p>
                <h3 className="text-2xl font-bold text-foreground">{borrowedBooks.length}</h3>
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
                <p className="text-sm text-muted-foreground mb-1">Books Reserved</p>
                <h3 className="text-2xl font-bold text-foreground">{reservedBooks.length}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Books Read</p>
                <h3 className="text-2xl font-bold text-foreground">{pastBooks.length}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Fines</p>
                <h3 className="text-2xl font-bold text-foreground">${totalFines}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <CardTitle>My Library Activity</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'Borrowed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('Borrowed')}
            >
              Borrowed
            </Button>
            <Button
              variant={activeTab === 'Reserved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('Reserved')}
            >
              Reserved
            </Button>
            <Button
              variant={activeTab === 'History' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('History')}
            >
              History
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading && (
            <div className="text-center py-8 text-muted-foreground">Loading your activity...</div>
          )}
          {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeTab === 'Borrowed' && borrowedBooks.map((transaction) => {
              const daysLeft = Math.ceil((new Date(transaction.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const canRenew = daysLeft > 0;
              return (
              <div key={transaction._id} className="p-4 rounded-lg border border-border hover:shadow-md transition-all">
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded-lg flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#3B82F6' }}>
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{transaction.book?.title || 'Unknown Book'}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{transaction.book?.author || 'Unknown Author'}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {new Date(transaction.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        daysLeft <= 3
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : daysLeft <= 7
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue!'}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground font-mono">
                      Transaction ID: {transaction.status === 'Active' ? transaction._id : '-'}
                    </div>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canRenew}
                        onClick={() => handleRenew(transaction._id)}
                      >
                        {canRenew ? 'Renew for 14 days' : 'Cannot renew overdue'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )})}
            
            {activeTab === 'Borrowed' && borrowedBooks.length === 0 && (
              <div className="col-span-1 md:col-span-3 text-center py-8 text-muted-foreground">No currently borrowed books.</div>
            )}
            
            {activeTab === 'Reserved' && reservedBooks.map((transaction) => (
              <div key={transaction._id} className="p-4 rounded-lg border border-border hover:shadow-md transition-all">
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded-lg flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#8B5CF6' }}>
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{transaction.book?.title || 'Unknown Book'}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{transaction.book?.author || 'Unknown Author'}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Pick up by: {new Date(transaction.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        Reserved
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground font-mono">
                      Transaction ID: -
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {activeTab === 'Reserved' && reservedBooks.length === 0 && (
              <div className="col-span-1 md:col-span-3 text-center py-8 text-muted-foreground">No active reservations.</div>
            )}

            {activeTab === 'History' && pastBooks.map((transaction) => (
              <div key={transaction._id} className="p-4 rounded-lg border border-border hover:shadow-md transition-all opacity-75">
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded-lg flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#10B981' }}>
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{transaction.book?.title || 'Unknown Book'}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{transaction.book?.author || 'Unknown Author'}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Returned: {transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        Returned
                      </span>
                    </div>
                    {transaction.fine > 0 && (
                      <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                        Fine charged: ${transaction.fine}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {activeTab === 'History' && pastBooks.length === 0 && (
              <div className="col-span-1 md:col-span-3 text-center py-8 text-muted-foreground">No reading history yet.</div>
            )}
          </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {books.slice(0, 4).map((book) => (
              <div key={book._id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{book.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <span className="text-xs px-2 py-0.5 bg-accent rounded-full text-muted-foreground">
                        {book.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-foreground">4.5</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={async () => {
                    try {
                      await api.post('/api/transactions/reserve', { bookId: book._id });
                      alert('Book reserved successfully!');
                      fetchData();
                    } catch (err: any) {
                      alert(err.response?.data?.message || 'Failed to reserve book');
                    }
                  }} disabled={book.available <= 0}>
                    {book.available <= 0 ? 'Out of Stock' : 'Reserve'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading transactions...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Book</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issue Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Return Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fine</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orderedTransactions.map((transaction) => {
                    const canRenew = transaction.status === 'Active' && new Date(transaction.dueDate) > new Date();
                    return (
                      <tr key={transaction._id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                        <td className="py-3 px-4 text-xs font-mono text-muted-foreground">
                          {transaction.status === 'Active' ? transaction._id : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">{transaction.book?.title || 'Unknown Book'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'Active'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : transaction.status === 'Reserved'
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(transaction.issueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{new Date(transaction.dueDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">${transaction.fine || 0}</td>
                        <td className="py-3 px-4">
                          {canRenew ? (
                            <Button size="sm" variant="outline" onClick={() => handleRenew(transaction._id)}>
                              Renew
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {orderedTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No transactions found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
