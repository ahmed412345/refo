import { useState } from "react";
import { Menu, X, Waypoints, Plus } from "lucide-react";
import AI from "../components/AI";
import SearchSection from "../components/search";

const DashBoard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-text flex flex-col md:flex-row font-sans overflow-x-hidden">
            {/* Sidebar */}
            <div className={`${isMenuOpen ? "block" : "hidden"} absolute  inset-0 bg-black opacity-65 z-10`}></div>
            <nav
                className={`bg-white border-r group gap-3 border-gray-200 p-2 flex justify-between ${isMenuOpen ? "flex-col absolute left-0 right-0" : "flex-row"}  md:flex-col md:min-w-20 md:py-8 shrink-0 z-50`}
            >
                <div className="flex w-full justify-center">
                    <div className="flex items-center justify-center">
                        <Waypoints size={50} className="text-accent text-xs p-2  font-bold" />
                        <span className="text-accent2 font-bold inline md:hidden group-hover:inline text-2xl">Refo</span>
                    </div>
                    <button className="md:hidden mr-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? (
                            <X size={30} className="hover:text-accent  cursor-pointer duration-300 " />
                        ) : (
                            <Menu size={30} className="hover:text-accent cursor-pointer duration-300 " />
                        )}
                    </button>
                </div>

                <ul className={`${isMenuOpen ? "flex" : "hidden"}  md:hidden md:group-hover:flex gap-4 flex-col items-center md:items-start`}>
                    <li className="border border-accent md:border-0 rounded-sm w-full p-2 text-center hover:text-white cursor-pointer hover:bg-accent2 duration-300">
                        التاثير النفسي والسلوكي
                    </li>
                    <li className="border border-accent md:border-0 rounded-sm w-full p-2 text-center hover:text-white cursor-pointer hover:bg-accent2 duration-300">
                        الديناميكيات الأجتماعية والعلاقات الأسرية
                    </li>
                    <li className="border border-accent md:border-0 rounded-sm w-full p-2 text-center hover:text-white cursor-pointer hover:bg-accent2 duration-300">
                        الأليات والظواهر الرقمية
                    </li>
                    <li className="border border-accent md:border-0 rounded-sm w-full p-2 text-center hover:text-white cursor-pointer hover:bg-accent2 duration-300">
                        الاستراتيجيات والحلول
                    </li>
                </ul>

                <div className={`${isMenuOpen ? "flex" : "hidden"} md:flex flex-col items-center`}>
                    <div className="bg-accent hover:bg-gray-400  duration-300 text-white p-3 rounded-2xl shadow-lg cursor-pointer">
                        <Plus size={24} className=" cursor-pointer transition-colors" />
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 flex flex-col lg:flex-row gap-8 min-w-0">
                <SearchSection />
                <AI />
            </main>
        </div>
    );
};

export default DashBoard;
