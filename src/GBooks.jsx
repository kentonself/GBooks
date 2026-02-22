import { createRoot } from 'react-dom/client'
import SearchForm from "./SearchForm"
import BookList from "./BookList"
import Title from "./Title"
import { useState } from 'react'

export default function GBooks() {
    let [books, setBooks] = useState("books")

    const handleSearch = (books) => {
        console.log(books)
        setBooks(books);
    };
    return (
        <>
            <Title />
            <SearchForm handleSearch={handleSearch} />
            <BookList books={books}  />
        </>
    )
}