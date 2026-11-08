/* Created by Ahmed Eltahan - 2026 */
import { useState, useEffect } from "react";
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
    Globe,
    RotateCcw,
} from "lucide-react";
import { addTrip } from "../services/addTrip";

// مفتاح التخزين في المتصفح
const STORAGE_KEY = "add_trip_draft_data";

// دالة مساعدة لإنشاء صورة جديدة بنسخة مستقلة في الذاكرة
const createInitialImage = () => ({
    src: "",
    alt: { ar: "", en: "" },
});

// دالة مساعدة لإنشاء محطة جديدة بنسخة مستقلة تماماً (Deep Copy)
const createInitialStop = () => ({
    id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
    lat: "",
    lng: "",
    mapURL: "",
    ar: {
        name: "",
        governorate: "",
        category: "",
        period: "", // مستثنى من الإلزام
        short: "",
        description: "",
        tip: "", // مستثنى من الإلزام
    },
    en: {
        name: "",
        governorate: "",
        category: "",
        period: "", // مستثنى من الإلزام
        short: "",
        description: "",
        tip: "", // مستثنى من الإلزام
    },
    images: [createInitialImage()],
});

// دالة لإنشاء الحالة الابتدائية الفارغة للنموذج بالكامل
const getInitialFormData = () => ({
    ar: {
        eyebrow: "",
        title: "",
        subtitle: "",
        description: "",
    },
    en: {
        eyebrow: "",
        title: "",
        subtitle: "",
        description: "",
    },
    stops: [createInitialStop()],
});

