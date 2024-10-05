import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, LockIcon, Target } from "lucide-react"

export default function Component() {
    return (
        <div className="bg-white p-6 min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-4xl bg-[#1e2a3b] text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        Quizrr Part Test (QPT) - 1
                        <span className="text-sm font-normal px-2 py-1 bg-green-500 text-white rounded">Available</span>
                    </CardTitle>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        9:00 AM, 8th September 2024 (Sunday)
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-400">QUESTIONS</p>
                                <p className="font-bold">75</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-400">TIME</p>
                                <p className="font-bold">180 min</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-400">MARKS</p>
                                <p className="font-bold">300</p>
                            </div>
                        </div>
                    </div>
                    <Button className="bg-[#f1356d] hover:bg-[#d42d5c] text-white w-full sm:w-auto">
                        <LockIcon className="w-4 h-4 mr-2" /> Unlock Test
                    </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-gray-400">You need to join the pack to access this test.</p>
                </CardFooter>
            </Card>
        </div>
    )
}