import { createRoot } from 'react-dom/client'
import SearchForm from "./SearchForm"
import BookList from "./BookList"
import Title from "./Title"
import Footer from "./Footer"
import { useState } from 'react'

export default function GBooks() {
    let [books, setBooks] = useState("books")
    let [elapsed, setElapsed] = useState(0)

    const handleSearch = (books) => {
        console.log(books)
        setBooks(books);
    };
    const handleElapsed = (elapsed) => {
        console.log(elapsed)
        setElapsed(elapsed)
    }
    return (
        <>
            <Title />
            <SearchForm handleSearch={handleSearch} handleElapsed={handleElapsed} />
            <BookList books={books} />
            <Footer elapsed={elapsed} />
        </>
    )
}