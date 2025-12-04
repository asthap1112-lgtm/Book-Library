const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const bookSchema = new mongoose.Schema({
    title :{
    type: String,      
    required:[true, 'Title is required'],
},
   author: {
    type: String,
    required: [true, 'Author is required'], 
   },
   publishedyear: {
    type: Number,
   },
    genre: {    
    type: String,
    },
});
bookSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

bookSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("book", bookSchema);


    
