import { useEffect, useState, useRef } from "react";
import { Menu, X, Waypoints, Plus, Search } from "lucide-react";
import AI from "../components/AI";
import { getSources } from "../services/getSources";

const DashBoard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [sources, setSources] = useState(null);
    const [loading, setLoading] = useState(false);

    // استخدام useRef لتتبع الصفحة وإجمالي الصفحات دون إعادة Render غير ضروري
    const pageRef = useRef(1);
    const totalPagesRef = useRef(1);

    const fetchSources = async (isLoadMore = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const result = await getSources(pageRef.current);
            totalPagesRef.current = result.totalPages;

            setSources(prev => {
                if (isLoadMore && prev) {
                    // دمج النتائج القديمة مع الجديدة
                    return {
                        ...result,
                        result: [...prev.result, ...result.result],
                    };
                }
                // في حالة التحميل الأول، استبدل النتائج
                return result;
            });
        } catch (e) {
            console.error("خطأ في جلب المصادر:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSources(false);
    }, []);

    const handleLoadMore = () => {
        if (pageRef.current < totalPagesRef.current) {
            pageRef.current += 1;
            fetchSources(true);
        }
    };

    return (
        <div className="min-h-screen  bg-background text-text flex flex-col md:flex-row font-sans overflow-x-hidden">
            {/* Sidebar */}
            <div className={`${isMenuOpen ? "block" : "hidden"} absolute inset-0 bg-black opacity-65 z-10`}></div>
            <nav
                className={`shadow-lg shadow-black/20 bg-white border-r group gap-3 md:fixed bottom-0 top-0 border-gray-200 p-2 flex justify-between ${isMenuOpen ? "flex-col absolute left-0 right-0" : "flex-row"} md:flex-col md:min-w-20 md:py-8 shrink-0 z-50`}
            >
                <div className="flex w-full justify-center">
                    <div className="flex items-center justify-center">
                        <Waypoints size={50} className="text-accent text-xs p-2 font-bold" />
                        <span className="text-accent2 font-bold inline md:hidden group-hover:inline text-2xl">Refo</span>
                    </div>
                    <button className="md:hidden mr-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? (
                            <X size={30} className="hover:text-accent cursor-pointer duration-300" />
                        ) : (
                            <Menu size={30} className="hover:text-accent cursor-pointer duration-300" />
                        )}
                    </button>
                </div>

                <ul className={`${isMenuOpen ? "flex" : "hidden"} md:hidden md:group-hover:flex gap-4 flex-col items-center md:items-start`}>
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
                    <div className="bg-accent hover:bg-gray-400 duration-300 text-white p-3 rounded-2xl shadow-lg cursor-pointer">
                        <Plus size={24} className="cursor-pointer transition-colors" />
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className=" flex-1 md:mr-15 p-4 md:p-8 flex flex-col lg:flex-row gap-8 min-w-0">
                <section className="flex-1 min-w-0 order-1">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center px-6 mb-8">
                        <Search size={20} className="text-gray-400 mr-4" />
                        <input id="searchBar" className="bg-transparent flex-1 outline-none text-lg min-w-12.5" placeholder="ابحث في المصادر..." />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">نتائج البحث</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {sources?.result?.length > 0 ? (
                            <>
                                {sources.result.map((item, index) => (
                                    <div
                                        key={`${item._id}-${index}`}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex items-start gap-4"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-lg text-gray-800 truncate">{item.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.Author} | {item.Year}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.Summary}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* زر تحميل المزيد */}
                                {pageRef.current < totalPagesRef.current && (
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={loading}
                                        className="w-full py-3 bg-accent text-white rounded-xl hover:bg-accent2 transition-colors font-bold"
                                    >
                                        {loading ? "جاري التحميل..." : "عرض المزيد من المصادر"}
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="text-center text-gray-500">{loading ? "جاري جلب البيانات..." : "لا توجد مصادر لعرضها."}</p>
                        )}
                    </div>
                </section>
                <AI />
            </main>
        </div>
    );
};

export default DashBoard;
