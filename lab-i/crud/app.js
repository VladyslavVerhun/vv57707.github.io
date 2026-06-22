const express = require('express');
const path = require('node:path');

const booksRouter = require('./routes/books');
const { initDb } = require('./db');

initDb();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/books');
});

app.use('/books', booksRouter);

module.exports = app;
