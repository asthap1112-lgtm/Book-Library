require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./book');
const bookRoutes = require('./book1');
const resourceRoutes = require('./resource');
console.log('MONGO_URI (raw):', JSON.stringify(process.env.MONGO_URI));

const app = express();
app.use(express.json());
app.use(cors());

const MONGO = process.env.MONGO_URI;

if (!MONGO) {
  console.error('ERROR: MONGO_URI is not set. Fix .env and restart.');
  process.exit(1);
}

mongoose.connect("mongodb://localhost:27017/book-library")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));
    


const bookSchema = new mongoose.Schema({
    title: String,  
    author: String,
    publishedyear: Number,
    genre: String
});
const Book = mongoose.model("Book", bookSchema);

app.get('/books', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

app.post('/books', async (req, res) => {
    const book = new Book(req.body);
    await book.save();
    res.json ({message: "Book added",book: newBook});
});

app.put('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).send('Book not found');
    res.json({message: "Book updated", book});
});

app.delete('/books/:id', async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json({message: "Book deleted"});
}); 
  app.get('/', (req, res) => {
    res.send('Welcome to the Book Library API');
});
app.use("/api/books",require("./book"));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/resources", resourceRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'server error', error: err.message});
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log("server is running at http://localhost:3000");
});
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Mongo connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Mongo connection error:', err.message);
  process.exit(1);
});









