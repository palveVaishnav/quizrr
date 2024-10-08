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
    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                const id = 'google-oauth2|103138456760974844166';
                const response = await fetch(`http://127.0.0.1:8080/api/attempts/${id}`);

                if (!response.ok) {
                    console.log('fetching error ')
                    throw new Error;
                }

                const data = await response.json();
                console.log(data);
                setAttemptsData(data);
            } catch (error) {
                console.error("Error fetching attempts:", error);
            }
        };
        fetchAttempts();
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
