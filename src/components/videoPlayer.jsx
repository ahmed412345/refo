import { useState } from "react";
import "plyr/dist/plyr.css";
import { Plyr } from "plyr-react";

const YoutubePlayer = ({ videoId }) => {
    // حالة للتحكم في ظهور "اللودر"
    const [isLoading, setIsLoading] = useState(true);

    const videoSource = {
        type: "video",
        sources: [{ src: videoId, provider: "youtube" }],
    };

    const plyrOptions = {
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "fullscreen"],
        youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
        autoplay: true,
    };

    return (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 relative group">
            {/* 1. اللودر (Spinner) - يظهر فقط عندما يكون isLoading true */}
            {isLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black transition-opacity duration-500">
                    {/* شكل اللودر - دائرة بتلف */}
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-white/60 text-sm font-medium animate-pulse">جاري تحضير الفيديو...</p>
                </div>
            )}

            {/* 2. مشغل الفيديو */}
            <Plyr
                source={videoSource}
                options={plyrOptions}
                // عندما يصبح الفيديو جاهزاً للتشغيل (كود سحري)
                onReady={() => setIsLoading(false)}
            />
        </div>
    );
};

export default YoutubePlayer;
