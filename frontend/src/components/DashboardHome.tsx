import { Packs } from "@/pages/Packs";

export default function DashboardHome() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex flex-col text-left">
                <h1 className="text-lg font-semibold md:text-xl">Good Morning, Vaishnav!</h1>
                <p>Welcome back! All the best because #PaperPhodnaHai</p>
            </div>
            <h1 className="text-lg font-semibold md:text-2xl">Your Test Series</h1>
            <p className="text-xs">TODO : list bought packs, but for now</p>
            <Packs />
        </main>
    );
}
