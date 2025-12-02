const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    author:{
            type: String,
         required: [true, "Author is required"],
     },
     year:{
        type: Number
     },
    genre:{
        type: String,
    } ,
});
module.exports = mongoose.model('Book', bookSchema);
