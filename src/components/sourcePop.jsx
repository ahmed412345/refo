import { X, TvMinimalPlay } from "lucide-react";
import YoutubePlayer from "./videoPlayer";

const SourceDetailsPopup = ({ source, onClose }) => {
    if (!source) return null;

    const [player, setplayer] = useState(false);

    return (
        <div className="fixed inset-0 bg-black/50 z-50  flex items-center justify-center p-4">
            <YoutubePlayer player={player} setplayer={setplayer} videoId={"KoB2cqmYZNg"} />
            <div onClick={onClose} className="fixed inset-0"></div>

            <div className="bg-white z-50 rounded-2xl pt-15 p-3  max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl relative">
                <button onClick={onClose} className="absolute cursor-pointer top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">{source.title}</h2>
                <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {source.Author} | {source.Year}
                    </p>
                    <span className="px-2 py-1 min-w-22.5 rounded-2xl text-sm text-white bg-accent">{source.Category}</span>
                </div>

                <div className="prose max-w-none text-gray-700 mb-8">
                    <p>{source.Summary}</p>
                </div>

                <div className="flex gap-4 items-center justify-stretch">
                    <button
                        onClick={setplayer(true)}
                        className="py-3 grow cursor-pointer flex gap-1 items-center justify-center bg-red-500 text-white text-center rounded-xl hover:bg-accent2 transition-colors font-bold"
                    >
                        شاهد الشرح
                        <TvMinimalPlay size={25} className="text-white"></TvMinimalPlay>
                    </button>
                    <a
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 bg-accent grow text-white text-center rounded-xl hover:bg-accent2 transition-colors font-bold"
                    >
                        زيارة المصدر
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SourceDetailsPopup;
