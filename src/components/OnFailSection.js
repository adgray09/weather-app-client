export default function OnFailSection({ zip, message }) {

    return <>
        <h1>{`Error fetching weather data for ${zip}`}</h1>
        <p>{message}</p>
    </>
}
