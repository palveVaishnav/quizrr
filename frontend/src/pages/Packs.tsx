import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, CheckCircle2 } from "lucide-react"
import { Dashboard } from "@/components/Dashboard"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from "react-router-dom"



interface TestSeriesProps {
    batch: string
    title: string
    subtitle: string
    fullTests: number
    partTests: number
    chapterTests: number
    isAdvanced?: boolean
}

const TestSeriesCard = ({ batch, subtitle, fullTests, partTests, chapterTests, isAdvanced }: TestSeriesProps) => (
    <Card className="w-full max-w-sm relative border border-black p-2">
        <CardHeader className="space-y-1 pb-4">
            <div className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-md w-fit absolute -top-3 right-5">
                {batch} Batch
            </div>
            <CardTitle className="text-2xl font-bold">
                Target <span className="text-yellow-400">99+ Percentile</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Download Schedule
            </Button>
            <div className="space-y-1">
                <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>{fullTests} Full Tests</span>
                </div>
                <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>{partTests} {isAdvanced ? 'Part' : 'Quizrr Part'} Tests</span>
                </div>
                <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    <span>{chapterTests} Chapter-wise Tests {!isAdvanced && '& 2024 - 2020 PYQs as Mocks'}</span>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Dialog>
                <DialogTrigger>View Pack</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select a pack :</DialogTitle>
                        <Separator />
                        <div className="space-y-4">
                            <Link to={'/tests'}>
                                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <img src="https://cdn.quizrr.in/web-assets/icons/exams/jee-main.png" className="w-8" />
                                        <span>JEE Main 2025 Full Test Series (October Batch)</span>
                                    </div>
                                    <Button variant="secondary" className="text-sm">
                                        View Tests
                                    </Button>
                                </div>
                            </Link>
                            <Link to={'/tests'}>
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center space-x-2">
                                        <img src="https://cdn.quizrr.in/web-assets/icons/exams/jee-main.png" className="w-8" />
                                        <span>JEE Main 2025 Chapter-wise Test Series</span>
                                    </div>
                                    <Button variant="secondary" className="text-sm">
                                        View Tests
                                    </Button>
                                </div>
                            </Link>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Link to={'/payment'}>
                <Button>Buy Now</Button>
            </Link>
        </CardFooter>
    </Card>
)

export function Packs() {
    const testSeries = [
        { batch: "September", title: "JEE Main 2025 Test Series (Droppers)", subtitle: "JEE Main 2025 Test Series (Droppers)", fullTests: 30, partTests: 12, chapterTests: 471 },
        { batch: "October", title: "JEE Main 2025 Test Series", subtitle: "JEE Main 2025 Test Series (October Batch)", fullTests: 30, partTests: 12, chapterTests: 471 },
        { batch: "September", title: "JEE Main 2025 Test Series", subtitle: "JEE Main 2025 Test Series (Class 12)", fullTests: 30, partTests: 12, chapterTests: 471 },
        { batch: "August", title: "JEE Adv. 2025 Test Series", subtitle: "JEE Adv. 2025 Test Series (Batch 2)", fullTests: 10, partTests: 10, chapterTests: 70, isAdvanced: true },
    ]

    return (
        <div className="mt-0 p-4">
            <p className="text-sm">
                Overview
            </p>
            <span className="text-3xl">
                Test Series Packs
            </span>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {testSeries.map((series, index) => (
                    <TestSeriesCard key={index} {...series} />
                ))}
            </div>
        </div>
    )
}


export default function PacksPage() {
    return (
        <Dashboard>
            <Packs />
        </Dashboard>
    )
}






