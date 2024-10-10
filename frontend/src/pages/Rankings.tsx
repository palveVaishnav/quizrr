import { Dashboard } from "@/components/Dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function RankingPage() {
    return (
        <Dashboard>
            <Rankings />
        </Dashboard>
    )
}

function Rankings() {
    const { user } = useAuth0();
    const [allAttempts, setAllAttempts] = useState([])
    useEffect(() => {
        async function getAllAttempts() {
            try {
                const response = await fetch('http://127.0.0.1:8080/api/attempts',)
                if (!response) {
                    console.log('not fetched')
                }
                setAllAttempts(await response.json())
            } catch {
                console.log("Some issue while sending request")
            }
        }
        getAllAttempts()
    }, [])
    console.log(allAttempts)
    console.log(user?.sub)

    return (
        <div>
            Here :
            <h1>Attempt Rankings</h1>
            {/* Display a message if there are no attempts */}
            {allAttempts.length === 0 ? (
                <p>No allAttempts found.</p>
            ) : (
                <ul>
                    {/* Map through allAttempts and display each one */}
                    {allAttempts.map((attempt, index) => (
                        <li key={index} className={`border p-2 ${attempt.authId === user?.sub ? 'bg-green-500' : 'bg-gray-500'}`}>
                            <p>Attempt ID:</p> {attempt.id}
                            <p>Test ID:</p> {attempt.testId}
                            <p>User ID:</p> {attempt.authId}
                            <p>Marks:</p> {attempt.marks}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}