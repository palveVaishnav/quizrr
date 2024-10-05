import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, LockIcon, Target } from "lucide-react"
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

export default function TestOverview() {
    // State to store the test data
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch data when the component mounts
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        async function fetchTest() {
            try {
                const backendUrl = `http://127.0.0.1:8080/api/test/${id}`;
                console.log("Fetching data from:", backendUrl);

                const response = await fetch(backendUrl);
                console.log("Raw response:", response);

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const jsonData = await response.json(); // Use response.json() instead of text()
                console.log("Response JSON:", jsonData);
                setTest(jsonData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchTest();
        } else {
            setError("No test ID provided");
            setLoading(false);
        }
    }, [id]); // Dependency array includes id

    // Show loading message while data is being fetched
    if (loading) return <div>Loading...</div>;

    // Show error message if there's an error
    if (error) return <div>Error: {error}</div>;

    // Show test details
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-col text-left">
                <h1 className="text-lg font-semibold md:text-xl">Test Overview</h1>
                {test && (
                    <Card className="w-full border-red-200">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                {test.name}
                            </CardTitle>
                            <p className="text-sm  flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(test.date).toLocaleDateString()}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 " />
                                    <div>
                                        <p className="text-sm ">QUESTIONS</p>
                                        <p className="font-bold">{test.nquestions}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 " />
                                    <div>
                                        <p className="text-sm ">TIME</p>
                                        <p className="font-bold">{test.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 " />
                                    <div>
                                        <p className="text-sm ">MARKS</p>
                                        <p className="font-bold">{test.marks}</p>
                                    </div>
                                </div>
                            </div>
                            <Link to={`/startTest/?id=${test.id}`} className="border bg-red-400">
                                <Button className="w-full sm:w-auto" >
                                    {/* <LockIcon className="w-4 h-4 mr-2" /> */}
                                    Start Test
                                </Button>
                            </Link>
                        </CardContent>
                        <CardFooter>
                            <p className="text-sm text-gray-400">You need to join the pack to access this test.</p>
                        </CardFooter>
                    </Card>
                )}
            </div>
            <Instructions />
        </main>
    );
}

export function Instructions() {
    return (
        <Card className="w-full mx-auto p-4">
            <CardHeader>
                <CardTitle>Important Instructions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="">
                    <p className="text-sm text-muted-foreground mb-4">
                        Please read the following test related instructions:
                    </p>
                    <ul className="space-y-2 mb-4">
                        <li>The total duration of this test is 180 minutes.</li>
                        <li>The test is of 300 marks.</li>
                        <li>There will be 90 questions in the test.</li>
                        <li>There are 3 subject(s) in the test: Physics, Chemistry, and Mathematics</li>
                        <li>The paper is divided into 6 sections.</li>
                    </ul>
                    <p className="font-semibold mb-2">There are following sections:</p>
                    <ul className="space-y-4">
                        <li>
                            <strong>Physics Single Correct</strong> consisting of 20 single correct questions. For each correct response, you will get +4 mark while an incorrect response will get you -1 mark. 0 will be awarded for no response.
                        </li>
                        <li>
                            <strong>Physics Numerical</strong> consisting of 10 numerical type questions. For each correct response, you will get +4 mark while an incorrect response will get you -1 mark. 0 will be awarded for no response.
                        </li>
                        <li>
                            <strong>Chemistry Single Correct</strong> consisting of 20 single correct questions. For each correct response, you will get +4 mark while an incorrect response will get you -1 mark. 0 will be awarded for no response.
                        </li>
                        <li>
                            <strong>Chemistry Numerical</strong> consisting of 10 numerical type questions. For each correct response, you will get +4 mark while an incorrect response will get you -1 mark. 0 will be awarded for no response.
                        </li>
                        <li>
                            <strong>Mathematics Single Correct</strong> consisting of 20 single correct questions. For each correct response, you will get +4 mark while an incorrect response will get you -1 mark. 0 will be awarded for no response.
                        </li>
                        <li>
                            <strong>Mathematics Numerical</strong> consisting of 10 numerical type questions. For each correct response, you will get +4 mark while an incorrect response will get you -1 mark. 0 will be awarded for no response.
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}