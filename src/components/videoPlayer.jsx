import { useState } from "react";
import "plyr/dist/plyr.css";
import { Plyr } from "plyr-react";



const YoutubePlayer = ({ videoId, player, setplayer }) => {

    // إعدادات مصدر الفيديو
    const videoSource = {
        type: "video",
        sources: [
            {
                src: videoId,
                provider: "youtube",
            },
        ],
    };

    // إعدادات المشغل (Plyr)
    const plyrOptions = {
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "fullscreen"],
        youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
        },
        autoplay: true,
    };

    return (
        <>
            {/* الزر الذي يفتح النافذة المنبثقة */}
            <button
                onClick={() => setplayer(true)}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
                عرض الفيديو
            </button>

            {/* النافذة المنبثقة (Pop-up Overlay) */}
            {player && (
                <div
                    className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setplayer(false)} // إغلاق عند الضغط على الخلفية
                >
                    {/* حاوية الفيديو المتحكمة في العرض */}
                    <div
                        className="relative w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl bg-black"
                        onClick={e => e.stopPropagation()} // منع الإغلاق عند الضغط داخل حاوية الفيديو
                    >
                        {/* زر الإغلاق العلوي */}
                        <button
                            onClick={() => setplayer(false)}
                            className="absolute top-4 right-4 z-50 p-2 text-white bg-white/10 hover:bg-red-500 rounded-full transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        {/* مشغل الفيديو بأبعاد 16:9 */}
                        <div className="w-full aspect-video">
                            <Plyr source={videoSource} options={plyrOptions} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default YoutubePlayer;
