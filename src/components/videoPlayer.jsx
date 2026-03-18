import "plyr/dist/plyr.css";
import { Plyr } from "plyr-react";

const YoutubePlayer = ({ videoId }) => {
    // إعدادات مصدر الفيديو
    const videoSource = {
        type: "video",
        sources: [
            {
                src: videoId,
                provider: "youtube",
            },
        ],
    }; // إعدادات المشغل (Plyr)

    const plyrOptions = {
        controls: ["play-large", "play", "progress", "current-time", "mute", "volume", "captions", "settings", "pip", "fullscreen"],
        youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
        },
        autoplay: true, // سيبدأ العمل فور ظهور المودال
    };

    return (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
            <Plyr source={videoSource} options={plyrOptions} />
        </div>
    );
};

export default YoutubePlayer;
