const { GoogleGenAI } = require('@google/genai');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

const getRecommendations = async (req, res) => {
  try {
    const memberId = req.user._id;

    // Get member's transaction history to understand preferences
    const transactions = await Transaction.find({ member: memberId }).populate('book');
    const readBooks = transactions.map(t => `${t.book.title} by ${t.book.author} (${t.book.category})`);

    // Get available library books to recommend from
    const availableBooks = await Book.find({ available: { $gt: 0 } }).select('title author category _id rating');
    const catalog = availableBooks.map(b => `${b.title} by ${b.author} (ID: ${b._id})`);

    // Initialize Gemini
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let prompt = `You are an AI Librarian. 
The user has read the following books: ${readBooks.length > 0 ? readBooks.join(', ') : 'None yet.'}.
Our library currently has these books available: ${catalog.join(', ')}.

Based on what they've read, select exactly 4 books from our catalog that they would enjoy most. If they haven't read anything, just pick 4 diverse popular books.
For each book, provide a compatibility score (0-100), a short 1-sentence reason why you recommend it, and 3 relevant genres.

Respond EXACTLY in this JSON array format, and nothing else:
[
  {
    "bookId": "the ID from the catalog",
    "title": "Book Title",
    "author": "Author Name",
    "score": 95,
    "reason": "Because you love science fiction...",
    "genres": ["Sci-Fi", "Space", "Adventure"]
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    // Extract JSON from response (in case Gemini wraps it in markdown blocks)
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const recommendations = JSON.parse(jsonStr);

    res.json(recommendations);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Failed to generate recommendations' });
  }
};

module.exports = { getRecommendations };
