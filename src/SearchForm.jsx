
export default function SearchForm({handleQueryParam, handlePageStatus}) {
   function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        console.log(formData.entries())
        let searchTerm = formData.get("queryParam")
        searchTerm = encodeURIComponent(searchTerm)
        console.log("Search Term = " + searchTerm)
        handleQueryParam(searchTerm)
        handlePageStatus("ïnit")
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
        </>
    )
}