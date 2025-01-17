import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [message, setMessage] = useState("")

    useEffect(() => {
        fetch('http://localhost:3001/')
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP Error while fetching data")
                }
                return response.text()
            })
            .then((data) => {
                setMessage(data)
            })
            .catch(err => {
                setMessage(err.message)
            })
    }, [])

    return (
        <div>
            Message from server
            <h1>{message}</h1>
        </div>
    )
}

export default App
