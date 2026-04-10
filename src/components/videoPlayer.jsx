/* Created by Ahmed Eltahan - 2026 */
import "plyr/dist/plyr.css";
import { Plyr } from "plyr-react";
import { useState, useRef, useEffect } from "react";

const YoutubePlayer = ({ videoId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const plyrRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

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
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "mute",
      "volume",
      "captions",
      "settings",
      "pip",
      "fullscreen",
    ],
    youtube: {
      noCookie: true,
      rel: 0,
      iv_load_policy: 3,
      modestbranding: 1,
    },
    autoplay: false,
    autopause: true,
  };

  // مراقبة حالة التحميل مع حد زمني آمن
  useEffect(() => {
    // إظهار مؤشر التحميل عند تغيير الفيديو
    setIsLoading(true);

    // إختفاء مؤشر التحميل بعد 2.5 ثانية من الظهور
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [videoId]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
      {/* مؤشر التحميل المربع */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <div className="relative w-16 h-16">
            {/* مربع داخلي يدور */}
            <div
              className="absolute inset-0 border-2 border-transparent border-t-accent border-r-accent rounded-lg"
              style={{
                animation: "spin 2s linear infinite",
                boxShadow:
                  "0 0 25px rgba(59, 130, 246, 0.6), inset 0 0 15px rgba(59, 130, 246, 0.3)",
              }}
            ></div>

            {/* مربع خارجي ثابت */}
            <div className="absolute inset-0 border-2 border-white/20 rounded-lg"></div>

            {/* نقطة وسط */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-2 h-2 bg-accent rounded-full"
                style={{
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* مشغل الفيديو */}
      <Plyr ref={plyrRef} source={videoSource} options={plyrOptions} />
    </div>
  );
};

export default YoutubePlayer;
