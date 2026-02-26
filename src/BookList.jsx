import { useState, useEffect } from "react"
import { b } from "./bookdata" // for stub data in lieu of API call


let pageStatus = "init"
let books = { "totalItems": 10000, "items": [] }
let lastResp = {}
let lastPageNum = -1
let lastQuery = ""
let pageNum = 1
let message = ""
let elapsed = 0

export default function BookList({ queryParam }) {
    let itemsPerPage = 10
    let maxItemsPerCall = 20 // This is determined by the API. Google advertises this as 40 but it looks like it only does 20 at a time.
    let resp = {}
    let [state, setState] = useState(1)

    function setPageNum(p) { pageNum = p }

    async function gotoPage(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        console.log(formData.entries())
        let page = formData.get("gotoPage")
        if (page < 1) {
            message = "Cannot have page number < 1"
        } else {
            setPageNum(page)
            pageStatus = "init"
            console.log(`Going to ${pageNum}`)
            try {
                if (message != "") {
                    message = ""
                }
                await fetchBooks()
            } catch (error) {
                message = `Error getting books ${error}`
            }
            setState(state + 1)
        }
    }
    async function pgUp(event) {
        event.preventDefault()
        if (pageNum > 1) {
            setPageNum(pageNum - 1)
            pageStatus = "init"
            try {
                if (message != "") {
                    message = ""
                }
                await fetchBooks()
            } catch (error) {
                message = `Error getting books ${error}`
            }
            console.log(`Up ${pageNum}`)
            setState(state + 1)
        } else {
            message = "Already at first page"
            setState(state + 1)
        }
    }
    async function pgDown(event) {
        event.preventDefault()
        pageNum = Number(pageNum) + 1  //convert string to number before adding.
        pageStatus = "init"
        try {
            if (message != "") {
                message = ""
            }
            await fetchBooks()
        } catch (error) {
            message = `Error getting book list ${message}`
        }
        console.log(`Down ${pageNum}`)
        setState(state + 1)
    }

    async function fetchBooks() {
        let api_key = import.meta.env.VITE_BOOKS_API_KEY;
        let startTime = performance.now()
        let response = null
        let callAPI = true // toggle for testing with/without API

        if (pageStatus == "rendered") {
            return
        }
        try {
            // determine if the new result will be found in the last API call
            let pagesPerCall = (maxItemsPerCall / itemsPerPage) | 0
            if (!callAPI) {
                // Stub API call for testing
                console.log("stubbing API")
                resp = b
                lastResp = resp
            } else if (lastResp == {} ||
                ((((pageNum - 1) / pagesPerCall) | 0) != (((lastPageNum - 1) / pagesPerCall) | 0))) {
                // set is not found in last call. Redo API
                console.log("Calling API")
                response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${queryParam}` +
                    `&key=${api_key}&startIndex=${(pageNum - 1) * itemsPerPage}&maxResults=${maxItemsPerCall}`)
                // Check if the request was successful
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }
                resp = await response.json()
                lastResp = resp
            } else {
                // Set is in last API. Do not redo it.
                console.log("Not redoing API")
                resp = lastResp
            }
            pageStatus = "fetched"
            elapsed = performance.now() - startTime


            // Get slice to display
            let startIndex = ((pageNum - 1) % pagesPerCall) * itemsPerPage
            books.items = resp.items.slice(startIndex, startIndex + itemsPerPage)
            books.totalItems = resp.totalItems
            if (pageStatus == "fetched") {
                setState(state + 1)
                pageStatus = "rendered"
            }
            return
        } catch (error) {
            message = ` Error getting book list ${error}`
            console.error(`fecth error ${error}`)
            lastResp = {}
        }
    }

    if (lastQuery != queryParam) {
        // New search
        pageNum = 1
        lastPageNum = -1
        lastResp = {}
        books = { "totalItems": 10000, "items": [] }
        pageStatus = "init"
        lastQuery = queryParam
        message = ""
    }

    console.log(queryParam)
    if (queryParam == "") {
        return (<>Enter query to Search Google Books</>)
    }

    if (!import.meta.env.VITE_BOOKS_API_KEY) {
        return <div className="FooterMessage">
            REQUIRED: Set VITE_BOOKS_API_KEY in .env<br />
        </div>
    }

    if (pageStatus == "init") {
        try {
            fetchBooks()
        } catch (error) {
            return <>
                Error getting Book List: ${error}
            </>
        }
    }

    if (pageStatus == "init" || queryParam == "") {
        if (message.length) {
            return <>
            <div className="FooterMessage">${message}</div>
            Enter a search term above to see books
            </>
        }
        return (<>Enter a search term above to see books</>)
    }
    if (books.items.length == 0) {
        return (<>No books found. Enter a search term above to see books </>)
    }
    console.log(books)

    // Get most found author
    let author_list = []
    for (const b of books.items) {
        // Some API calls do not return an array of authors
        if (b.volumeInfo.authors === undefined) {
            b.volumeInfo.authors = ["(No authors listed)"]
        }
        for (const a of b.volumeInfo.authors) {
            let found = author_list.find(author => author.name === a)
            if (found == undefined) {
                author_list.push({ "name": a, "count": 1 })
            } else {
                found.count += 1
            }
        }
    }
    const topAuthor = author_list.reduce((prev, current) => {
        return (prev.count > current.count) ? prev : current;
    });
    const earliest = books.items.reduce((prev, current) => {
        return (prev.volumeInfo.publishedDate < current.volumeInfo.publishedDate) ? prev : current;
    })
    const latest = books.items.reduce((prev, current) => {
        return (prev.volumeInfo.publishedDate > current.volumeInfo.publishedDate) ? prev : current;
    })

    let pageCount = Math.ceil(books.items.length / itemsPerPage)

    const detailsElements = document.querySelectorAll('details');

    detailsElements.forEach(details => {
        details.removeAttribute('open');
    });
    lastPageNum = pageNum
    return (
        <>
            <div className="BookList">
                <h3>Total number of books found: {books.totalItems} (This is page {pageNum} of {books.totalItems / itemsPerPage})</h3>
                <h3>Author appearing most {topAuthor.name} with {topAuthor.count} author credits</h3>
                <h3>Earliest Publication Date {earliest.volumeInfo.publishedDate} (for "{earliest.volumeInfo.title}")</h3>
                <h3>Latest Publication Date {latest.volumeInfo.publishedDate} (for "{latest.volumeInfo.title}")</h3>
                <ul>
                    {books.items.map((item, index) => (
                        <li className="BookItem"
                            key={index}>
                            <details>
                                <summary>
                                    {item.volumeInfo.authors.join(", ") + " - "}
                                    <i>{item.volumeInfo.title}</i>
                                </summary>
                                <p>{item.volumeInfo.description != undefined ?
                                    item.volumeInfo.description :
                                    "(No description is available for this title)"}</p>
                            </details>
                        </li>
                    ))}
                </ul>
                {/*
            <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5} // Number of page links to display
                pageCount={pageCount} // Total number of pages
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName={"pagination"} // Custom class for styling
                activeClassName={"active"} // Custom class for the active page
            />
            */}
            </div>
            <div className="pager">
                <button type="button" className="pagerButton" onClick={pgUp}>Prev</button>
                <button type="button" className="pagerButton" onClick={pgDown}>Next</button>
                <form action="submit" className="pagerForm" onSubmit={gotoPage} >
                    <label className="pagerLabel">Skip to page</label>
                    <input
                        type="number"
                        name="gotoPage"
                        id="gotoPage"
                        className="gotoInput"
                        placeholder="5"
                        aria-label="Page number to skip to" />
                    <button type="submit" className="gotoButton">Submit</button>
                </form>
            </div>
            <div className="Footer">
                <div className="FooterMessage" >
                    {message} <br />
                </div>
                The last search took  {elapsed.toFixed(2)} milliseconds<br />
                Thank you for using the Google Books Search App
            </div>
        </>
    )
}