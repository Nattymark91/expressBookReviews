const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username= req.body.username;
    const password= req.body.password;
  
    if(username && password)
    {
      if(isValid(username))
        {
             users.push({"username":username,"password":password});   
             return res.status(200).json({message: "Customer successfully registred. Now you can login"});
         }
      else
        {
             return res.status(403).json({message: "Username already exists"});
        }
    }
    else {
      return res.status(400).json({message: "All fields are required to be filled in"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
  let booksbyauthor = new Array();
  for (let key in books) {
    const el = books[key];
    if (el.author == author) {
        const item = {
            "isbn" : key,
            "title" : el.title,
            "reviews": el. reviews
        }
      booksbyauthor.push(item);
    }
  }
  return res.status(200).send(JSON.stringify({ booksbyauthor: booksbyauthor }));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksbytitle = new Array();
    for (let key in books) {
      const el = books[key];
      if (el.title == title) {
          const item = {
              "isbn" : key,
              "author" : el.author,
              "reviews": el. reviews
          }
          booksbytitle.push(item);
      }
    }
    return res.status(200).send(JSON.stringify({ booksbytitle: booksbytitle }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = books[isbn].reviews
    return res.status(200).send(JSON.stringify(review));
});

module.exports.general = public_users;
