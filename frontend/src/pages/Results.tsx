import React, { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import AttemptsTable from "@/components/Attempts";

export default function ResultBoard() {
    return (
        <Dashboard>
            <Results />
        </Dashboard>
    )
}

function Results() {
    return (
        <div>
            <AttemptsPage />
        </div>
    )
}

const AttemptsPage: React.FC = () => {
    const [attemptsData, setAttemptsData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const id = 'google-oauth2|103138456760974844166';
        const url = `http://127.0.0.1:8080/api/attempts/${id}`;

        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log(result, response)
                setAttemptsData(result);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    console.log(attemptsData)

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Attempt Details</h1>
            {attemptsData.length > 0 ? (
                <AttemptsTable data={attemptsData} />
            ) : (
                <p>No attempts found for this user.</p>
            )}
        </div>
    );
};
