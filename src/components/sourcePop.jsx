import React, { useState } from "react";
import { X, TvMinimalPlay } from "lucide-react";
import YoutubePlayer from "./videoPlayer";

const SourceDetailsPopup = ({ source, onClose }) => {
    if (!source) return null;

    const [player, setPlayer] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            {/* خلفية الإغلاق (تغلق المودال بالكامل) */}
            <div onClick={onClose} className="fixed inset-0 -z-10 cursor-default"></div>

            {/* --- نافذة الفيديو --- */}
            {player && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 p-4 transition-all animate-in fade-in duration-300">
                    {/* زر الإغلاق: الآن fixed وفي أقصى اليمين العلوي للشاشة */}
                    <button
                        onClick={() => setPlayer(false)}
                        className="fixed top-6 right-6 z-110 text-white/70 hover:text-white transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full"
                        title="إغلاق الفيديو"
                    >
                        <X size={35} strokeWidth={2.5} />
                    </button>

                    <div className="w-full max-w-5xl relative shadow-2xl">
                        <YoutubePlayer videoId="KoB2cqmYZNg" />
                    </div>

                    {/* إغلاق الفيديو عند الضغط على المنطقة السوداء */}
                    <div className="absolute inset-0 -z-10" onClick={() => setPlayer(false)}></div>
                </div>
            )}

            {/* --- بطاقة تفاصيل المصدر الأساسية --- */}
            <div className="bg-white z-50 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-200">
                {/* زر إغلاق نافذة التفاصيل */}
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
                    <span className="px-3 py-1 rounded-full text-sm text-white bg-accent whitespace-nowrap  inline-block text-center">
                        {source.Category}
                    </span>
                </div>

                <div className="prose max-w-none text-gray-700 mb-8 border-t pt-4">
                    <p className="leading-relaxed">{source.Summary}</p>
                </div>

                <div className="flex gap-4 items-center">
                    {/* زر فتح الفيديو */}
                    <button
                        onClick={() => setPlayer(true)}
                        className="py-3 px-6 grow cursor-pointer flex gap-2 items-center justify-center bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-100"
                    >
                        <span>شاهد الشرح</span>
                        <TvMinimalPlay size={22} />
                    </button>

                    {/* رابط المصدر الخارجي */}
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
