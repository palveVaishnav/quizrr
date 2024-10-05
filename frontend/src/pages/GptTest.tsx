import React, { useEffect, useState } from 'react';

interface Question {
    id: string;
    question: string;
    options: string[]; // Change this type to string array
    viewed: boolean;
    review: boolean;
    answer: number;
    sectionsId: string;
}

interface Section {
    id: string;
    title: string;
    maxMarks: number;
    testId: string;
    questions: Question[];
}

interface Test {
    id: string;
    name: string;
    time: number;
    locked: boolean;
    date: string;
    nquestions: number;
    marks: number;
    sections: Section[];
}

export const TestComponent: React.FC<{ id: string }> = ({ id }) => {
    const [test, setTest] = useState<Test | null>(null); // State to hold the test data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Fetch test data and store it in state
    useEffect(() => {
        async function fetchTest() {
            try {
                const backendUrl = `http://127.0.0.1:8080/api/test/${id}`;
                console.log("Fetching data from:", backendUrl);

                const response = await fetch(backendUrl);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const jsonData: Test = await response.json();
                console.log("Response JSON:", jsonData);

                // Parse `options` field in each question
                const parsedData = {
                    ...jsonData,
                    sections: jsonData.sections.map((section) => ({
                        ...section,
                        questions: section.questions.map((question) => ({
                            ...question,
                            options: JSON.parse(question.options), // Parse options field
                        })),
                    })),
                };

                setTest(parsedData); // Store the parsed test data
            } catch (err: any) {
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
    }, [id]);

    // Function to handle question updates
    const handleUpdateQuestion = (
        sectionId: string,
        questionId: string,
        updatedQuestion: Partial<Question>
    ) => {
        if (!test) return;

        // Find and update the question within the sections
        const updatedSections = test.sections.map((section) => {
            if (section.id !== sectionId) return section;

            return {
                ...section,
                questions: section.questions.map((question) =>
                    question.id === questionId
                        ? { ...question, ...updatedQuestion }
                        : question
                ),
            };
        });

        setTest({ ...test, sections: updatedSections }); // Update the state
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (!test) {
            console.error("No test data to submit");
            return;
        }

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

            console.log(response)

            // if (!response.ok) {
            //     throw new Error(`Failed to submit test: ${response.statusText}`);
            // }

            console.log("Test submitted successfully!");
            alert("Test submitted successfully!");
        } catch (error) {
            console.error("Error submitting test:", error);
            alert("Error submitting test: " + error.message);
        }
    };

    // Render loading, error, or test data
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>{test?.name}</h1>
            {test?.sections.map((section) => (
                <div key={section.id}>
                    <h2>{section.title}</h2>
                    {section.questions.map((question) => (
                        <div key={question.id} style={{ marginBottom: '1em' }}>
                            <p><strong>Q: {question.question}</strong></p>
                            {question.options.map((option, index) => (
                                <div key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            checked={question.answer === index}
                                            onChange={() =>
                                                handleUpdateQuestion(section.id, question.id, {
                                                    answer: index,
                                                })
                                            }
                                        />
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            {/* Submit button to send the updated test back to the server */}
            <button onClick={handleSubmit} style={{ marginTop: '1em' }}>
                Submit Test
            </button>
        </div>
    );
};

export default TestComponent;
