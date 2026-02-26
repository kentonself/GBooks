import { useState } from "react"
import { BookList } from "./BookList"
import { initBookList } from "./BookList"

let queryParam = ""
export default function SearchForm() {
    let [state, setState] = useState(0)

    function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        console.log(formData.entries())
        console.log(`Query: ${formData.get("queryParam")}`)
        if (queryParam === encodeURIComponent(formData.get("queryParam"))) {
            initBookList()
        }
        queryParam = encodeURIComponent(formData.get("queryParam"))
        setState(state + 1)
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