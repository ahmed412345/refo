/* Created by Ahmed Eltahan - 2026 */
import { X, Search } from "lucide-react";
import { useState } from "react";

const AdvancedSearchPopup = ({ onClose, onSearch, novel }) => {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");

  const handleApplySearch = () => {
    onSearch({
      search,
      novel_name: novel,
      category,
      year,
      author,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
      {/* Overlay */}
      <div onClick={onClose} className="fixed inset-0"></div>

      <div className="bg-white z-50 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="bg-accent/10 p-2 rounded-lg text-accent">
              <Search size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-800">بحث متقدم</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form Section */}
        <div className="p-6 flex flex-col gap-5">
          {/* Main Search Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-600 mr-1">
              كلمة البحث
            </label>
            <div className="relative">
              <input
                placeholder="عن ماذا تبحث؟"
                className="w-full border border-gray-200 focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none p-3 pr-4 rounded-xl transition-all text-gray-700 bg-gray-50/30"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600 mr-1">
                التصنيف
              </label>
              <div className="relative">
                <select
                  className="w-full border border-gray-200 focus:border-accent outline-none p-3 rounded-xl bg-gray-50/30 text-gray-700 appearance-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">كل التصنيفات</option>
                  <option value="اللغة العربية">اللغة العربية</option>
                  <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                  <option value="التاريخ">التاريخ</option>
                  <option value="الجغرافيا">الجغرافيا</option>
                  <option value="علم الاجتماع">علم الاجتماع</option>
                  <option value="علم النفس">علم النفس</option>
                  <option value="الوثائق والمكتبات">الوثائق والمكتبات</option>
                  <option value="الإعلام">الإعلام</option>
                  <option value="موضوعات اخري">موضوعات أخرى</option>
                </select>
              </div>
            </div>

            {/* Year Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-600 mr-1">
                سنة النشر
              </label>
              <input
                type="number"
                placeholder="مثال: 2024"
                className="w-full border border-gray-200 focus:border-accent outline-none p-3 rounded-xl bg-gray-50/30 text-gray-700"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>

          {/* Author Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-600 mr-1">
              اسم المؤلف
            </label>
            <input
              placeholder="بحث باسم الكاتب..."
              className="w-full border border-gray-200 focus:border-accent outline-none p-3 rounded-xl bg-gray-50/30 text-gray-700"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleApplySearch}
            className="w-full bg-accent text-white py-4 rounded-2xl mt-2 font-bold shadow-lg shadow-accent/20 hover:bg-accent2 hover:shadow-accent2/30 transform hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Search size={18} />
            تنفيذ البحث
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPopup;
