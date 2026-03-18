import { X, TvMinimalPlay } from "lucide-react";
import YoutubePlayer from "./videoPlayer";
import { useState } from "react";

const SourceDetailsPopup = ({ source, onClose }) => {
    if (!source) return null;

    const [player, setplayer] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            {/* خلفية الإغلاق - عند الضغط خارج المودال الرئيسي */}
            <div onClick={onClose} className="fixed inset-0 -z-10"></div>

            {/* عرض مشغل الفيديو فوق كل شيء إذا كان الـ player = true */}
            {player && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
                    <div className="w-full max-w-5xl relative">
                        {/* زر إغلاق الفيديو فقط والعودة للتفاصيل */}
                        <button
                            onClick={() => setplayer(false)}
                            className="absolute -top-12 right-0 text-white flex items-center gap-2 hover:text-red-400 transition-colors"
                        >
                            إغلاق الفيديو <X size={24} />
                        </button>
                        <YoutubePlayer videoId="KoB2cqmYZNg" />
                    </div>
                </div>
            )}

            {/* بطاقة تفاصيل المصدر */}
            <div className="bg-white z-50 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-4">{source.title}</h2>

                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500">
                        {source.Author} | {source.Year}
                    </p>
                    <span className="px-3 py-1 rounded-full text-sm text-white bg-blue-600">{source.Category}</span>
                </div>

                <div className="prose max-w-none text-gray-700 mb-8 border-t pt-4">
                    <p className="leading-relaxed">{source.Summary}</p>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setplayer(true)} // تصحيح هنا
                        className="py-3 px-6 grow cursor-pointer flex gap-2 items-center justify-center bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-200"
                    >
                        <span>شاهد الشرح</span>
                        <TvMinimalPlay size={22} />
                    </button>

                    <a
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-6 bg-gray-800 grow text-white text-center rounded-xl hover:bg-black transition-all font-bold"
                    >
                        زيارة المصدر
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SourceDetailsPopup;
