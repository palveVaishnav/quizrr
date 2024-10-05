// src/types.ts

// Type definition for a Question object
export type Question = {
    id: string;
    question: string;
    options: string[];  // Parsed as an array of strings from the options field.
    viewed: boolean;
    review: boolean;
    answer: number;
    sectionsId: string;
};

// Type definition for a Section object
export type Section = {
    id: string;
    title: string;
    maxMarks: number;
    testId: string;
    questions: Question[];
};

// Type definition for the Test object
export type Test = {
    id: string;
    name: string;
    time: number;
    locked: boolean;
    date: string;  // If you want to use this as a Date object, it can be adjusted to `Date`.
    nquestions: number;
    marks: number;
    sections: Section[];
};
