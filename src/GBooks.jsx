import { createRoot } from 'react-dom/client'
import SearchForm from "./SearchForm"
import BookList from "./BookList"
import Title from "./Title"
import Footer from "./Footer"
import { useState } from 'react'

export default function GBooks() {
    let [elapsed, setElapsed] = useState(0)
    let [queryParam, setQueryParam] = useState("")
    let [pageStatus, setPageStatus] = useState("init")

    const handleElapsed = (elapsed) => {
        console.log(elapsed)
        setElapsed(elapsed)
    }
    const handleQueryParam = (queryParam) => {
        console.log(queryParam)
        setQueryParam(queryParam)
    }
    const handlePageStatus = (status) => {
        console.log("PageStatus; " + status)
        setPageStatus(status)
    }
    return (
        <>
            <Title />
            <SearchForm handleQueryParam={handleQueryParam} handlePageStatus={handlePageStatus} />
            <BookList queryParam={queryParam} handlePageStatus={handlePageStatus}  />
            <Footer elapsed={elapsed} />
        </>
    )
}