const express = require('express');
const bcrypt = require('bcryptjs');
const book = require('../models/user'); 
const router = express.Router();

router.post("/add-book", async (req, res) => {
    try {
        const { name, author, year, genre } = req.body;
    
        if (!name || !author) {
            return res.status(400).json({ msg: "Please enter  required fields" });
        }
        const existingBook = await book.findOne({ name});
        if (existingBook) {
            return res.status(400).json({ msg: "Book already exists" });
        }   
        const newBook = new book({
            name,
            author,
            year,   
            genre
        });
        await newBook.save();
        res.status(201).json({ msg: "Book added successfully", book: newBook });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    router.post("/addbook", async (req, res) => {
        res.send(" API workings");
});
});
module.exports = router;