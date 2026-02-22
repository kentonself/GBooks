
export default function SearchForm({handleSearch, handleElapsed}) {
   function handleSubmit(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        console.log(formData.entries())
        let searchTerm = formData.get("searchTerm")
        searchTerm = encodeURIComponent(searchTerm)
        console.log("Search Term = " + searchTerm)
        let api_key=import.meta.env.VITE_BOOKS_API_KEY;
        let startTime = performance.now()
        fetch("https://www.googleapis.com/books/v1/volumes?q=" +
            searchTerm + "&key="+ api_key)
            .then(response => {
                // Check if the request was successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json()
            })
            .then(data => {
                console.log(data)
                handleSearch(data)
            })
            .catch(error => {
                console.error("fecth error ", error)
            })
            let endTime = performance.now()
            console.log(endTime-startTime)
            handleElapsed(endTime - startTime)
    }
    
    return (
        <>
        <div className="SearchForm">
             <label htmlFor="searchTerm">Search Term: </label>
            <form action="submit" onSubmit={handleSubmit} >
                <input
                    type="text"
                    name="searchTerm"
                    id="searchTerm"
                    className="SearchInput"
                    placeholder="Ernest Hemmingway"
                    aria-label="Google Books search term" />
                <button type="submit" className="SearchButton">Submit</button>
            </form>
        </div>
        </>
    )
}