import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import TestOverview from "@/components/TestOverview";
import { Dashboard } from "../components/Dashboard";

export default function TestPage() {
    const { isAuthenticated, isLoading } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/');
        }
    }, [isLoading, isAuthenticated, navigate]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <Dashboard>
            <TestOverview />
        </Dashboard>
    );
}
