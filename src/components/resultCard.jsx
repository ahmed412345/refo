const Card = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-accent rounded-xl flex items-center justify-center font-bold shrink-0">N</div>
            <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-lg truncate">Meeting Recap - Q2 Sales Strategy</h3>
                <p className="text-sm opacity-70 mt-1 truncate">ملخص لأهم نقاط استراتيجية المبيعات للربع الثاني...</p>
            </div>
        </div>
    );
};
export default Card;
