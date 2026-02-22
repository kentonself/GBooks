import { useState, useEffect } from "react"
import ReactPaginate from 'react-paginate';

export default function BookList(books) {

    function handlePageClick() {
        console.log("click")
    }
    const [currentPage, setCurrentPage] = useState(0)
    const itemsPerPage = 10
    console.log(books)
    books = books.books
    if (books == null || books.items == undefined) {
        console.log("null books")
        return (
            <>
                Enter a search term above to see books
            </>
        )
    }

    if (books.items.length == 0) {
        return (
            <h1> No books found</h1>
        )
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
        <div className="BookList">
            <h3>Total number of books found: {books.items.length}</h3>
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
        </div>
    )
}