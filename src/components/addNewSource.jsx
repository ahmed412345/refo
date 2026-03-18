import { useState } from "react";
import { Plus, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { addSource } from "../services/addSources";

const AddNewSource = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });
    const [formData, setFormData] = useState({
        title: "",
        Summary: "",
        Author: "",
        Year: "",
        Category: "",
        link: "",
    });

    const categories = [
        "اللغة العربية",
        "اللغة الإنجليزية",
        "التاريخ",
        "الجغرافيا",
        "علم الاجتماع",
        "علم النفس",
        "الوثائق والمكتبات",
        "الإعلام",
        "موضوعات اخري",
    ];
    const handleSubmit = async () => {
        if (!formData.title || !formData.Summary || !formData.Category) {
            setStatus({ type: "error", message: "يرجى ملء الحقول الأساسية (العنوان، الملخص، التصنيف)" });
            return;
        }

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            await addSource({ ...formData, Year: parseInt(formData.Year) || new Date().getFullYear() });
            setStatus({ type: "success", message: "تمت الاضافة سيتم مراجعتة في اقرب وقت" });

            // إعادة تعيين النموذج بعد النجاح
            setFormData({ title: "", Summary: "", Author: "", Year: "", Category: "", link: "" });

            // إغلاق المودال بعد ثانية ونصف
            setTimeout(() => {
                setIsOpen(false);
                setStatus({ type: "", message: "" });
            }, 1500);
        } catch (error) {
            setStatus({ type: "error", message: "حدث خطأ أثناء الإضافة، يرجى المحاولة مرة أخرى" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-accent hover:bg-opacity-90 duration-300 text-white p-3 rounded-2xl shadow-lg transition-all transform hover:scale-105"
            >
                <Plus size={24} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-gray-800">إضافة مصدر جديد</h2>

                        <div className="flex flex-col gap-4">
                            <input
                                placeholder="العنوان"
                                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="المؤلف"
                                    className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent"
                                    value={formData.Author}
                                    onChange={e => setFormData({ ...formData, Author: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="السنة"
                                    className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent"
                                    value={formData.Year}
                                    onChange={e => setFormData({ ...formData, Year: e.target.value })}
                                />
                            </div>

                            <select
                                className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent"
                                value={formData.Category}
                                onChange={e => setFormData({ ...formData, Category: e.target.value })}
                            >
                                <option value="">اختر التصنيف</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            <textarea
                                placeholder="الملخص"
                                rows="3"
                                className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent resize-none"
                                value={formData.Summary}
                                onChange={e => setFormData({ ...formData, Summary: e.target.value })}
                            />

                            <input
                                placeholder="الرابط"
                                className="border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent"
                                value={formData.link}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                            />

                            {status.message && (
                                <div
                                    className={`flex items-center gap-2 p-3 rounded-xl ${status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                                >
                                    {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                    <span className="text-sm font-medium">{status.message}</span>
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "إضافة المصدر"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddNewSource;
