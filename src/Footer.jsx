export default function Footer (elapsed) {
    console.log(elapsed)
    if (elapsed == null || elapsed.elapsed== 0) {
        return(<p className="Footer">Thank you for using the Google Books Search App</p>)
    }
    return (
        <p className="Footer">
        The last search took  {elapsed.elapsed} milliseconds<br></br>
        Thank you for using the Google Books Search App
        </p>
    )
}