const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

    router.post('/', async (req, res) => {
try {
const { title, author, year, genre } = req.body;

      if (!title || !author) {
return res.status(400).json({ message: 'title and author are required' });
}


const book = new Book({ title, author, year, genre });
const saved = await book.save();


return res.status(201).json({ message: 'Book created', book: saved });
} catch (err) {
console.error('Error creating book:', err);
return res.status(500).json({ message: 'Server error' });
}
});
router.get('/', async (req, res) => {
try {
const books = await Book.find().sort({ createdAt: -1 }).limit(100);
res.json({ count: books.length, books });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;