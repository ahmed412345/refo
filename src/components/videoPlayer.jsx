import React, { useState } from "react";
import "plyr/dist/plyr.css";
import { Plyr } from "plyr-react";

const YoutubePlayer = ({ videoId }) => {
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

    // دالة لإخفاء اللودر
    const handleVideoReady = () => {
        console.log("Video is ready!"); // للتأكد في الكونسول
        setIsLoading(false);
    };

    return (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 relative">
            {/* اللودر بتصميم أنيق */}
            {isLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]">
                    <div className="relative flex items-center justify-center">
                        {/* الدائرة الخارجية */}
                        <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
                        {/* نقطة في المنتصف تعطي شكل جمالي */}
                        <div className="absolute w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                    </div>
                    <p className="mt-4 text-gray-400 text-xs tracking-widest uppercase animate-pulse">Loading Experience</p>
                </div>
            )}

            <Plyr
                source={videoSource}
                options={plyrOptions}
                // جربنا onReady ولم يفلح؟ نستخدم الأحداث الأكثر دقة:
                onReady={handleVideoReady}
                onPlay={handleVideoReady} // إذا بدأ الصوت/الفيديو، اخفِ اللودر فوراً
                onCanPlay={handleVideoReady} // بمجرد أن تصبح الداتا كافية للتشغيل
            />
        </div>
    );
};

export default YoutubePlayer;
