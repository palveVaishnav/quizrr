import { Link } from "react-router-dom"
import {
    AlertTriangle,
    Bell,
    Book,
    Bookmark,
    Home,
    Package2,
    User,
} from "lucide-react"

// import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
export const description =
    "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action."

export function Dashboard({
    children
}: {
    children: JSX.Element
}) {
    return (
        <div className="h-screen grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <RightPanel />
            <div className="flex flex-col h-screen  overflow-y-scroll">
                {children}
            </div>
        </div>

    )
}


const RightPanel = () => {
    return (
        <div className={`hidden border-r bg-muted/40 md:block h-screen`}>
            <div className="flex h-full max-h-screen flex-col gap-2 ">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="">Quizrr</span>
                    </Link>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <Link
                            to="/packs"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                            <Book className="h-4 w-4" />
                            Packs
                        </Link>
                        <Link
                            to="/tests"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
                        >
                            <Book className="h-4 w-4" />
                            Tests
                        </Link>
                        <Link
                            to="/notebook"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <Bookmark className="h-4 w-4" />
                            Notebooks
                        </Link>
                        <Link
                            to="/results"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            Results
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4 grid place-content-center w-full">

                </div>
            </div>
        </div>
    )
}