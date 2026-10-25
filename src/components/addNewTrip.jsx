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
    Image as ImageIcon,
    Link as LinkIcon,
} from "lucide-react";
import { addTrip } from "../services/addTrip";

const AddNewTripPage = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const initialImage = {
        src: "",
        alt: "",
    };

    const initialStop = {
        id: Date.now().toString(),
        name: "",
        governorate: "",
        lat: "",
        lng: "",
        mapURL: "",
        category: "",
        period: "",
        short: "",
        description: "",
        tip: "",
        images: [{ ...initialImage }],
    };

    const [formData, setFormData] = useState({
        eyebrow: "",
        title: "",
        subtitle: "",
        description: "",
        stops: [{ ...initialStop }],
    });

    // إضافة محطة جديدة
    const handleAddStop = () => {
        setFormData(prev => ({
            ...prev,
            stops: [
                ...prev.stops,
                { ...initialStop, id: Date.now().toString() },
            ],
        }));
    };

    // حذف محطة معينة
    const handleRemoveStop = index => {
        if (formData.stops.length === 1) return;
        const updatedStops = formData.stops.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    // تحديث بيانات محطة معينة
    const handleStopChange = (index, field, value) => {
        const updatedStops = [...formData.stops];
        updatedStops[index][field] = value;
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    // إضافة صورة جديدة لمحطة معينة
    const handleAddImage = stopIndex => {
        const updatedStops = [...formData.stops];
        updatedStops[stopIndex].images.push({ ...initialImage });
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    // حذف صورة من محطة معينة
    const handleRemoveImage = (stopIndex, imgIndex) => {
        const updatedStops = [...formData.stops];
        if (updatedStops[stopIndex].images.length === 1) return;
        updatedStops[stopIndex].images = updatedStops[stopIndex].images.filter(
            (_, i) => i !== imgIndex,
        );
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    // تحديث بيانات صورة معينة داخل المحطة
    const handleImageChange = (stopIndex, imgIndex, field, value) => {
        const updatedStops = [...formData.stops];
        updatedStops[stopIndex].images[imgIndex][field] = value;
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!formData.title || !formData.description) {
            setStatus({
                type: "error",
                message: "يرجى ملء الحقول الأساسية المطلوبة (عنوان الرحلة والوصف)",
            });
            return;
        }

        const hasInvalidStop = formData.stops.some(
            stop => !stop.name.trim(),
        );
        if (hasInvalidStop) {
            setStatus({
                type: "error",
                message: "يرجى إدخال اسم المحطة لجميع المحطات المضافة",
            });
            return;
        }

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            // تجهيز الـ Payload بالشكل المطابق للـ Schema تماماً مع إضافة mapURL لكل محطة
            const payload = {
                eyebrow: formData.eyebrow,
                title: formData.title,
                subtitle: formData.subtitle,
                description: formData.description,
                stops: formData.stops.map(stop => ({
                    id: stop.id || Date.now().toString(),
                    name: stop.name,
                    governorate: stop.governorate,
                    coords: [
                        parseFloat(stop.lat) || 0,
                        parseFloat(stop.lng) || 0,
                    ],
                    mapURL: stop.mapURL,
                    category: stop.category,
                    period: stop.period,
                    short: stop.short,
                    description: stop.description,
                    tip: stop.tip,
                    images: stop.images.map(img => ({
                        src: img.src,
                        alt: img.alt,
                    })),
                })),
            };

            await addTrip(payload);

            setStatus({
                type: "success",
                message: "تمت إضافة الرحلة بنجاح!",
            });

            setFormData({
                eyebrow: "",
                title: "",
                subtitle: "",
                description: "",
                stops: [{ ...initialStop, id: Date.now().toString() }],
            });
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message || "حدث خطأ أثناء الحفظ",
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
                {/* الهيدر */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-3 text-accent mb-2">
                        <Compass className="w-8 h-8" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                            إضافة رحلة جديدة
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm sm:text-base">
                        قم بملء تفاصيل الرحلة الأساسية ومحطات الوقوف التابعة لها بدقة.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* تفاصيل الرحلة الأساسية */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
                            التفاصيل الأساسية للرحلة
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    العنوان التمهيدي (Eyebrow)
                                </label>
                                <input
                                    type="text"
                                    placeholder="مثال: رحلة استكشافية"
                                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                                    value={formData.eyebrow}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            eyebrow: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    عنوان الرحلة الرئيسية (Title) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="مثال: أسرار الحضارة القديمة"
                                    className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                                    value={formData.title}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                العنوان الفرعي (Subtitle)
                            </label>
                            <input
                                type="text"
                                placeholder="مثال: رحلة الأقصر الأثرية — طيبة القديمة"
                                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                                value={formData.subtitle}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        subtitle: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                وصف الرحلة (Description) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                placeholder="اكتب وصفاً شاملاً للرحلة..."
                                rows="3"
                                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent resize-none transition-all text-sm"
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

                    {/* قسم المحطات / الأماكن (Stops) */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-accent" size={22} />
                                <h2 className="text-lg font-bold text-gray-800">
                                    محطات الرحلة ({formData.stops.length})
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddStop}
                                className="bg-accent text-white hover:bg-opacity-90 px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                                <Plus size={18} /> إضافة محطة جديدة
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            {formData.stops.map((stop, stopIndex) => (
                                <div
                                    key={stop.id || stopIndex}
                                    className="p-5 sm:p-6 border border-gray-200 bg-gray-50/40 rounded-2xl relative flex flex-col gap-4 transition-all hover:border-gray-300"
                                >
                                    {/* رأس المحطة */}
                                    <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                                        <span className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg">
                                            المحطة #{stopIndex + 1}
                                        </span>
                                        {formData.stops.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStop(stopIndex)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium cursor-pointer"
                                            >
                                                <Trash2 size={18} />
                                                <span className="hidden sm:inline">حذف المحطة</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* حقول المحطة */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                اسم المحطة (Name) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="مثال: معبد الكرنك"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.name}
                                                onChange={e =>
                                                    handleStopChange(stopIndex, "name", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                المحافظة (Governorate)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="مثال: محافظة الأقصر"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.governorate}
                                                onChange={e =>
                                                    handleStopChange(stopIndex, "governorate", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                التصنيف (Category)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="مثال: temple"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.category}
                                                onChange={e =>
                                                    handleStopChange(stopIndex, "category", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                العصر / الفترة التاريخية (Period)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="مثال: من الدولة الوسطى حتى العصر البطلمي"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.period}
                                                onChange={e =>
                                                    handleStopChange(stopIndex, "period", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    {/* الإحداثيات coords: [Lat, Lng] ورابط الخريطة mapURL */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                خط العرض (Latitude)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="25.7188"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.lat}
                                                onChange={e =>
                                                    handleStopChange(stopIndex, "lat", e.target.value)
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
                                                placeholder="32.6573"
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.lng}
                                                onChange={e =>
                                                    handleStopChange(stopIndex, "lng", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                                <LinkIcon size={14} className="text-accent" />
                                                رابط الخريطة (Map URL)
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://maps.google.com/..."
                                                className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.mapURL}
                                                onChange={e =>
                                                    handleStopChange(stopIndex, "mapURL", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            نبذة مختصرة (Short Description)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="وصف مختصر جداً للمحطة..."
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                            value={stop.short}
                                            onChange={e =>
                                                handleStopChange(stopIndex, "short", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            الوصف التفصيلي (Description)
                                        </label>
                                        <textarea
                                            placeholder="التفاصيل الكاملة للمحطة..."
                                            rows="2"
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent resize-none"
                                            value={stop.description}
                                            onChange={e =>
                                                handleStopChange(stopIndex, "description", e.target.value)
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            نصيحة الزيارة (Tip)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="مثال: يُنصح بالزيارة في الصباح الباكر..."
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                            value={stop.tip}
                                            onChange={e =>
                                                handleStopChange(stopIndex, "tip", e.target.value)
                                            }
                                        />
                                    </div>

                                    {/* قسم صور المحطة الديناميكي (Images) */}
                                    <div className="bg-white/80 p-4 rounded-xl border border-gray-200 flex flex-col gap-3 mt-2">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                <ImageIcon size={16} className="text-accent" />
                                                <span>صور المحطة ({stop.images.length})</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleAddImage(stopIndex)}
                                                className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer"
                                            >
                                                <Plus size={14} /> إضافة صورة
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            {stop.images.map((img, imgIndex) => (
                                                <div key={imgIndex} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                    <input
                                                        type="url"
                                                        placeholder="رابط الصورة (src)"
                                                        className="flex-1 border border-gray-200 bg-white p-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent"
                                                        value={img.src}
                                                        onChange={e =>
                                                            handleImageChange(stopIndex, imgIndex, "src", e.target.value)
                                                        }
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="وصف الصورة (alt)"
                                                        className="flex-1 border border-gray-200 bg-white p-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent"
                                                        value={img.alt}
                                                        onChange={e =>
                                                            handleImageChange(stopIndex, imgIndex, "alt", e.target.value)
                                                        }
                                                    />
                                                    {stop.images.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(stopIndex, imgIndex)}
                                                            className="text-red-500 hover:text-red-700 p-1.5 rounded-md cursor-pointer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* التنبيهات */}
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

                    {/* زر الحفظ */}
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
