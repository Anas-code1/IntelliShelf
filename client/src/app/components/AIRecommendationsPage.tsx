import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Sparkles, BookOpen, Star, TrendingUp, Heart, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../../api';

interface AIRecommendation {
  bookId: string;
  title: string;
  author: string;
  score: number;
  reason: string;
  genres: string[];
  rating?: number;
  cover?: string;
}

const genrePreferences = [
  { name: 'Science Fiction', value: 35, color: '#2563EB' },
  { name: 'Fantasy', value: 25, color: '#8B5CF6' },
  { name: 'Historical Fiction', value: 18, color: '#F59E0B' },
  { name: 'Mystery', value: 12, color: '#10B981' },
  { name: 'Romance', value: 10, color: '#EC4899' }
];

const readingPatterns = [
  { month: 'Jan', books: 4, avgRating: 4.2 },
  { month: 'Feb', books: 6, avgRating: 4.5 },
  { month: 'Mar', books: 5, avgRating: 4.3 },
  { month: 'Apr', books: 7, avgRating: 4.6 },
  { month: 'May', books: 8, avgRating: 4.7 },
  { month: 'Jun', books: 6, avgRating: 4.4 }
];

export const AIRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/books/recommendations');
      setRecommendations(data.map((d: any, i: number) => ({...d, cover: ['#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#10B981', '#2563EB'][i%6] })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (bookId: string) => {
    try {
      await api.post('/api/transactions/reserve', { bookId });
      alert('Book reserved successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reserve book');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">AI Book Recommendations</h1>
        </div>
        <p className="text-muted-foreground">Personalized book suggestions powered by machine learning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Recommendations</p>
                <h3 className="text-2xl font-bold text-foreground">24</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Match Accuracy</p>
                <h3 className="text-2xl font-bold text-foreground">94%</h3>
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
                <p className="text-sm text-muted-foreground mb-1">Books from AI</p>
                <h3 className="text-2xl font-bold text-foreground">18</h3>
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
                <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
                <h3 className="text-2xl font-bold text-foreground">4.6</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top AI Recommendations</CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchRecommendations} disabled={loading}>
            <span className="mr-2">{loading ? 'Generating...' : 'Refresh Recommendations'}</span>
            <Sparkles className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? <div className="col-span-3 text-center py-12 text-muted-foreground">AI is reading your library history to find the perfect matches...</div> : 
             recommendations.map((book) => (
              <div
                key={book.bookId}
                className="group rounded-lg border border-border hover:shadow-xl hover:border-primary transition-all cursor-pointer overflow-hidden"
              >
                <div
                  className="h-48 flex flex-col items-center justify-center text-white p-6"
                  style={{ backgroundColor: book.cover }}
                >
                  <BookOpen className="w-16 h-16 mb-3" />
                  <div className="px-4 py-1.5 bg-white/20 backdrop-blur rounded-full flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">{book.score}% Match</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground mb-1">{book.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{book.author}</p>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{book.rating || 4.5}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 italic">{book.reason}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.genres?.map((genre, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-accent text-accent-foreground rounded-full text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => handleReserve(book.bookId)}>
                      Reserve
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Reading Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={genrePreferences}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name} (${entry.value}%)`}
                >
                  {genrePreferences.map((entry, index) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Reading Pattern Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={readingPatterns}>
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
                <Bar dataKey="books" fill="#2563EB" name="Books Read" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How AI Recommendations Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Reading History Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your reading patterns, genres you prefer, and books you've rated highly.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Collaborative Filtering</h4>
              <p className="text-sm text-muted-foreground">
                Compares your preferences with similar readers to find books you might enjoy.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Smart Matching</h4>
              <p className="text-sm text-muted-foreground">
                Uses machine learning to calculate compatibility scores and personalize results.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
