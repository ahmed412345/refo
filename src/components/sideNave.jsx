import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";

const SideNavD = ({ novel, onSearch }) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [openSections, setOpenSections] = useState({});

  if (!novel) return null;

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const foldersD = [
    { id: "14", title: "المجلد 14", issues: [6, 5, 4, 3, 2, 1] },
    { id: "13", title: "المجلد 13", issues: [6, 5, 4, 3, 2, 1] },
    { id: "12", title: "المجلد 12", issues: [6, 5, 4, 3, 2, 1] },
    { id: "11", title: "المجلد 11", issues: [4, 3, 2, 1] },
    { id: "10", title: "المجلد 10", issues: [4, 3, 2, 1] },
    { id: "4", title: "المجلد 4", issues: [2, 1] },
    { id: "3", title: "المجلد 3", issues: [2, 1] },
    { id: "2", title: "المجلد 2", issues: [2, 1] },
    { id: "1", title: "المجلد 1", issues: [2, 1] },
  ];
  // ... (بقية مصفوفات foldersQ و foldersM كما هي في الكود السابق)
  const foldersQ = [
    { id: "86", title: "المجلد 86", issues: [10, 2, 1] },
    { id: "85", title: "المجلد 85", issues: [11, 7, 6, 5, 4, 3, 2, 1] },
    { id: "84", title: "المجلد 84", issues: [3] },
  ];
  const foldersM = [{ id: "78", title: "المجلد 78", issues: [78] }];

  let chossenFolders = [];
  if (novel === "القاهرة") chossenFolders = foldersQ;
  else if (novel === "دمياط") chossenFolders = foldersD;
  else if (novel === "المنصورة") chossenFolders = foldersM;

  return (
    <>
      {/* 1. الخلفية السوداء (Overlay) - تظهر عند الفتح في الموبايل */}
      {isOpenMenu && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpenMenu(false)}
        />
      )}

      {/* 2. زر السهم (Trigger) - مثبت في يسار الشاشة */}
      <button
        onClick={() => setIsOpenMenu(!isOpenMenu)}
        className={`fixed top-1/2 left-0 -translate-y-1/2 z-40 opacity-50 bg-blue-600 text-white p-2.5 rounded-r-2xl shadow-2xl md:hidden transition-all duration-300 active:scale-90 ${
          isOpenMenu ? "translate-x-70" : "translate-x-0"
        }`}
      >
        {isOpenMenu ? (
          <ChevronLeft size={24} className="animate-in fade-in" />
        ) : (
          <ChevronRight size={24} className="animate-in fade-in" />
        )}
      </button>

      {/* 3. القائمة الجانبية (Sidebar) */}
      <nav
        className={`
          /* الموبايل: تخرج من اليسار */
          fixed top-0 left-0 h-screen z-40 w-70 transition-transform duration-300 ease-out transform
          ${isOpenMenu ? "translate-x-0" : "-translate-x-full"}
          
          /* الشاشات الكبيرة: تعود لمكانها الطبيعي في الـ Flow */
          md:relative md:translate-x-0 md:h-auto md:max-w-xs md:w-full
          
          /* التصميم الداخلي */
          bg-white border-l md:border border-gray-100 shadow-2xl md:shadow-xl md:rounded-2xl overflow-y-auto p-5
        `}
        dir="rtl"
      >
        <div className="flex items-center justify-center gap-2 mb-8 border-b pb-4">
          <LayoutGrid size={20} className="text-blue-500" />
          <h2 className="text-xl font-extrabold text-gray-800">المجلدات</h2>
        </div>

        <ul className="space-y-3">
          {chossenFolders.map((folder) => {
            const isOpen = openSections[folder.id];

            return (
              <li key={folder.id} className="select-none group">
                <div
                  onClick={() => toggleSection(folder.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    isOpen
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500 shadow-sm"
                      : "hover:bg-gray-50 text-gray-700 border-r-4 border-transparent"
                  }`}
                >
                  <span className="font-semibold text-[15px]">
                    {folder.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 opacity-60 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* قائمة الأعداد */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-125 opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="mr-5 space-y-1 border-r-2 border-gray-100 pr-3">
                    {folder.issues.map((issue) => (
                      <li
                        key={issue}
                        className="py-2.5 px-3 text-[14px] text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg cursor-pointer transition-all flex items-center gap-2"
                        onClick={() => {
                          onSearch({
                            volume: folder.id,
                            edtion: issue,
                          });
                          if (window.innerWidth < 768) setIsOpenMenu(false);
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-400" />
                        العدد {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default SideNavD;
