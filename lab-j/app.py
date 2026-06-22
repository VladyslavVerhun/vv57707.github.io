import sqlite3
from flask import Flask, redirect, render_template, request

app = Flask(__name__)
DATABASE = "data.db"


def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            published_year INTEGER NOT NULL,
            genre TEXT NOT NULL
        )
    """)

    count = conn.execute("SELECT COUNT(*) FROM books").fetchone()[0]

    if count == 0:
        conn.execute(
            "INSERT INTO books (title, author, published_year, genre) VALUES (?, ?, ?, ?)",
            ("The Hobbit", "J.R.R. Tolkien", 1937, "Fantasy"),
        )
        conn.execute(
            "INSERT INTO books (title, author, published_year, genre) VALUES (?, ?, ?, ?)",
            ("Solaris", "Stanislaw Lem", 1961, "Science fiction"),
        )
        conn.execute(
            "INSERT INTO books (title, author, published_year, genre) VALUES (?, ?, ?, ?)",
            ("Clean Code", "Robert C. Martin", 2008, "Programming"),
        )

    conn.commit()
    conn.close()


@app.route("/")
def home():
    return redirect("/books")


@app.route("/books")
def books_list():
    conn = get_db_connection()
    books = conn.execute("SELECT * FROM books ORDER BY id").fetchall()
    conn.close()

    return render_template("books/list.html", books=books)


@app.route("/books/<int:book_id>")
def book_details(book_id):
    conn = get_db_connection()
    book = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
    conn.close()

    if book is None:
        return "Book not found", 404

    return render_template("books/details.html", book=book)


@app.route("/books/create", methods=["GET", "POST"])
def book_create():
    if request.method == "POST":
        title = request.form["title"]
        author = request.form["author"]
        published_year = request.form["published_year"]
        genre = request.form["genre"]

        conn = get_db_connection()
        conn.execute(
            "INSERT INTO books (title, author, published_year, genre) VALUES (?, ?, ?, ?)",
            (title, author, published_year, genre),
        )
        conn.commit()
        conn.close()

        return redirect("/books")

    return render_template("books/create.html")


@app.route("/books/<int:book_id>/edit", methods=["GET", "POST"])
def book_edit(book_id):
    conn = get_db_connection()
    book = conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()

    if book is None:
        conn.close()
        return "Book not found", 404

    if request.method == "POST":
        title = request.form["title"]
        author = request.form["author"]
        published_year = request.form["published_year"]
        genre = request.form["genre"]

        conn.execute(
            "UPDATE books SET title = ?, author = ?, published_year = ?, genre = ? WHERE id = ?",
            (title, author, published_year, genre, book_id),
        )
        conn.commit()
        conn.close()

        return redirect("/books")

    conn.close()
    return render_template("books/edit.html", book=book)


@app.route("/books/<int:book_id>/delete", methods=["POST"])
def book_delete(book_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM books WHERE id = ?", (book_id,))
    conn.commit()
    conn.close()

    return redirect("/books")


if __name__ == "__main__":
    init_db()
    app.run(port=57707, debug=True)
