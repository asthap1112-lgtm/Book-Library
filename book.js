const express = require('express');
const bcrypt = require('bcrypt');
const book = require('./book');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
require('dotenv').config();

router.get('/books', async (req, res) => {
    res.send("book route working");
});
 
router.get('/', async(req, res)=> {
    const books = await book.find();
    res.json(books);
});

router.post('/addbook', async (req, res) => {
    try {
        const { title, author, publishyear,genre } = req.body;
        if (!title || !author || !publishyear || !genre) {
            return res.status(400).json({ message: 'All fields are required' });
        }   
        const newBook = new book({ title, author, publishyear, genre });
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
}); 
router.post('/register', async (req, res) => {
    try {
        const { username,email,  password } = req.body;  
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, email, password });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
    router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }           
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });        
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) { 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

    router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

    router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;                   
        if (!usernameme|| !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }   
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'user not found' });
        }   
        const isMatch = await bcrypt.compare(password, user.password);      
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }   
        const token = jwt.sign({ userID: user._id }, 'MY_SECRET_KEY', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
module.exports = router; 