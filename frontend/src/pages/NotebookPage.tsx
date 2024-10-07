import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Edit, Trash2, Plus, Search, MoveUp, MoveDown } from "lucide-react"

import { Dashboard } from "@/components/Dashboard";

export default function NotebookPage() {
    return (<Dashboard>
        <Notebook />
    </Dashboard>)
}


function Notebook() {
    const [notebooks, setNotebooks] = useState(["three", "toe", "four", "first"])
    const [searchTerm, setSearchTerm] = useState("")

    const filteredNotebooks = notebooks.filter(notebook =>
        notebook.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = (index: number) => {
        setNotebooks(notebooks.filter((_, i) => i !== index))
    }

    const handleMove = (index: number, direction: "up" | "down") => {
        const newNotebooks = [...notebooks]
        const newIndex = direction === "up" ? index - 1 : index + 1
        if (newIndex >= 0 && newIndex < notebooks.length) {
            [newNotebooks[index], newNotebooks[newIndex]] = [newNotebooks[newIndex], newNotebooks[index]]
            setNotebooks(newNotebooks)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Notebooks</h1>
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-1/3">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search notebooks"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="space-x-2">
                    <Button variant="outline">Reorder</Button>
                    {/* <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add New
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Notebook</DialogTitle>
                            </DialogHeader>
                            <Input placeholder="Notebook name" />
                            <Button>Create</Button>
                        </DialogContent>
                    </Dialog> */}
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Notebook Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredNotebooks.map((notebook, index) => (
                        <TableRow key={index}>
                            <TableCell>{notebook}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleMove(index, "up")}>
                                    <MoveUp className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleMove(index, "down")}>
                                    <MoveDown className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}