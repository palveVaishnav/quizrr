import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Info } from 'lucide-react';

interface Question {
    id: string
    question: string
    options: string[]
    viewed: boolean
    review: boolean
    answer: number
    sectionsId: string
    status: 'answered' | 'not answered' | 'not'
}

interface Section {
    id: string
    title: string
    maxMarks: number
    testId: string
    questions: Question[]
}

interface Test {
    id: string
    name: string
    time: number
    locked: boolean
    date: string
    nquestions: number
    marks: number
    sections: Section[]
}

enum Qstatus {
    notVisited,
    answered,
    notAnswered,
    marked,
    markedAnswered
}

export const ResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { test } = location.state || {}; // Step 2: Extract `test` object from location state
    const [submitting, setSubmitting] = useState(false);


    if (!test) {
        return <p>No test data available</p>;
    }
    const handleSubmit = async () => {
        if (!test) {
            console.error("No test data to submit");
            return;
        }

        setSubmitting(true); // Set submitting state to true
        try {
            const submitUrl = `http://127.0.0.1:8080/api/attempt`;
            console.log("Submitting updated test to:", submitUrl);

            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...test,
                    sections: test.sections.map((section) => ({
                        ...section,
                        questions: section.questions.map((question) => ({
                            ...question,
                            options: JSON.stringify(question.options), // Re-stringify options before sending
                        })),
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit test: ${response.statusText}`);
            }

            console.log("Test submitted successfully!");
            navigate('/submitsucess');
        } catch (error) {
            console.error("Error submitting test:", error);
            alert("Error submitting test: " + error.message);
        } finally {
            setSubmitting(false); // Reset submitting state
        }
    };

    return (
        <div className="w-full min-h-screen">
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
                        {test.time}
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
            <div className='p-4 mt-5'>
                <Table className='border border-black px-4 py-2'>
                    <TableHeader>
                        <TableRow className="">
                            <TableHead className="text-black font-semibold border border-black px-4 py-2">Section Name</TableHead>
                            <TableHead className="text-black font-semibold border border-black px-4 py-2">No OF QUESTION</TableHead>
                            <TableHead className="text-black font-semibold border border-black px-4 py-2">Answered</TableHead>
                            <TableHead className="text-black font-semibold border border-black px-4 py-2">Not Answered</TableHead>
                            <TableHead className="text-black font-semibold border border-black px-4 py-2">MARKED FOR REVIEW</TableHead>
                            <TableHead className="text-black font-semibold border border-black px-4 py-2">ANSWERED AND MARKED FOR REVIEW</TableHead>
                            <TableHead className="text-black font-semibold border border-black px-4 py-2">NOT VISITED</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {test.sections.map((section, index) => {
                            // Calculate counts based on the question statuses
                            const answeredCount = section.questions.filter(q => q.status === Qstatus.answered).length;
                            const notAnsweredCount = section.questions.filter(q => q.status === Qstatus.notAnswered).length;
                            const markedCount = section.questions.filter(q => q.status === Qstatus.marked).length;
                            const markedAnsweredCount = section.questions.filter(q => q.status === Qstatus.markedAnswered).length;
                            const notVisitedCount = section.questions.filter(q => q.status === Qstatus.notVisited).length;

                            return (
                                <TableRow key={section.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <TableCell className='border border-black px-4 py-2'>{section.title}</TableCell>
                                    <TableCell className='border border-black px-4 py-2'>{section.questions.length}</TableCell>
                                    <TableCell className='border border-black px-4 py-2'>{answeredCount}</TableCell>
                                    <TableCell className='border border-black px-4 py-2'>{notAnsweredCount}</TableCell>
                                    <TableCell className='border border-black px-4 py-2'>{markedCount}</TableCell>
                                    <TableCell className='border border-black px-4 py-2'>{markedAnsweredCount}</TableCell>
                                    <TableCell className='border border-black px-4 py-2'>{notVisitedCount}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            <div className="p-4 grid place-content-center grid-cols-2 text-center gap-2 mt-20">
                <p className='col-span-2'>
                    Are you sure about submitting this group of questions for marking
                </p>
                <Button className=" bg-gray-500 text-white w-fit place-self-end py-6"
                    onClick={() => navigate(-1)}
                >
                    No Go Back To Paper
                </Button>
                <Button className="bg-red-500 text-white hover:bg-red-600 w-fit place-self-start py-6"
                    onClick={handleSubmit}
                >
                    Yes ! Submit the test.
                </Button>
            </div>
        </div>
    );
};

export default ResultPage;
