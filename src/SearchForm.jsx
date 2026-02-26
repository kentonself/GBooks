import { useState } from "react"
import BookList from "./BookList"

export default function SearchForm() {
    let [queryParam, setQueryParam] = useState("")

    function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        console.log(formData.entries())
        console.log(`Query: ${queryParam}`)
        setQueryParam(encodeURIComponent(formData.get("queryParam")))
    }


    return (
        <>
            <div className="SearchForm">
                <label htmlFor="searchTerm">Search Term: </label>
                <form action="submit" onSubmit={handleSubmit} >
                    <input
                        type="text"
                        name="queryParam"
                        id="queryParam"
                        className="SearchInput"
                        placeholder="Ernest Hemmingway"
                        aria-label="Google Books search term" />
                    <button type="submit" className="SearchButton">Submit</button>
                </form>
            </div>
            <BookList queryParam={queryParam} />
            </>
    )
}