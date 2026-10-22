/* Created by Ahmed Eltahan - 2026 */
import { useState } from "react";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    MapPin,
    Compass,
} from "lucide-react";
import { addTrip } from "../services/addTrip";

const AddNewTripPage = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const initialLocation = {
        id: Date.now().toString(),
        name: "",
        type: "",
        lat: "",
        lng: "",
        description: "",
        image: "",
    };

    const [formData, setFormData] = useState({
        tripTitle: "",
        description: "",
        locations: [{ ...initialLocation }],
    });

    // إضافة نقطة/مكان جديد بالقائمة
    const handleAddLocation = () => {
        setFormData(prev => ({
            ...prev,
            locations: [
                ...prev.locations,
                { ...initialLocation, id: Date.now().toString() },
            ],
        }));
    };

    // حذف مكان معين
    const handleRemoveLocation = index => {
        if (formData.locations.length === 1) return; // الحفاظ على نقطة واحدة على الأقل
        const updatedLocations = formData.locations.filter(
            (_, i) => i !== index,
        );
        setFormData(prev => ({ ...prev, locations: updatedLocations }));
    };

    // تحديث بيانات مكان معّين
    const handleLocationChange = (index, field, value) => {
        const updatedLocations = [...formData.locations];
        updatedLocations[index][field] = value;
        setFormData(prev => ({ ...prev, locations: updatedLocations }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        // التحقق من الحقول الأساسية للرحلة
        if (!formData.tripTitle || !formData.description) {
            setStatus({
                type: "error",
                message: "يرجى ملء الحقول الأساسية (عنوان الرحلة والوصف)",
            });
            return;
        }

        // التحقق من أن كل نقطة تحتوي على اسم على الأقل
        const hasInvalidLocation = formData.locations.some(
            loc => !loc.name.trim(),
        );
        if (hasInvalidLocation) {
            setStatus({
                type: "error",
                message: "يرجى إدخال اسم المكان لجميع النقاط المضافة",
            });
            return;
        }

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            // تجهيز البيانات وصياغة position كمصفوفة [lat, lng]
            const payload = {
                tripTitle: formData.tripTitle,
                description: formData.description,
                locations: formData.locations.map(loc => ({
                    id: loc.id || Date.now().toString(),
                    name: loc.name,
                    type: loc.type,
                    position: [
                        parseFloat(loc.lat) || 0,
                        parseFloat(loc.lng) || 0,
                    ],
                    description: loc.description,
                    image: loc.image,
                })),
            };

            await addTrip(payload);

            setStatus({
                type: "success",
                message: "تمت إضافة الرحلة بنجاح!",
            });

            // إعادة تعيين النموذج بعد النجاح
            setFormData({
                tripTitle: "",
                description: "",
                locations: [{ ...initialLocation }],
            });
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 dir-rtl"
            dir="rtl"
        >
            <div className="max-w-4xl mx-auto">
                {/* العنونة الهيدر */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-3 text-accent mb-2">
                        <Compass className="w-8 h-8" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            إضافة رحلة جديدة
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">
                        قم بملء البيانات الخاصة بالرحلة وأضف نقاط التوقف
                        والأماكن المختلفة بها.
                    </p>
                </div>

                {/* النموذج الرئيسي */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* تفاصيل الرحلة الأساسية */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
                            تفاصيل الرحلة
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                عنوان الرحلة{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="أدخل عنوان الرحلة"
                                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm sm:text-base"
                                value={formData.tripTitle}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        tripTitle: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                وصف الرحلة{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="اكتب وصفاً مفصلاً للرحلة..."
                                rows="4"
                                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent resize-none transition-all text-sm sm:text-base"
                                value={formData.description}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* قسم الأماكن/النقاط */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-accent" size={22} />
                                <h2 className="text-lg font-bold text-gray-800">
                                    نقاط / أماكن الرحلة (
                                    {formData.locations.length})
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddLocation}
                                className="bg-accent text-white hover:bg-opacity-90 px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                                <Plus size={18} /> إضافة مكان جديد
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            {formData.locations.map((loc, index) => (
                                <div
                                    key={loc.id || index}
                                    className="p-5 sm:p-6 border border-gray-200 bg-gray-50/40 rounded-2xl relative flex flex-col gap-4 transition-all hover:border-gray-300"
                                >
                                    <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                                        <span className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg">
                                            المكان #{index + 1}
                                        </span>
                                        {formData.locations.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveLocation(index)
                                                }
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer"
                                            >
                                                <Trash2 size={18} />
                                                <span className="hidden sm:inline">
                                                    حذف
                                                </span>
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                اسم المكان{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="مثال: الأهرامات"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={loc.name}
                                                onChange={e =>
                                                    handleLocationChange(
                                                        index,
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                نوع المكان
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="مثال: أثري، مطعم، فندق"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={loc.type}
                                                onChange={e =>
                                                    handleLocationChange(
                                                        index,
                                                        "type",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* الإحداثيات Position: Latitude & Longitude */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                خط العرض (Latitude)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="29.9792"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={loc.lat}
                                                onChange={e =>
                                                    handleLocationChange(
                                                        index,
                                                        "lat",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                خط الطول (Longitude)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="31.1342"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={loc.lng}
                                                onChange={e =>
                                                    handleLocationChange(
                                                        index,
                                                        "lng",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            وصف المكان
                                        </label>
                                        <textarea
                                            placeholder="تفاصيل إضافية عن المكان..."
                                            rows="2"
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent resize-none"
                                            value={loc.description}
                                            onChange={e =>
                                                handleLocationChange(
                                                    index,
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            رابط الصورة (Image URL)
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                            value={loc.image}
                                            onChange={e =>
                                                handleLocationChange(
                                                    index,
                                                    "image",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* التنبيهات والأخطاء */}
                    {status.message && (
                        <div
                            className={`flex items-center gap-3 p-4 rounded-2xl ${
                                status.type === "success"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                        >
                            {status.type === "success" ? (
                                <CheckCircle2 size={20} className="shrink-0" />
                            ) : (
                                <AlertCircle size={20} className="shrink-0" />
                            )}
                            <span className="text-sm sm:text-base font-medium">
                                {status.message}
                            </span>
                        </div>
                    )}

                    {/* زر الإرسال والحفظ */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto min-w-[200px] bg-accent text-white py-3.5 px-8 rounded-2xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={22} />
                            ) : (
                                "حفظ ونشر الرحلة"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewTripPage;
