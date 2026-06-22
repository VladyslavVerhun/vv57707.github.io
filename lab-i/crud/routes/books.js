const express = require('express');
const { db } = require('../db');

const router = express.Router();

router.get('/', (req, res) => {
  const books = db.prepare('SELECT * FROM books ORDER BY id').all();
  res.render('books/list', { books });
});

router.get('/create', (req, res) => {
  res.render('books/create');
});

router.post('/create', (req, res) => {
  const { title, author, publishedYear, genre } = req.body;

  db.prepare(`
    INSERT INTO books (title, author, published_year, genre)
    VALUES (?, ?, ?, ?)
  `).run(title, author, Number(publishedYear), genre);

  res.redirect('/books');
});

router.get('/:id', (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(Number(req.params.id));

  if (!book) {
    res.status(404).send('Book not found');
    return;
  }

  res.render('books/show', { book });
});

router.get('/:id/edit', (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(Number(req.params.id));

  if (!book) {
    res.status(404).send('Book not found');
    return;
  }

  res.render('books/edit', { book });
});

router.post('/:id/edit', (req, res) => {
  const { title, author, publishedYear, genre } = req.body;

  db.prepare(`
    UPDATE books
    SET title = ?, author = ?, published_year = ?, genre = ?
    WHERE id = ?
  `).run(title, author, Number(publishedYear), genre, Number(req.params.id));

  res.redirect('/books');
});

router.post('/:id/delete', (req, res) => {
  db.prepare('DELETE FROM books WHERE id = ?').run(Number(req.params.id));
  res.redirect('/books');
});

module.exports = router;
