// src/types.ts

// Type for a single Question
export type Question = {
    id: string;
    question: string;
    options: string[]; // JSON array, which corresponds to a string array in TypeScript
    viewed: boolean;
    review: boolean;
    answer: number;
};

// Type for a single Section, which contains an array of Questions
export type Section = {
    id: string;
    title: string;
    maxMarks: number;
    questions: Question[]; // Array of Question objects
    testId?: string; // Optional field, since it's a reference field to Test
};

// Type for a single Test, which contains an array of Sections
export type Test = {
    id: string;
    name: string;
    time: number; // Time in minutes
    locked: boolean;
    date: string; // Use string for date since JSON will serialize it that way
    nquestions: number;
    marks: number;
    sections: Section[]; // Array of Section objects
};
