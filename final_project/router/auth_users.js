const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let chekUser = users.filter((user) => user.username == username)
    if( chekUser.length  > 0 ){
      return false;
    }
    else {
      return true
    }
    
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let chekUser = users.filter((user) => user.username == username && user.password == user.password)
    if( chekUser.length  > 0 ){
      return false;
    }
    else {
      return true
    }
}

//only registered users can login
regd_users.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    if(username && password)
    {
        if (authenticatedUser(username, password)) {
                let accessToken = jwt.sign(
                    {
                    data: password,
                    },
                    "secret",
                    { expiresIn: '1h' }
                );
                req.session.authorization = {
                    accessToken,
                    username,
                };
                    return res.status(200).send("Customer succsesfully loged in");
            } 
        else {
            return res.status(403).json({ message: "Incorrect username or password" });
        }
    } else {
        return res.status(403).json({ message: "All fields are required to be filled in" });
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
      book.reviews = req.body.reviews;
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated`);
    } else {
        return res.status(404).send("Book not found");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
      book.reviews = '';
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been deleted`);
    } else {
        return res.status(404).send("Book not found");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
