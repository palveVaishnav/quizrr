import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Test } from '@/types';
import { Clock } from 'lucide-react';

export default function DashboardHome() {
    // State to store the test series data
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch data when the component mounts
    useEffect(() => {
        async function fetchTestSeries() {
            try {
                // const backendUrl = `${import.meta.env.BASE_URL}/api/tests`;
                const backendUrl = "http://127.0.0.1:8080/api/tests"
                console.log("Fetching data from:", backendUrl);

                const response = await fetch(backendUrl);
                console.log("Raw response:", response);

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.text(); // Get raw text to inspect
                console.log("Response Text:", data);

                // Check if it's JSON before setting state
                const jsonData = JSON.parse(data); // Try to parse JSON
                setTests(jsonData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTestSeries();
    }, []);


    // Show loading message while data is being fetched
    if (loading) return <div>Loading...</div>;

    // Show error message if there's an error
    if (error) return <div>Error: {error}</div>;


    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-col text-left">
                <h1 className="text-lg font-semibold md:text-xl">Good Morning, Vaishnav!</h1>
                <p>Welcome back! All the best because #PaperPhodnaHai</p>
            </div>
            <h1 className="text-lg font-semibold md:text-2xl">Your Test Series</h1>
            <div className="flex flex-1 flex-col items-center rounded-lg shadow-sm gap-2"
                x-chunk="dashboard-02-chunk-1">
                {/* Render tests dynamically */}
                {tests.length > 0 ? (
                    tests.map((test, index) => (
                        <div key={index} className="p-4 border border-gray-300 w-full rounded-xl flex justify-between">
                            <div>
                                <h2 className="text-md font-semibold">{test.name}</h2>
                                <div>
                                    {/* Ensure sections are present before mapping */}
                                    {test.sections && test.sections.length > 0 ? (
                                        test.sections.map((section) => (
                                            <div key={section.id} className='flex gap-2'>
                                                <h3>{section.title}</h3>
                                                <p>Marks: {section.maxMarks}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No sections available</p>
                                    )}
                                </div>
                                <div className='flex gap-2'>
                                    <p className='flex'>
                                        {test.nquestions} questions
                                    </p>
                                    <p className='flex'>
                                        <Clock /> {test.time} minutes
                                    </p>
                                    <p> Marks: {test.marks}</p>
                                    <p>Date: {new Date(test.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <Link to={`/test/?id=${test.id}`} className='flex items-center'>
                                <Button>Attempt Now</Button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div>No tests available</div>
                )}
            </div>
        </main>
    );
}
