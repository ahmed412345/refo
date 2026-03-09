import { Search } from "lucide-react";
import Card from "../components/resultCard";

const SearchSection = () => {
    return (
        <section className="flex-1 min-w-0 order-1">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center px-6 mb-8">
                <Search size={20} className="text-gray-400 mr-4" />
                <input id="searchBar" className="bg-transparent flex-1 outline-none text-lg min-w-12.5" placeholder="ابحث في المصادر..." />
                {/* <Waypoints size={35} className="text-accent text-xs font-bold bg-blue-50 px-2 py-1 rounded" /> */}
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">نتائج البحث</h2>
            </div>

            <Card />
        </section>
    );
};

export default SearchSection;
