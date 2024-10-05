"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, Info, ChevronRight, Check } from 'lucide-react';
import { Question, Section, Test } from '@/types';

export default function TestOverview() {
    // State to store the test data
    const [test, setTest] = useState<Test | null>(null); // Use the `Test` type for `test` state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Error state should be of type `string | null`

    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');

    // State variables for test parameters
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);

    // types 
    const [activeSection, setActiveSection] = useState<Section | null>(null);
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
    const [timeLeft, setTimeLeft] = useState("179:56");

    const answers = ["9.8 N", "4.9 N", "19.6 N", "8 N"];

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

                const jsonData: Test = await response.json(); // Parse the response as a `Test` object
                console.log("Response JSON:", jsonData);
                setTest(jsonData);
            } catch (err: any) { // Handle error with a more specific type
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
    }, [id]); // Dependency array includes `id`

    // Show loading message while data is being fetched
    if (loading) return <div>Loading...</div>;

    // Show error message if there's an error
    if (error) return <div>Error: {error}</div>;


    // Show test details
    return (
        <div className="flex flex-col text-left h-screen p-0">
            {test && (
                <>
                    <header className="bg-blue-500 text-white p-2 text-lg font-bold">
                        {test.name}
                    </header>

                    {/* Navigation bar */}
                    <nav className="bg-[#404040] text-white flex items-center justify-between p-2">
                        <div className="flex items-center space-x-2">
                            <button className="flex items-center space-x-1 bg-[#000] px-2 py-1 rounded-xl">
                                <span>All Sections</span>
                                <Info size={16} className="bg-blue-400 rounded-full" />
                            </button>
                        </div>
                        <p>Time Left:
                            <span className='bg-black py-1 px-2 rounded-xl'>
                                {timeLeft}
                            </span>
                        </p>
                        <div className="flex items-center space-x-4">
                            <button className="px-2 py-1 rounded flex items-center space-x-1">
                                <Info size={16} className='bg-green-500 rounded-xl' />
                                <span>Question Paper</span>
                            </button>
                            <button className="px-2 py-1 rounded flex items-center space-x-1">
                                <Info size={16} className='bg-blue-400 rounded-xl' />
                                <span>Instructions</span>
                            </button>
                        </div>
                    </nav>

                    {/* Main content */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Left panel */}
                        <div className="flex-1 overflow-auto">
                            {/* Sections */}
                            <div className="flex border justify-stretch">
                                {test.sections && test.sections.length > 0 ? (
                                    test.sections.map((section, idx) => (
                                        <div key={section.id} className='flex justify-stretch'>
                                            <button className={`border px-4 py-2 flex gap-2 items-center ${idx === 0 && 'bg-blue-400'}`}>
                                                {section.title}
                                                <Info size={16} className="bg-blue-400 rounded-full text-white" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p>No sections available</p>
                                )}
                            </div>

                            <div className="bg-white">
                                <div className="flex justify-between items-center mb-4 px-6">
                                    <span className="text-gray-500 font-bold flex items-center">
                                        Question No.
                                        <p className='text-gray-400'>{'1. #66ff182010865b6ae8869a391'}</p>
                                    </span>
                                    <div className="flex space-x-2 text-red-500">
                                        <button className="flex items-center">
                                            <span>Section Details</span>
                                            <ChevronDown size={16} />
                                        </button>
                                        <button className="flex items-center text-purple-500">
                                            <span>Marking Scheme</span>
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className='p-4 text-center border-b'>
                                    <h2 className="text-xl font-semibold mb-2">Physics Single Correct (Maximum Marks: 80)</h2>
                                    <h3 className="text-lg mb-4">Only One Option Correct Type</h3>
                                    <p className="mb-4">This section contains 20 questions. 20 are multiple choice questions. Each question has multiple options out of which ONLY ONE is correct.</p>
                                </div>
                                <div className='p-4'>
                                    <p className="mb-4">
                                        The weight of a body at the surface of earth is 18 N. The weight of the body at an altitude of 3200 km above the earth's surface is (given, radius of earth Re = 6400 km)
                                    </p>
                                    <div className="space-y-2">
                                        {answers.map((answer, index) => (
                                            <label key={index} className="flex items-center space-x-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="answer"
                                                    value={index}
                                                    checked={selectedAnswer === index}
                                                    onChange={() => setSelectedAnswer(index)}
                                                    className="form-radio h-5 w-5 text-blue-600"
                                                />
                                                <span>{answer}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* Right panel */}
                        <div className="max-w-80 bg-gray-00 overflow-auto border">
                            <div className="mt-4 space-y-2 grid grid-cols-2 text-sm border-b border-black p-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-green-500 flex items-center justify-center"
                                        style={{
                                            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 100% 100%, 0 100%, 0% 50%)",
                                        }}
                                    >
                                        {0}
                                    </div>
                                    <span>Answered</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-red-500 flex items-center justify-center"
                                        style={{
                                            clipPath: "polygon(0 0, 100% 0, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                                        }}
                                    ></div>
                                    <span>Not Answered</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="rounded-xl border border-blue-600 h-8 w-8 flex items-center justify-center"
                                    >
                                        {0}
                                    </div>
                                    <span>Not Visited</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-10 h-10 bg-purple-500 rounded-full p-4 flex items-center justify-center"
                                    >
                                        {0}
                                    </div>
                                    <span>Marked for Review</span>
                                </div>
                                <div className="flex items-center space-x-2 col-span-2">
                                    <div className="w-10 h-10 bg-purple-500 rounded-full p-4 flex relative items-center justify-center">
                                        <Check size={28} strokeWidth={2.75} className='text-green-400 absolute mt-6' />
                                        {0}
                                    </div>
                                    <span className=''>Answered & Marked for Review (will be considered for evaluation)</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2 bg-blue-400 text-white p-2">
                                    {'PHYSICS SINGLE CORRECT'}
                                </h3>

                                <div className='p-2'>
                                    <p className="mb-2">Choose a question</p>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[...Array(20)].map((_, i) => (
                                            <button
                                                key={i}
                                                className={`w-10 h-10 rounded ${i + 1 === currentQuestion ? 'bg-red-500 text-white' : 'bg-white'
                                                    }`}
                                                onClick={() => setCurrentQuestion(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="p-2 flex justify-between border">
                        <div className='flex gap-2'>
                            <button className="border text-gray-800 px-10 py-2 ">Mark for Review & Next</button>
                            <button className="border text-gray-800 px-10 py-2 ">Clear Response</button>
                        </div>
                        <div className='flex gap-10 mr-20'>
                            <button className="bg-blue-500 text-white px-10 py-2">Save & Next</button>
                            <button className="bg-blue-400 px-10 py-2">Submit</button>
                        </div>
                    </footer>
                </>
            )
            }
        </div >
    );
}
