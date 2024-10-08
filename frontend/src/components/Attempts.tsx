// components/AttemptsTable.tsx
import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names
import { Table, TableHeader, TableRow, TableCell, TableBody } from "./ui/table";

// Define the props for the component
interface AttemptsTableProps {
    data: {
        attempt: {
            id: string;
            authId: string;
            testId: string;
            marks: number;
        };
        test: {
            id: string;
            name: string; // assuming test has a name
            totalMarks: number; // assuming test has total marks
        };
    }[];
}

const AttemptsTable: React.FC<AttemptsTableProps> = ({ data }) => {
    return (
        <div className={cn("w-full overflow-x-auto p-4")}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Attempt ID</TableCell>
                        <TableCell>Test Name</TableCell>
                        <TableCell>Marks Scored</TableCell>
                        <TableCell>Total Marks</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>{entry.attempt.id}</TableCell>
                            <TableCell>{entry.test?.name ?? "N/A"}</TableCell>
                            <TableCell>{entry.attempt.marks}</TableCell>
                            <TableCell>{entry.test?.totalMarks ?? "N/A"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AttemptsTable;
