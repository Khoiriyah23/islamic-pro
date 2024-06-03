const mongoose = require("mongoose");

const date = new Date();
const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

const book = {
  datePublished: formattedDate,
};

console.log(book.datePublished);

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  srcName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  datePublished: {
    type: String, 
    required: true,
  },
  dateUpdated: {
    type:String,
    required:true,
},
  numberOfPages: {
    type: Number,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  subjects: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId, ref: "Admin"
  }
});

const BookModel = mongoose.model('Book', BookSchema);

module.exports = BookModel;