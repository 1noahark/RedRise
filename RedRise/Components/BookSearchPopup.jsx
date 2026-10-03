import { useState } from "react";
import { IoClose } from "react-icons/io5";

function BookSearchPopup({ onSelect, onClose }) {

    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchBooks = async () => {
        if (!search.trim()) return;

        setLoading(true);

        try {
            const response = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(search)}&fields=key,title,author_name,editions`
            );

            const data = await response.json();

            setBooks(data.docs || []);

        } catch (error) {
            console.error("Error searching books:", error);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            searchBooks();
        }
    };

    const handleSelect = (book) => {
        console.log("SELECTED BOOK:", book);

        onSelect(book);
        onClose();
    };


    return (
        <div className="popup-overlay">

            <div className="bookpopup">

                <button
                    className="closebutton"
                    onClick={onClose}
                >
                    <IoClose />
                </button>

                <h2>Search for a book</h2>

                <div className="booksearch">

                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button onClick={searchBooks}>
                        Search
                    </button>

                </div>

                <div className="bookresults">

                    {loading && (
                        <p>Searching...</p>
                    )}

                    {!loading && books.length === 0 && (
                        <p>Search for a book to get started.</p>
                    )}

                    {books.map((book) => (

                        <button
                            className="bookresult"
                            key={book.key}
                            onClick={() => handleSelect(book)}
                        >

                            <p className="booktitle">
                                {book.title}
                            </p>

                            <p className="bookauthor">
                                {book.author_name
                                    ? book.author_name.join(", ")
                                    : "Unknown author"}
                            </p>

                        </button>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default BookSearchPopup;
