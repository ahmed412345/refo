import { useState, useRef } from "react";
import "plyr/dist/plyr.css";
import { Plyr } from "plyr-react";

const YoutubePlayer = ({ videoId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const playerRef = useRef(null);

    const videoSource = {
        type: "video",
        sources: [{ src: videoId, provider: "youtube" }],
    };

    const plyrOptions = {
        controls: ["play", "progress", "current-time", "mute", "volume", "fullscreen"],
        autoplay: true,
        youtube: { noCookie: true, rel: 0, modestbranding: 1 },
    };

    return (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
            {/* مؤشر التحميل - بيختفي فوراً أول ما الفيديو يبدأ */}
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a0a]">
                    <div className="w-10 h-10 border-3 border-white/10 border-t-white rounded-full animate-spin"></div>
                </div>
            )}

            <Plyr
                ref={playerRef}
                source={videoSource}
                options={plyrOptions}
                // الحدث ده بيشتغل أول ما الفيديو يبدأ عرض فعلي
                onPlaying={() => setIsLoading(false)}
                // أو أول ما يكون الداتا جاهزة تماماً
                onCanPlay={() => setIsLoading(false)}
            />
        </div>
    );
};

export default YoutubePlayer;
