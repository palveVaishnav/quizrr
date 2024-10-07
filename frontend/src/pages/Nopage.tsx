import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NoPage() {
    return (
        <div>
            Not found
            <Link to={'/dashboard'}>
                <Button>
                    Dashboard
                </Button>
            </Link>
        </div>
    )
}