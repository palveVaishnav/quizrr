import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <h1>Landing Page</h1>
            <Link to='/Dashboard' className="border px-4 py-2" >
                Dashboard after login
            </Link>
        </>
    )
}