const AddNewTripPage = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    // 1. قراءة البيانات المحفوظة من localStorage عند فتح الصفحة لأول مرة
    const [formData, setFormData] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const savedDraft = localStorage.getItem(STORAGE_KEY);
                if (savedDraft) {
                    return JSON.parse(savedDraft);
                }
            } catch (error) {
                console.error("خطأ في استرجاع مسودة الرحلة:", error);
            }
        }
        return getInitialFormData();
    });

    // 2. حفظ التعديلات تلقائياً في localStorage مع كل تغيير في formData
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        } catch (error) {
            console.error("خطأ في حفظ مسودة الرحلة:", error);
        }
    }, [formData]);

    // دالة مسح المسودة يدوياً إذا أراد المستخدم البدء من جديد
    const handleClearDraft = () => {
        localStorage.removeItem(STORAGE_KEY);
        setFormData(getInitialFormData());
        setStatus({ type: "", message: "" });
    };

    // تحديث الحقول الرئيسية للرحلة (ar أو en)
    const handleMainChange = (lang, field, value) => {
        setFormData(prev => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                [field]: value,
            },
        }));
    };

    // إضافة محطة جديدة
    const handleAddStop = () => {
        setFormData(prev => ({
            ...prev,
            stops: [...prev.stops, createInitialStop()],
        }));
    };

    // حذف محطة معينة
    const handleRemoveStop = index => {
        if (formData.stops.length === 1) return;
        const updatedStops = formData.stops.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, stops: updatedStops }));
    };

    // تحديث بيانات محطة معينة (داخل لغة معينة ar أو en، أو الحقول المشتركة)
    const handleStopFieldChange = (index, lang, field, value) => {
        setFormData(prev => {
            const updatedStops = [...prev.stops];
            if (lang === "common") {
                updatedStops[index] = {
                    ...updatedStops[index],
                    [field]: value,
                };
            } else {
                updatedStops[index] = {
                    ...updatedStops[index],
                    [lang]: {
                        ...updatedStops[index][lang],
                        [field]: value,
                    },
                };
            }
            return { ...prev, stops: updatedStops };
        });
    };

    // إضافة صورة جديدة لمحطة معينة
    const handleAddImage = stopIndex => {
        setFormData(prev => {
            const updatedStops = [...prev.stops];
            updatedStops[stopIndex] = {
                ...updatedStops[stopIndex],
                images: [...updatedStops[stopIndex].images, createInitialImage()],
            };
            return { ...prev, stops: updatedStops };
        });
    };

    // حذف صورة من محطة معينة
    const handleRemoveImage = (stopIndex, imgIndex) => {
        setFormData(prev => {
            const updatedStops = [...prev.stops];
            if (updatedStops[stopIndex].images.length === 1) return prev;
            updatedStops[stopIndex] = {
                ...updatedStops[stopIndex],
                images: updatedStops[stopIndex].images.filter((_, i) => i !== imgIndex),
            };
            return { ...prev, stops: updatedStops };
        });
    };

    // تحديث صورة معينة (src أو alt.ar أو alt.en)
    const handleImageChange = (stopIndex, imgIndex, field, value) => {
        setFormData(prev => {
            const updatedStops = [...prev.stops];
            const updatedImages = [...updatedStops[stopIndex].images];

            if (field === "src") {
                updatedImages[imgIndex] = {
                    ...updatedImages[imgIndex],
                    src: value,
                };
            } else {
                updatedImages[imgIndex] = {
                    ...updatedImages[imgIndex],
                    alt: {
                        ...updatedImages[imgIndex].alt,
                        [field]: value,
                    },
                };
            }

            updatedStops[stopIndex] = {
                ...updatedStops[stopIndex],
                images: updatedImages,
            };

            return { ...prev, stops: updatedStops };
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        // 1. التحقق من الحقول الرئيسية (إجبارية بالكامل للغتين)
        const isMainArComplete =
            formData.ar.eyebrow.trim() &&
            formData.ar.title.trim() &&
            formData.ar.subtitle.trim() &&
            formData.ar.description.trim();

        const isMainEnComplete =
            formData.en.eyebrow.trim() &&
            formData.en.title.trim() &&
            formData.en.subtitle.trim() &&
            formData.en.description.trim();

        if (!isMainArComplete || !isMainEnComplete) {
            setStatus({
                type: "error",
                message:
                    "يرجى ملء جميع الحقول الرئيسية للرحلة باللغتين العربية والإنجليزية.",
            });
            return;
        }

        // 2. التحقق من المحطات (جميع الحقول إجبارية عدا tip و period)
        for (let i = 0; i < formData.stops.length; i++) {
            const stop = formData.stops[i];

            // التحقق من الحقول المشتركة للمحطة (الإحداثيات ورابط الخريطة)
            if (!String(stop.lat).trim() || !String(stop.lng).trim() || !stop.mapURL.trim()) {
                setStatus({
                    type: "error",
                    message: `يرجى ملء إحداثيات ورابط الخريطة للمحطة رقم ${i + 1}.`,
                });
                return;
            }

            // التحقق من بيانات المحطة بالعربية (ما عدا period و tip)
            const isStopArComplete =
                stop.ar.name.trim() &&
                stop.ar.governorate.trim() &&
                stop.ar.category.trim() &&
                stop.ar.short.trim() &&
                stop.ar.description.trim();

            // التحقق من بيانات المحطة بالإنجليزية (ما عدا period و tip)
            const isStopEnComplete =
                stop.en.name.trim() &&
                stop.en.governorate.trim() &&
                stop.en.category.trim() &&
                stop.en.short.trim() &&
                stop.en.description.trim();

            if (!isStopArComplete || !isStopEnComplete) {
                setStatus({
                    type: "error",
                    message: `يرجى ملء جميع بيانات المحطة رقم ${i + 1} (العربية والإنجليزية) ما عدا الفترة التاريخية ونصيحة الزيارة فهما اختياريتان.`,
                });
                return;
            }

            // التحقق من الصور الخاصة بالمحطة
            for (let j = 0; j < stop.images.length; j++) {
                const img = stop.images[j];
                if (
                    !img.src.trim() ||
                    !img.alt.ar.trim() ||
                    !img.alt.en.trim()
                ) {
                    setStatus({
                        type: "error",
                        message: `يرجى إدخال رابط ووصف الصورة (عربي وإنجليزي) في المحطة رقم ${i + 1}.`,
                    });
                    return;
                }
            }
        }

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            const payload = {
                ar: formData.ar,
                en: formData.en,
                stops: formData.stops.map(stop => ({
                    id: stop.id || Date.now().toString(),
                    coords: [
                        parseFloat(stop.lat) || 0,
                        parseFloat(stop.lng) || 0,
                    ],
                    mapURL: stop.mapURL,
                    ar: stop.ar,
                    en: stop.en,
                    images: stop.images.map(img => ({
                        src: img.src,
                        alt: {
                            ar: img.alt.ar,
                            en: img.alt.en,
                        },
                    })),
                })),
            };

            await addTrip(payload);

            // 3. مسح المسودة من localStorage وتصفير النموذج بعد نجاح الإرسال
            localStorage.removeItem(STORAGE_KEY);
            setFormData(getInitialFormData());

            setStatus({
                type: "success",
                message: "تمت إضافة الرحلة بنجاح وبدعم كامل للغتين، وتم تفريغ المسودة!",
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 py-10 px-4 sm:px-6 lg:px-8 dir-rtl" dir="rtl">
            <div className="max-w-5xl mx-auto">
                
                {/* الهيدر الفخم */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Compass className="w-8 h-8 animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                لوحة إضافة رحلة ثنائية اللغة
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                أضف تفاصيل رحلتك ومحطاتها باللغتين العربية والإنجليزية (يتم حفظ المسودة تلقائياً).
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleClearDraft}
                            title="تفريغ الحقول والبدء من جديد"
                            className="flex items-center gap-1.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                            <RotateCcw size={15} />
                            <span>تفريغ المسودة</span>
                        </button>
                        <div className="flex items-center gap-2 bg-accent/5 border border-accent/20 px-4 py-2 rounded-xl text-accent text-sm font-bold">
                            <Globe size={18} />
                            <span>عربي / English</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* قسم التفاصيل الأساسية للرحلة */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                            <span className="w-3 h-3 rounded-full bg-accent"></span>
                            <h2 className="text-xl font-bold text-gray-800">
                                1. التفاصيل الأساسية للرحلة (Main Trip Details)
                            </h2>
                        </div>

                        {/* شبكة المدخلات (عربي / إنجليزي جنباً إلى جنب) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* العمود العربي */}
                            <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/60 space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-emerald-700 font-bold text-sm">
                                    <span>🇸🇦 البيانات بالعربية (Arabic)</span>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        العنوان التمهيدي (Eyebrow AR)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="مثال: رحلة استكشافية تاريخية"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                                        value={formData.ar.eyebrow}
                                        onChange={e => handleMainChange("ar", "eyebrow", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        عنوان الرحلة الرئيسية (Title AR) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="مثال: سحر الآثار المصرية القديمة"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all font-medium"
                                        value={formData.ar.title}
                                        onChange={e => handleMainChange("ar", "title", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        العنوان الفرعي (Subtitle AR)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="مثال: جولة شاملة في معابد الأقصر وأسوان"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                                        value={formData.ar.subtitle}
                                        onChange={e => handleMainChange("ar", "subtitle", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        وصف الرحلة (Description AR)
                                    </label>
                                    <textarea
                                        placeholder="اكتب وصفاً تفصيلياً وشيقاً للرحلة باللغة العربية..."
                                        rows="3"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent resize-none text-sm transition-all"
                                        value={formData.ar.description}
                                        onChange={e => handleMainChange("ar", "description", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* العمود الإنجليزي */}
                            <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/60 space-y-4" dir="ltr">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-blue-700 font-bold text-sm" dir="ltr">
                                    <span>🇬🇧 English Data (English)</span>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                        Eyebrow (EN)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Historical Expedition"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all text-left"
                                        value={formData.en.eyebrow}
                                        onChange={e => handleMainChange("en", "eyebrow", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                        Trip Title (EN) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Wonders of Ancient Egypt"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all text-left font-medium"
                                        value={formData.en.title}
                                        onChange={e => handleMainChange("en", "title", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                        Subtitle (EN)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. An immersive tour across Luxor and Aswan"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all text-left"
                                        value={formData.en.subtitle}
                                        onChange={e => handleMainChange("en", "subtitle", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                        Description (EN)
                                    </label>
                                    <textarea
                                        placeholder="Write a comprehensive description in English..."
                                        rows="3"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent resize-none text-sm transition-all text-left"
                                        value={formData.en.description}
                                        onChange={e => handleMainChange("en", "description", e.target.value)}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* قسم المحطات والأماكن (Stops) */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="text-accent" size={22} />
                                <h2 className="text-xl font-bold text-gray-800">
                                    2. محطات الوقوف والمسار ({formData.stops.length})
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddStop}
                                className="bg-accent text-white hover:bg-opacity-90 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                                <Plus size={18} /> إضافة محطة جديدة
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.stops.map((stop, stopIndex) => (
                                <div
                                    key={stop.id || stopIndex}
                                    className="p-5 sm:p-6 border border-gray-200 bg-gray-50/40 rounded-3xl relative flex flex-col gap-6 transition-all hover:border-gray-300 shadow-xs"
                                >
                                    {/* رأس المحطة */}
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                        <span className="text-sm font-black text-accent bg-accent/10 px-3.5 py-1.5 rounded-xl">
                                            المحطة رقم #{stopIndex + 1}
                                        </span>
                                        {formData.stops.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveStop(stopIndex)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 text-sm font-bold cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                                <span>حذف المحطة</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* البيانات المشتركة للمحطة (الإحداثيات ورابط الخريطة) */}
                                    <div className="bg-white p-4 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                خط العرض (Latitude)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="مثال: 25.7188"
                                                className="w-full border border-gray-200 bg-gray-50/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.lat}
                                                onChange={e => handleStopFieldChange(stopIndex, "common", "lat", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                خط الطول (Longitude)
                                            </label>
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="مثال: 32.6573"
                                                className="w-full border border-gray-200 bg-gray-50/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.lng}
                                                onChange={e => handleStopFieldChange(stopIndex, "common", "lng", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                                <LinkIcon size={14} className="text-accent" /> رابط خرائط جوجل (Map URL)
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="https://maps.google.com/..."
                                                className="w-full border border-gray-200 bg-gray-50/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                                value={stop.mapURL}
                                                onChange={e => handleStopFieldChange(stopIndex, "common", "mapURL", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* تفاصيل المحطة (عربي وإنجليزي جنب بعض) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        
                                        {/* محطة عربي */}
                                        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                                            <div className="text-xs font-bold text-emerald-700 border-b pb-2">
                                                🇸🇦 تفاصيل المحطة بالعربية
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">اسم المحطة (Name AR) <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: معبد الكرنك"
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent"
                                                    value={stop.ar.name}
                                                    onChange={e => handleStopFieldChange(stopIndex, "ar", "name", e.target.value)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">المحافظة (Governorate AR)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="مثال: الأقصر"
                                                        className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent"
                                                        value={stop.ar.governorate}
                                                        onChange={e => handleStopFieldChange(stopIndex, "ar", "governorate", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">التصنيف (Category AR)</label>
                                                    <select
                                                        className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent bg-white text-gray-800"
                                                        value={stop.ar.category}
                                                        onChange={e => handleStopFieldChange(stopIndex, "ar", "category", e.target.value)}
                                                    >
                                                        <option value="" disabled>اختر نوع المكان...</option>
                                                        <option value="museum">متحف</option>
                                                        <option value="landmark">معلم سياحي / أثري</option>
                                                        <option value="restaurant">مطعم</option>
                                                        <option value="cafe">مقهى / كافيه</option>
                                                        <option value="park">حديقة عامة</option>
                                                        <option value="beach">شاطئ / كورنيش</option>
                                                        <option value="sweets">متجر حلوى</option>
                                                        <option value="rest_stop">استراحة</option>
                                                        <option value="supermarket">سوبر ماركت</option>
                                                        <option value="mall">مركز تسوق / مول</option>
                                                        <option value="hotel">فندق / مكان إقامة</option>
                                                        <option value="other">أخرى</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">الفترة التاريخية (Period AR)</label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: الدولة الحديثة"
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent"
                                                    value={stop.ar.period}
                                                    onChange={e => handleStopFieldChange(stopIndex, "ar", "period", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">نبذة مختصرة (Short AR)</label>
                                                <input
                                                    type="text"
                                                    placeholder="وصف مختصر جداً..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent"
                                                    value={stop.ar.short}
                                                    onChange={e => handleStopFieldChange(stopIndex, "ar", "short", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">الوصف التفصيلي (Description AR)</label>
                                                <textarea
                                                    rows="2"
                                                    placeholder="تفاصيل المحطة بالعربي..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent resize-none"
                                                    value={stop.ar.description}
                                                    onChange={e => handleStopFieldChange(stopIndex, "ar", "description", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">نصيحة الزيارة (Tip AR)</label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: يُنصح بالزيارة صباحاً..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent"
                                                    value={stop.ar.tip}
                                                    onChange={e => handleStopFieldChange(stopIndex, "ar", "tip", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* محطة إنجليزي */}
                                        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3" dir="ltr">
                                            <div className="text-xs font-bold text-blue-700 border-b pb-2 text-right">
                                                🇬🇧 Stop Details in English
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">Stop Name (Name EN) <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Karnak Temple"
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent text-left"
                                                    value={stop.en.name}
                                                    onChange={e => handleStopFieldChange(stopIndex, "en", "name", e.target.value)}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">Governorate (EN)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Luxor"
                                                        className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent text-left"
                                                        value={stop.en.governorate}
                                                        onChange={e => handleStopFieldChange(stopIndex, "en", "governorate", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">Category (EN)</label>
                                                    <select
                                                        className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent bg-white text-gray-800 text-left"
                                                        value={stop.en.category}
                                                        onChange={e => handleStopFieldChange(stopIndex, "en", "category", e.target.value)}
                                                    >
                                                        <option value="" disabled>Select category...</option>
                                                        <option value="museum">Museum</option>
                                                        <option value="landmark">Landmark / Tourist Spot</option>
                                                        <option value="restaurant">Restaurant</option>
                                                        <option value="cafe">Café</option>
                                                        <option value="park">Park</option>
                                                        <option value="beach">Beach / Corniche</option>
                                                        <option value="sweets">Sweets Shop</option>
                                                        <option value="rest_stop">Rest Stop</option>
                                                        <option value="supermarket">Supermarket</option>
                                                        <option value="mall">Shopping Mall</option>
                                                        <option value="hotel">Hotel</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">Period (Period EN)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. New Kingdom"
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent text-left"
                                                    value={stop.en.period}
                                                    onChange={e => handleStopFieldChange(stopIndex, "en", "period", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">Short Summary (Short EN)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Brief description..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent text-left"
                                                    value={stop.en.short}
                                                    onChange={e => handleStopFieldChange(stopIndex, "en", "short", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">Description (Description EN)</label>
                                                <textarea
                                                    rows="2"
                                                    placeholder="Stop details in English..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent resize-none text-left"
                                                    value={stop.en.description}
                                                    onChange={e => handleStopFieldChange(stopIndex, "en", "description", e.target.value)}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">Visit Tip (Tip EN)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Recommended in early morning..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent text-left"
                                                    value={stop.en.tip}
                                                    onChange={e => handleStopFieldChange(stopIndex, "en", "tip", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {/* قسم صور المحطة (Images with Bilingual Alt) */}
                                    <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                <ImageIcon size={16} className="text-accent" />
                                                <span>صور المحطة ({stop.images.length}) مع الوصف الثنائي</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleAddImage(stopIndex)}
                                                className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer"
                                            >
                                                <Plus size={14} /> إضافة صورة
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            {stop.images.map((img, imgIndex) => (
                                                <div key={imgIndex} className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex flex-col gap-2">
                                                    <input
                                                        type="url"
                                                        placeholder="رابط الصورة المباشر (Image URL src)..."
                                                        className="w-full border border-gray-200 bg-white p-2.5 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent font-mono"
                                                        value={img.src}
                                                        onChange={e => handleImageChange(stopIndex, imgIndex, "src", e.target.value)}
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="وصف الصورة بالعربي (Alt AR)"
                                                            className="border border-gray-200 bg-white p-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent"
                                                            value={img.alt.ar}
                                                            onChange={e => handleImageChange(stopIndex, imgIndex, "ar", e.target.value)}
                                                        />
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Alt English description"
                                                                className="flex-1 border border-gray-200 bg-white p-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent text-left"
                                                                dir="ltr"
                                                                value={img.alt.en}
                                                                onChange={e => handleImageChange(stopIndex, imgIndex, "en", e.target.value)}
                                                            />
                                                            {stop.images.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveImage(stopIndex, imgIndex)}
                                                                    className="text-red-500 hover:text-red-700 p-2 rounded-lg cursor-pointer bg-white border border-gray-200"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* التنبيهات وحالة الإرسال */}
                    {status.message && (
                        <div
                            className={`flex items-center gap-3 p-4 rounded-2xl shadow-xs ${
                                status.type === "success"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            {status.type === "success" ? (
                                <CheckCircle2 size={22} className="shrink-0 text-emerald-600" />
                            ) : (
                                <AlertCircle size={22} className="shrink-0 text-red-600" />
                            )}
                            <span className="text-sm font-bold">
                                {status.message}
                            </span>
                        </div>
                    )}

                    {/* زر الحفظ النهائي */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto min-w-[240px] bg-accent text-white py-4 px-8 rounded-2xl font-black text-base hover:bg-opacity-90 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-70"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={22} />
                                    <span>جاري حفظ ونشر الرحلة...</span>
                                </>
                            ) : (
                                "حفظ ونشر الرحلة باللغتين 🚀"
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddNewTripPage;
