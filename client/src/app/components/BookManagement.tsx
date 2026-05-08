import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Input, Select, Textarea } from './Input';
import { Button } from './Button';
import { Modal } from './Modal';
import { Search, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import api from '../../api';

interface Book {
  _id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  quantity: number;
  available: number;
  status: string;
}

export const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'librarian' | 'member'>('member');

  useEffect(() => {
    fetchBooks();
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUserRole(JSON.parse(userInfo).role);
    }
  }, [searchTerm, filterCategory]);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/api/books', {
        params: { search: searchTerm, category: filterCategory }
      });
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [newBook, setNewBook] = useState({
    isbn: '',
    title: '',
    author: '',
    category: '',
    quantity: '',
    description: ''
  });

  const filteredBooks = books;

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/books', newBook);
      alert('Book added successfully!');
      setIsAddModalOpen(false);
      setNewBook({ isbn: '', title: '', author: '', category: '', quantity: '', description: '' });
      fetchBooks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add book');
    }
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/api/books/${bookId}`);
        alert(`Book deleted successfully!`);
        fetchBooks();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{userRole === 'member' ? 'Browse Books' : 'Book Management'}</h1>
          <p className="text-muted-foreground">{userRole === 'member' ? 'Explore and reserve books from our collection.' : 'Manage your library\'s book collection.'}</p>
        </div>
        {userRole !== 'member' && (
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add New Book
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="md:w-48"
            >
              <option value="all">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ISBN</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Author</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Available</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book._id} className="border-b border-border last:border-0 hover:bg-accent transition-colors">
                    <td className="py-3 px-4 text-sm text-muted-foreground">{book.isbn}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{book.title}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{book.author}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{book.category}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{book.quantity}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{book.available}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          book.status === 'Available'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : book.status === 'Low Stock'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {userRole === 'member' ? (
                        <Button variant="primary" size="sm" onClick={async () => {
                          try {
                            await api.post('/api/transactions/reserve', { bookId: book._id });
                            alert('Book reserved successfully!');
                            fetchBooks();
                          } catch (err: any) {
                            alert(err.response?.data?.message || 'Failed to reserve book');
                          }
                        }}>
                          Reserve
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => handleDeleteBook(book._id)}
                              className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Book"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddBook}>
              Add Book
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ISBN"
              placeholder="978-0-123456-78-9"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              required
            />
            <Input
              label="Title"
              placeholder="Book title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Author"
              placeholder="Author name"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
            />
            <Select
              label="Category"
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
            </Select>
          </div>
          <Input
            label="Quantity"
            type="number"
            placeholder="10"
            value={newBook.quantity}
            onChange={(e) => setNewBook({ ...newBook, quantity: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Brief description of the book..."
            rows={3}
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
          />
        </form>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Book"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => document.getElementById('submit-edit-btn')?.click()}>
              Save Changes
            </Button>
          </>
        }
      >
        {selectedBook && (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            try {
              await api.put(`/api/books/${selectedBook._id}`, selectedBook);
              alert('Book updated');
              setIsEditModalOpen(false);
              fetchBooks();
            } catch (err) {
              alert('Failed to update');
            }
          }}>
            <Input label="Title" value={selectedBook.title} onChange={e => setSelectedBook({...selectedBook, title: e.target.value})} />
            <Input label="Author" value={selectedBook.author} onChange={e => setSelectedBook({...selectedBook, author: e.target.value})} />
            <Select label="Category" value={selectedBook.category} onChange={e => setSelectedBook({...selectedBook, category: e.target.value})}>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
            </Select>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity" type="number" value={selectedBook.quantity.toString()} onChange={e => setSelectedBook({...selectedBook, quantity: parseInt(e.target.value)})} />
            </div>
            <Button type="submit" variant="primary" className="hidden" id="submit-edit-btn">Save</Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
