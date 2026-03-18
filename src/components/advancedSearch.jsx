import { X } from "lucide-react";
import { useState } from "react";

const AdvancedSearchPopup = ({ onClose, onSearch, setSearchValue }) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [year, setYear] = useState("");
    const [author, setAuthor] = useState("");

    const handleApplySearch = () => {
        onSearch({ search, category, year, author });
        setSearchValue(search);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 pt-10 rounded-2xl w-full max-w-sm shadow-xl relative">
                <button onClick={onClose} className="absolute hover:bg-accent2 p-1 rounded-2xl hover:text-white cursor-pointer top-4 right-4">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">بحث متقدم</h2>

                <div className="flex flex-col gap-3">
                    <input
                        placeholder="كلمة البحث الرئيسية..."
                        className="border border-gray-400 outline-none p-2 rounded-lg"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        className="border border-gray-400 p-2 outline-none rounded-lg"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        <option value="">كل التصنيفات</option>
                        {/* اللغة العربية */}
                        <option value="اللغة العربية">اللغة العربية</option>

                        {/* اللغة الإنجليزية */}
                        <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>

                        {/* التاريخ */}
                        <option value="التاريخ">التاريخ</option>

                        {/* الجغرافيا */}
                        <option value="الجغرافيا">الجغرافيا</option>

                        {/* علم الاجتماع */}
                        <option value="علم الاجتماع">علم الاجتماع</option>

                        {/* علم النفس */}
                        <option value="علم النفس">علم النفس</option>

                        {/* الوثائق والمكتبات */}
                        <option value="الوثائق والمكتبات">الوثائق والمكتبات والمعلومات</option>

                        {/* الآثار */}
                        <option value="الإعلام">الإعلام</option>

                        {/* موضوعات اخري */}
                        <option value="موضوعات اخري">موضوعات اخري</option>
                    </select>
                    <input
                        placeholder="السنة"
                        className="border border-gray-400 p-2 outline-none rounded-lg"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                    />
                    <input
                        placeholder="اسم المؤلف"
                        className="border border-gray-400 outline-none p-2 rounded-lg"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                    />

                    <button
                        onClick={handleApplySearch}
                        className="bg-accent text-white py-2 rounded-xl mt-2 font-bold hover:bg-accent2 transition-colors"
                    >
                        بحث
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdvancedSearchPopup;
