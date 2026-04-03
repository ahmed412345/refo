import { useEffect, useState, useRef } from "react";
import { Menu, X, Waypoints, Plus, Search, Filter } from "lucide-react";
import { getSources } from "../services/getSources";
import SourceDetailsPopup from "../components/sourcePop";
import AdvancedSearchPopup from "../components/advancedSearch";
import AddNewSource from "../components/addNewSource";
import AI from "../components/AI";
import SideNavD from "../components/sideNave";

const DashBoard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdvSearchOpen, setIsAdvSearchOpen] = useState(false);
  const [sources, setSources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  // حالات البحث والتصنيف
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [novel, setNovel] = useState("");

  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);

  // Debounce للبحث
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const fetchSources = async (isLoadMore = false, advFilters = null) => {
    setIsMenuOpen(false);
    setIsAdvSearchOpen(false); // إغلاق الـ popup عند البحث

    if (loading && !isLoadMore) return;
    setLoading(true);

    // حذف المصادر القديمة عند البحث الجديد
    if (!isLoadMore) {
      setSources(null);
    }

    try {
      let search = "";
      let novel_name = "";
      let year = "";
      let author = "";
      let category = "";
      let volume = "";
      let issue = "";

      // إذا كان هناك بحث متقدم، استخدم فلاتره وأضف الـ novel الحالية
      if (advFilters) {
        search = advFilters.search || "";
        novel_name = advFilters.novel_name || novel; // إضافة الـ novel الحالية إذا لم تُحدد
        year = advFilters.year || "";
        author = advFilters.author || "";
        category = advFilters.category || "";

        volume = advFilters.volume || "";
        issue = advFilters.edtion || "";
      } else {
        // البحث العادي: استخدم debouncedSearch و novel المختارة
        search = debouncedSearch;
        novel_name = novel;
      }

      const result = await getSources(
        pageRef.current,
        search,
        novel_name,
        year,
        author,
        category,
        volume,
        issue
      );
      totalPagesRef.current = result.totalPages;

      setSources((prev) => {
        if (isLoadMore && prev) {
          return {
            ...result,
            result: [...prev.result, ...result.result],
          };
        }
        return result;
      });
    } catch (e) {
      console.error("خطأ في جلب المصادر:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    pageRef.current = 1;
    fetchSources(false);
  }, [debouncedSearch, novel]);

  const handleLoadMore = () => {
    if (pageRef.current < totalPagesRef.current) {
      pageRef.current += 1;
      fetchSources(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col md:flex-row font-sans overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute inset-0 bg-black opacity-65 z-10`}
      ></div>
      <nav
        className={`shadow-lg shadow-black/20 bg-white border-r group gap-3 md:fixed bottom-0 top-0 border-gray-200 p-2 flex justify-between ${
          isMenuOpen ? "flex-col fixed left-0 right-0" : "flex-row"
        } md:flex-col md:min-w-20 md:py-8 shrink-0 z-50`}
      >
        <div className="flex w-full justify-center">
          <div className="flex items-center justify-center">
            <Waypoints
              size={50}
              className="text-accent text-xs p-2 font-bold"
            />
            <span className="text-accent2 font-bold inline md:hidden group-hover:inline text-2xl">
              Refo
            </span>
          </div>
          <button
            className="md:hidden mr-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X
                size={30}
                className="hover:text-accent cursor-pointer duration-300"
              />
            ) : (
              <Menu
                size={30}
                className="hover:text-accent cursor-pointer duration-300"
              />
            )}
          </button>
        </div>

        <ul
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:hidden md:group-hover:flex gap-4 flex-col md:min-w-50`}
        >
          <li
            onClick={() => setNovel("")}
            className={`border border-accent md:border-0 rounded-sm w-full p-2 text-center hover:text-white cursor-pointer hover:bg-accent2 duration-300 ${
              novel === "" ? "bg-accent2 text-white" : ""
            }`}
          >
            عرض الكل
          </li>
          {/* قسم الكل - لعرض جميع المقالات */}
          {/* دمياط */}
          <li
            onClick={() => setNovel("دمياط")}
            className={`border border-accent md:border-0 rounded-sm w-full p-2 text-center hover:text-white cursor-pointer hover:bg-accent2 duration-300 ${
              novel === "دمياط" ? "bg-accent2 text-white" : ""
            }`}
          >
            مجلة كلية الآداب - جامعة دمياط
          </li>

          {/* القاهرة */}
          <li
            onClick={() => setNovel("القاهرة")}
            className={`border border-accent md:border-0 rounded-sm w-full p-2 text-center hover:text-white cursor-pointer hover:bg-accent2 duration-300 ${
              novel === "القاهرة" ? "bg-accent2 text-white" : ""
            }`}
          >
            مجلة كلية الآداب - جامعة القاهرة
          </li>

          {/* المنصورة */}
          <li
            onClick={() => setNovel("المنصورة")}
            className={`border border-accent md:border-0 rounded-sm w-full p-2 text-center hover:text-white cursor-pointer hover:bg-accent2 duration-300 ${
              novel === "المنصورة" ? "bg-accent2 text-white" : ""
            }`}
          >
            مجلة كلية الآداب - جامعة المنصورة
          </li>
        </ul>

        <div
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col items-center`}
        >
          <AddNewSource></AddNewSource>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 mr-0 md:mr-20 items-start md:p-8 flex flex-row gap-3 min-w-0">
        <section className="flex-1 min-w-0 ">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex items-center px-6 mb-8">
            <Search size={20} className="text-gray-400 md:mr-4" />
            <input
              id="searchBar"
              className="bg-transparent flex-1 outline-none text-lg min-w-12.5"
              placeholder="ابحث في المصادر..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {/* زر فتح البحث المتقدم */}
            <button
              onClick={() => setIsAdvSearchOpen(true)}
              className="md:ml-4 text-gray-400 hover:text-accent"
            >
              <Filter size={20} />
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {novel
                ? "  ابحاث مجلة كلية الآداب - جامعة " + novel
                : "جميع الابحاث"}
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {loading && !sources ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">
                    جاري تحميل المصادر...
                  </p>
                </div>
              </div>
            ) : sources?.result?.length > 0 ? (
              <>
                {sources.result.map((item, index) => (
                  <div
                    key={`${item._id}-${index}`}
                    onClick={() => setSelectedSource(item)}
                    className="bg-white p-6 pb-12 relative rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex flex-col justify-start gap-4 cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 truncate">
                        {item.title}
                      </h3>
                      <div className="mt-1 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                          {item.Author} | {item.Year}
                        </p>
                        <span className="px-3 py-1 rounded-full text-sm text-white bg-accent whitespace-nowrap  inline-block text-center">
                          {item.Category}
                        </span>
                      </div>
                      <p className="text-sm  text-gray-600 mt-2 line-clamp-2">
                        {item.Summary}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400 absolute bottom-2 left-3">
                      مجلة كلية الآداب - جامعة
                      {" " + item.novel_name}
                    </span>
                  </div>
                ))}

                {pageRef.current < totalPagesRef.current && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="w-full py-3 cursor-pointer bg-accent text-white rounded-xl hover:bg-accent2 transition-colors font-bold"
                  >
                    {loading ? "جاري التحميل..." : "عرض المزيد من المصادر"}
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                {loading ? "جاري جلب البيانات..." : "لا توجد مصادر لعرضها."}
              </p>
            )}
          </div>
        </section>
        <SideNavD
          novel={novel}
          onSearch={(filters) => fetchSources(false, filters)}
        />
      </main>

      {/* AI Floating Chat */}
      <AI />
      {isAdvSearchOpen && (
        <AdvancedSearchPopup
          onClose={() => setIsAdvSearchOpen(false)}
          onSearch={(filters) => fetchSources(false, filters)}
          novel={novel}
        />
      )}
      {selectedSource && (
        <SourceDetailsPopup
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
};

export default DashBoard;
