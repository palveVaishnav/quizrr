import LoginButton from "@/components/auth/Login"
import LogoutButton from "@/components/auth/Logout";
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom"

export default function LandingPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth0();
    if (isAuthenticated) {
        navigate('/dashboard');
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="container mx-auto px-4 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* <div className="w-8 h-8 bg-white rounded-full" /> */}
                    <span className="text-2xl font-bold">Quizrr</span>
                </div>
                <nav className="hidden md:flex space-x-6">
                    <a href="/" className="hover:text-gray-300">
                        Home
                    </a>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <a href="#" className="hover:text-gray-300">
                                    Test Series
                                </a>
                            </TooltipTrigger>
                            <TooltipContent className="bg-white text-black grid gap-4">
                                {Array.from({ length: 6 }, (_, idx) => (
                                    <Link to={'/dashboard'} key={idx}>
                                        <Button variant={'ghost'} className="w-40">
                                            Jee Mock Test 1
                                        </Button>
                                    </Link>
                                ))}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <a href="#" className="hover:text-gray-300">
                        For Institutes
                    </a>
                    <a href="#" className="hover:text-gray-300">
                        Contact Us
                    </a>
                </nav>
                {isAuthenticated ?
                    <>
                        <Link to={'/dashboard'}>
                            <Button variant="secondary" className="hidden md:inline-flex">
                                Dashboard
                            </Button>
                        </Link>
                        <Button variant="secondary" className="hidden md:inline-flex">
                            <LogoutButton />
                        </Button>
                    </>
                    :
                    <Button variant="secondary" className="hidden md:inline-flex">
                        <LoginButton />
                    </Button>
                }
            </header>
            <main className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-start">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">
                    Prepare with India's Most Trusted Test Series for{" "}
                    <span className="text-yellow-400">JEE Advanced</span>
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl">
                    Crack upcoming IIT JEE Main & Advanced and other competitive exams with test series designed according to latest
                    pattern of exams!
                </p>
                <Button size="lg" className="text-lg px-8 py-4">
                    Explore Test Series
                </Button>
            </main>
            <div className="absolute inset-0 -z-10">
                {/* Image here */}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent -z-10" />
        </div>
    )
}

