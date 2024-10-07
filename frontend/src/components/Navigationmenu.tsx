"use client"
import LogoutButton from "@/components/auth/Logout";
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";


export function NavigationBar() {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // Function to handle scroll
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            // Change background to white after scrolling 50px
            setIsScrolled(scrollTop > 50);
        };

        // Attach scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <header className={`container mx-auto flex items-center justify-between px-60 w-full mix-blend-difference ${isScrolled ? 'bg-white' : 'text-white'}`}>
            <div className="flex items-center h-20 w-40">
                <img src="./logo.png" className="mix-blend-difference" />
            </div>
            <nav className="hidden md:flex space-x-6 font-semibold">
                <a href="/" className="">
                    Home
                </a>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <a href="#" className="">
                                Test Series
                            </a>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white text-black grid gap-4">
                            {Array.from({ length: 6 }, (_, idx) => (
                                <Button variant={'ghost'}
                                    key={idx}
                                    className="w-40"
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            loginWithRedirect()
                                        } else {
                                            navigate('/dashboard')
                                        }
                                    }}
                                >
                                    Jee Mock Test 1
                                </Button>
                            ))}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <a href="#" className="">
                    For Institutes
                </a>
                <a href="#" className="">
                    Contact Us
                </a>
            </nav>
            {isAuthenticated ?
                <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 p-6 text-white"
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                    <LogoutButton />
                </Button>
                :
                <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 p-6 text-white"
                    onClick={() => loginWithRedirect()}
                >
                    Login
                </Button>
            }
        </header>
    )
}
