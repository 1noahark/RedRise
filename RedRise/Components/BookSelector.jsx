import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import BookSearchPopup from "./BookSearchPopup";

function BookSelector({ selectedBook, setSelectedBook }) {

    const [showPopup, setShowPopup] = useState(false);

    const handleSelectBook = (book) => {
        setSelectedBook(book);
    };

    return (
        <>
            <button
                className="bookselector"
                onClick={() => setShowPopup(true)}
            >
                <p>
                    {selectedBook
                        ? `${selectedBook.title} - ${selectedBook.author_name?.join(", ")}`
                        : "Select a book"
                    }
                </p>

                <FaPlus className="plusicon" />
            </button>

            {showPopup && (
                <BookSearchPopup
                    onSelect={handleSelectBook}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
}

export default BookSelector;
