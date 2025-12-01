require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = reuire('cors');

 const bookRouter = require('./router/books');
const { Console } = require('console');

 const app = expresss();
 app.use(cors());
 app.use(express.json());

 const PORT = process.env.PORT || 5000;
 const MONGODB_URI = process.MONGODB_URI;

 mongoose.connect(MONGODB_URI,{
    useNewUrlparser: true,
    useUnifiedTopology: true
 })
 .then(() => console.log('MongoDB connected'))
 .catch(err =>{
    console.error('MongoDB connection error:',err.message);
    process.exit(1);
 });

 app.use('/api/books',booksrouter);

 app.get('/',(req,res)=> res.send('Book Library API is running'));
 app.listen(PORT,() => Console.LOG(`Server running on port ${PORT}`));

