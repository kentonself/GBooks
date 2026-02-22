import { useState, useEffect } from "react"
import ReactPaginate from 'react-paginate';
import { b } from "./bookdata"

// Some globals
// TODO: Take our of global scope
let books = { "init": [] }
let pageStatus = "init"
let pageNum = 0
let elapsed = 0

export default function BookList({ queryParam, handlePageStatus }) {

    //const [currentPage, setCurrentPage] = useState(0)
    //const [books, setBooks] = useState({"items": []})
    console.log(queryParam)
    if (queryParam == "") {
        return (<>Enter query to Search Google Books</>)
    }

    const itemsPerPage = 10

    function handleStateChange(s) {
        handlePageStatus(s)
    }
    function gotoPage(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        console.log(formData.entries())
        let page = formData.get("gotoPage")
        console.log("Going to " + page)
        pageNum = page - 1
        fetchBooks()
        handleStateChange("goto " + pageNum)
        console.log("goto")
    }
    function pgUp(event) {
        event.preventDefault()
        if (pageNum > 0) {
            pageNum -= 1
            fetchBooks()
            handleStateChange("up" + pageNum)
            console.log("up")
        }
    }
    function pgDown() {
        event.preventDefault()
        pageNum += 1
        handleStateChange("down" + pageNum)
        fetchBooks()
        console.log("Down")
    }


    async function fetchBooks() {
        let api_key = import.meta.env.VITE_BOOKS_API_KEY;
        let startTime = performance.now()
        let response = null


/*
        // Uncomment to stub out API call
        books = b
        pageStatus = "fetched"
        handleStateChange("fetched")
        return

        */


        try {
            response = await fetch("https://www.googleapis.com/books/v1/volumes?q=" +
                queryParam + "&key=" + api_key + "&startIndex=" + pageNum * itemsPerPage)
            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.status);
            }
            /*
            } catch (error) {
                console.error("fecth error ", error)
            }
            try {
            */
            let resp = await response.json()
            elapsed = performance.now() - startTime
            books = resp
            if (pageStatus != "fetched") {
                pageStatus = "fetched"
            }
            handleStateChange("fetched")
            return
        } catch (error) {
            console.error("fecth error ", error)
        }
    }

    fetchBooks()
    if (pageStatus != "fetched") {
        return (<>Enter a search term above to see books</>)
    }
    console.log(books)
    if (queryParam == "" ||
        books.items.length == 0) {
        return (<> Enter a search term above to see books </>)
    }

    // Get most found author
    let author_list = []
    for (const b of books.items) {
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
    return (
        <>
            <div className="BookList">
                <h3>Total number of books found: {books.totalItems} (This is page {pageNum + 1} of {books.totalItems / itemsPerPage})</h3>
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
            </div>
            <p className="Footer">
                The last search took  {elapsed.toFixed(2)} milliseconds<br></br>
                Thank you for using the Google Books Search App
            </p>
        </>
    )
}