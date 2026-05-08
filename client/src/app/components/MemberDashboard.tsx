import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { BookOpen, Clock, Star, TrendingUp, Calendar } from 'lucide-react';
import { Button } from './Button';
import api from '../../api';

interface Transaction {
  _id: string;
  book: { _id: string; title: string; author: string; cover?: string };
  dueDate: string;
  status: string;
  fine: number;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  rating?: number;
}

export const MemberDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, booksRes] = await Promise.all([
        api.get('/api/transactions'),
        api.get('/api/books')
      ]);
      setTransactions(transRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
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
  const pastBooks = transactions.filter(t => t.status === 'Returned');
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
                <p className="text-sm text-muted-foreground mb-1">Reading Streak</p>
                <h3 className="text-2xl font-bold text-foreground">12 days</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Fines</p>
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
        <CardHeader>
          <CardTitle>Currently Borrowed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {borrowedBooks.map((transaction) => {
              const daysLeft = Math.ceil((new Date(transaction.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              return (
              <div key={transaction._id} className="p-4 rounded-lg border border-border hover:shadow-md transition-all">
                <div className="flex gap-4">
                  <div className="w-16 h-24 rounded-lg flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#3B82F6' }}>
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{transaction.book?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{transaction.book?.author}</p>
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
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => handleRenew(transaction._id)}>
                  Request Renewal
                </Button>
              </div>
            )})}
          </div>
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
                  }}>
                    Reserve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
