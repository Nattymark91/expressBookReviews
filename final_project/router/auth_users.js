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
        let user = username;
        let chekUser = users.filter((i)=>i.username == user)
        if(chekUser.length>0 && chekUser[0].password == password ){
        return true
        }
        else
        {
        return false
        }
        }

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    let user = req.body.username
    if(authenticatedUser(user, req.body.password)) {
    
        let token = jwt.sign({data: req.body.password},"secret",{expiresIn: '1h'})
        req.session.authorization = {token,user}
        res.status(200).json({message: "Customer succcessfully logged in"})
     
    } else {
      return res.status(400).json({message: "Invalid username or password"});
    }
    
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
      let review = req.body.reviews;
      book.reviews = review;
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
