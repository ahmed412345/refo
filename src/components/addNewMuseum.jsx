/* Created by Ahmed Eltahan - 2026 */
import { useState, useEffect, useRef } from "react";
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    MapPin,
    Landmark,
    Image as ImageIcon,
    Globe,
    Clock,
    Ticket,
    Layers,
    Calendar,
    Users,
} from "lucide-react";
import { addMuseum } from "../services/addMuseum";

const DRAFT_KEY = "add-museum-draft-v1";

const createCollectionItem = () => ({
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    ar: {
        name: "",
        description: "",
        subCollection: [""],
    },
    en: {
        name: "",
        description: "",
        subCollection: [""],
    },
});

const createEventItem = () => ({
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    ar: {
        title: "",
        description: "",
    },
    en: {
        title: "",
        description: "",
    },
});

const createEmptyForm = () => ({
    ar: {
        name: "",
        about: "",
        type: "",
        owner: "",
    },
    en: {
        name: "",
        about: "",
        type: "",
        owner: "",
    },
    lng: "",
    lat: "",
    openingDate: "",
    capacity: "",
    workTime: {
        open: { time: "" },
        close: { time: "" },
    },
    ticketsPrice: {
        egyptian: "",
        else: "",
    },
    pics: [""],
    collections: [createCollectionItem()],
    events: [createEventItem()],
});

// قراءة المسودة المحفوظة (لو موجودة وسليمة)
const loadDraft = () => {
    try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (
                parsed?.ar &&
                parsed?.en &&
                Array.isArray(parsed.pics) &&
                Array.isArray(parsed.collections) &&
                Array.isArray(parsed.events)
            ) {
                return parsed;
            }
        }
    } catch {
        /* تجاهل أي خطأ وابدأ بنموذج فاضي */
    }
    return createEmptyForm();
};

const AddNewMuseumPage = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const skipNextSave = useRef(false);
    const [formData, setFormData] = useState(loadDraft);

    // حفظ تلقائي للمسودة مع كل تعديل
    useEffect(() => {
        if (skipNextSave.current) {
            skipNextSave.current = false;
            return;
        }
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
        } catch {
            /* التخزين ممتلئ أو ممنوع */
        }
    }, [formData]);

    // تحديث الحقول الرئيسية للمتحف (ar أو en)
    const handleMainChange = (lang, field, value) => {
        setFormData(prev => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                [field]: value,
            },
        }));
    };

    // تحديث الحقول الثابتة المباشرة (lng, lat, openingDate, capacity)
    const handleStaticChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // تحديث مواعيد العمل (open أو close)
    const handleWorkTimeChange = (type, value) => {
        setFormData(prev => ({
            ...prev,
            workTime: {
                ...prev.workTime,
                [type]: { time: value },
            },
        }));
    };

    // تحديث أسعار التذاكر (egyptian أو else)
    const handleTicketPriceChange = (type, value) => {
        setFormData(prev => ({
            ...prev,
            ticketsPrice: {
                ...prev.ticketsPrice,
                [type]: value,
            },
        }));
    };

    // إدارة صور المتحف (pics)
    const handleAddPic = () => {
        setFormData(prev => ({
            ...prev,
            pics: [...prev.pics, ""],
        }));
    };

    const handleRemovePic = index => {
        if (formData.pics.length === 1) return;
        setFormData(prev => ({
            ...prev,
            pics: prev.pics.filter((_, i) => i !== index),
        }));
    };

    const handlePicChange = (index, value) => {
        const updatedPics = [...formData.pics];
        updatedPics[index] = value;
        setFormData(prev => ({ ...prev, pics: updatedPics }));
    };

    // إدارة المقتنيات والمجموعات (collectionData)
    const handleAddCollection = () => {
        setFormData(prev => ({
            ...prev,
            collections: [...prev.collections, createCollectionItem()],
        }));
    };

    const handleRemoveCollection = index => {
        if (formData.collections.length === 1) return;
        setFormData(prev => ({
            ...prev,
            collections: prev.collections.filter((_, i) => i !== index),
        }));
    };

    const handleCollectionFieldChange = (index, lang, field, value) => {
        setFormData(prev => {
            const updated = [...prev.collections];
            updated[index] = {
                ...updated[index],
                [lang]: {
                    ...updated[index][lang],
                    [field]: value,
                },
            };
            return { ...prev, collections: updated };
        });
    };

    // إدارة العناصر الفرعية داخل كل مجموعة (subCollection)
    const handleAddSubCollection = (colIndex, lang) => {
        setFormData(prev => {
            const updated = [...prev.collections];
            updated[colIndex] = {
                ...updated[colIndex],
                [lang]: {
                    ...updated[colIndex][lang],
                    subCollection: [
                        ...updated[colIndex][lang].subCollection,
                        "",
                    ],
                },
            };
            return { ...prev, collections: updated };
        });
    };

    const handleRemoveSubCollection = (colIndex, lang, subIndex) => {
        setFormData(prev => {
            const updated = [...prev.collections];
            if (updated[colIndex][lang].subCollection.length === 1) return prev;
            updated[colIndex] = {
                ...updated[colIndex],
                [lang]: {
                    ...updated[colIndex][lang],
                    subCollection: updated[colIndex][lang].subCollection.filter(
                        (_, i) => i !== subIndex,
                    ),
                },
            };
            return { ...prev, collections: updated };
        });
    };

    const handleSubCollectionChange = (colIndex, lang, subIndex, value) => {
        setFormData(prev => {
            const updated = [...prev.collections];
            const updatedSubs = [...updated[colIndex][lang].subCollection];
            updatedSubs[subIndex] = value;
            updated[colIndex] = {
                ...updated[colIndex],
                [lang]: {
                    ...updated[colIndex][lang],
                    subCollection: updatedSubs,
                },
            };
            return { ...prev, collections: updated };
        });
    };

    // إدارة الفعاليات والمعارض (eventsAndExhibitions)
    const handleAddEvent = () => {
        setFormData(prev => ({
            ...prev,
            events: [...prev.events, createEventItem()],
        }));
    };

    const handleRemoveEvent = index => {
        if (formData.events.length === 1) return;
        setFormData(prev => ({
            ...prev,
            events: prev.events.filter((_, i) => i !== index),
        }));
    };

    const handleEventFieldChange = (index, lang, field, value) => {
        setFormData(prev => {
            const updated = [...prev.events];
            updated[index] = {
                ...updated[index],
                [lang]: {
                    ...updated[index][lang],
                    [field]: value,
                },
            };
            return { ...prev, events: updated };
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        // 1. التحقق من الحقول الأساسية للمتحف باللغتين العربية والإنجليزية
        const isMainArComplete =
            formData.ar.name.trim() &&
            formData.ar.about.trim() &&
            formData.ar.type.trim() &&
            formData.ar.owner.trim();

        const isMainEnComplete =
            formData.en.name.trim() &&
            formData.en.about.trim() &&
            formData.en.type.trim() &&
            formData.en.owner.trim();

        if (!isMainArComplete || !isMainEnComplete) {
            setStatus({
                type: "error",
                message:
                    "يرجى ملء جميع البيانات الأساسية للمتحف (الاسم، النبذة، النوع، والجهة المالكة) باللغتين العربية والإنجليزية.",
            });
            return;
        }

        // 2. التحقق من الإحداثيات الجغرافية (locationOnMap: [longitude, latitude])
        const lngNum = parseFloat(formData.lng);
        const latNum = parseFloat(formData.lat);
        if (
            !String(formData.lng).trim() ||
            !String(formData.lat).trim() ||
            Number.isNaN(lngNum) ||
            Number.isNaN(latNum) ||
            lngNum < -180 ||
            lngNum > 180 ||
            latNum < -90 ||
            latNum > 90
        ) {
            setStatus({
                type: "error",
                message:
                    "يرجى إدخال إحداثيات صحيحة للموقع على الخريطة (خط الطول بين -180 و 180، وخط العرض بين -90 و 90).",
            });
            return;
        }

        // 3. التحقق من البيانات الثابتة (تاريخ الافتتاح، السعة، مواعيد العمل، أسعار التذاكر)
        if (
            !formData.openingDate.trim() ||
            !String(formData.capacity).trim() ||
            !formData.workTime.open.time.trim() ||
            !formData.workTime.close.time.trim() ||
            !String(formData.ticketsPrice.egyptian).trim() ||
            !String(formData.ticketsPrice.else).trim()
        ) {
            setStatus({
                type: "error",
                message:
                    "يرجى استكمال كافة البيانات الثابتة (تاريخ الافتتاح، السعة الاستيعابية، مواعيد الفتح والإغلاق، وأسعار التذاكر).",
            });
            return;
        }

        // 4. التحقق من صور المتحف (pics)
        for (let i = 0; i < formData.pics.length; i++) {
            if (!formData.pics[i].trim()) {
                setStatus({
                    type: "error",
                    message: `يرجى إدخال رابط الصورة رقم ${i + 1} أو حذف الحقل الفارغ.`,
                });
                return;
            }
        }

        // 5. التحقق من المجموعات والمقتنيات (collectionData)
        for (let i = 0; i < formData.collections.length; i++) {
            const col = formData.collections[i];
            const isColArValid =
                col.ar.name.trim() &&
                col.ar.description.trim() &&
                col.ar.subCollection.every(sub => sub.trim() !== "");
            const isColEnValid =
                col.en.name.trim() &&
                col.en.description.trim() &&
                col.en.subCollection.every(sub => sub.trim() !== "");

            if (!isColArValid || !isColEnValid) {
                setStatus({
                    type: "error",
                    message: `يرجى ملء كافة بيانات المجموعة رقم ${i + 1} (الاسم، الوصف، والمقتنيات الفرعية) باللغتين العربية والإنجليزية.`,
                });
                return;
            }
        }

        // 6. التحقق من الفعاليات والمعارض (eventsAndExhibitions)
        for (let i = 0; i < formData.events.length; i++) {
            const ev = formData.events[i];
            const isEvArValid =
                ev.ar.title.trim() && ev.ar.description.trim();
            const isEvEnValid =
                ev.en.title.trim() && ev.en.description.trim();

            if (!isEvArValid || !isEvEnValid) {
                setStatus({
                    type: "error",
                    message: `يرجى ملء عنوان ووصف الفعالية / المعرض رقم ${i + 1} باللغتين العربية والإنجليزية.`,
                });
                return;
            }
        }

        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            // تجهيز البيانات بنفس هيكل اسكيما Museum.js تماماً
            const payload = {
                ar: {
                    name: formData.ar.name.trim(),
                    about: formData.ar.about.trim(),
                    type: formData.ar.type.trim(),
                    owner: formData.ar.owner.trim(),
                    collectionData: formData.collections.map(col => ({
                        name: col.ar.name.trim(),
                        description: col.ar.description.trim(),
                        subCollection: col.ar.subCollection
                            .map(s => s.trim())
                            .filter(Boolean),
                    })),
                    eventsAndExhibitions: formData.events.map(ev => ({
                        title: ev.ar.title.trim(),
                        description: ev.ar.description.trim(),
                    })),
                },
                en: {
                    name: formData.en.name.trim(),
                    about: formData.en.about.trim(),
                    type: formData.en.type.trim(),
                    owner: formData.en.owner.trim(),
                    collectionData: formData.collections.map(col => ({
                        name: col.en.name.trim(),
                        description: col.en.description.trim(),
                        subCollection: col.en.subCollection
                            .map(s => s.trim())
                            .filter(Boolean),
                    })),
                    eventsAndExhibitions: formData.events.map(ev => ({
                        title: ev.en.title.trim(),
                        description: ev.en.description.trim(),
                    })),
                },
                locationOnMap: [lngNum, latNum], // [longitude, latitude]
                openingDate: formData.openingDate.trim(),
                capacity: Number(formData.capacity),
                workTime: {
                    open: { time: formData.workTime.open.time.trim() },
                    close: { time: formData.workTime.close.time.trim() },
                },
                ticketsPrice: {
                    egyptian: Number(formData.ticketsPrice.egyptian),
                    else: Number(formData.ticketsPrice.else),
                },
                pics: formData.pics.map(p => p.trim()).filter(Boolean),
            };

            await addMuseum(payload);

            setStatus({
                type: "success",
                message:
                    "تمت إضافة بيانات المتحف وتوليد الكلمات المفتاحية بنجاح وبدعم كامل للغتين!",
            });

            // مسح المسودة وتفريغ النموذج بعد النجاح
            try {
                localStorage.removeItem(DRAFT_KEY);
            } catch {
                /* تجاهل */
            }
            skipNextSave.current = true;
            setFormData(createEmptyForm());
        } catch (error) {
            setStatus({
                type: "error",
                message: error.message || "حدث خطأ أثناء حفظ بيانات المتحف",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100/50 to-gray-50 py-10 px-4 sm:px-6 lg:px-8 dir-rtl"
            dir="rtl"
        >
            <div className="max-w-5xl mx-auto">
                {/* الهيدر الفخم */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Landmark className="w-8 h-8 animate-pulse" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                لوحة إضافة متحف ثنائي اللغة
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                أضف بيانات المتحف ومقتنياته وفعالياته باللغتين
                                العربية والإنجليزية مع توليد تلقائي للكلمات
                                المفتاحية.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-accent/5 border border-accent/20 px-4 py-2 rounded-xl text-accent text-sm font-bold">
                        <Globe size={18} />
                        <span>عربي / English</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 1. قسم التفاصيل الأساسية للمتحف */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                            <span className="w-3 h-3 rounded-full bg-accent"></span>
                            <h2 className="text-xl font-bold text-gray-800">
                                1. البيانات الأساسية للمتحف (Main Museum
                                Details)
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* العمود العربي */}
                            <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/60 space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-emerald-700 font-bold text-sm">
                                    <span>🇸🇦 البيانات بالعربية (Arabic)</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        اسم المتحف (Name AR){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="مثال: المتحف المصري الكبير"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all font-medium"
                                        value={formData.ar.name}
                                        onChange={e =>
                                            handleMainChange(
                                                "ar",
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            نوع المتحف (Type AR){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="مثال: أثري / تاريخي"
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                                            value={formData.ar.type}
                                            onChange={e =>
                                                handleMainChange(
                                                    "ar",
                                                    "type",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            الجهة المالكة (Owner AR){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="مثال: وزارة السياحة والآثار"
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all"
                                            value={formData.ar.owner}
                                            onChange={e =>
                                                handleMainChange(
                                                    "ar",
                                                    "owner",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                                        نبذة عن المتحف (About AR){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        placeholder="اكتب نبذة شاملة عن تاريخ وأهمية المتحف باللغة العربية..."
                                        rows="4"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent resize-none text-sm transition-all"
                                        value={formData.ar.about}
                                        onChange={e =>
                                            handleMainChange(
                                                "ar",
                                                "about",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* العمود الإنجليزي */}
                            <div
                                className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/60 space-y-4"
                                dir="ltr"
                            >
                                <div
                                    className="flex items-center justify-between border-b border-gray-200 pb-2 text-blue-700 font-bold text-sm"
                                    dir="ltr"
                                >
                                    <span>🇬🇧 English Data (English)</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                        Museum Name (EN){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Grand Egyptian Museum"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all text-left font-medium"
                                        value={formData.en.name}
                                        onChange={e =>
                                            handleMainChange(
                                                "en",
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                            Museum Type (EN){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Archaeological / Historical"
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all text-left"
                                            value={formData.en.type}
                                            onChange={e =>
                                                handleMainChange(
                                                    "en",
                                                    "type",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                            Owner / Authority (EN){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Ministry of Tourism and Antiquities"
                                            className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent text-sm transition-all text-left"
                                            value={formData.en.owner}
                                            onChange={e =>
                                                handleMainChange(
                                                    "en",
                                                    "owner",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                        About Museum (EN){" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        placeholder="Write a comprehensive overview of the museum in English..."
                                        rows="4"
                                        className="w-full border border-gray-200 bg-white p-3 rounded-xl outline-none focus:ring-2 focus:ring-accent resize-none text-sm transition-all text-left"
                                        value={formData.en.about}
                                        onChange={e =>
                                            handleMainChange(
                                                "en",
                                                "about",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. قسم البيانات الثابتة (الموقع، المواعيد، التذاكر، السعة) */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
                            <MapPin className="text-accent" size={22} />
                            <h2 className="text-xl font-bold text-gray-800">
                                2. الموقع والمواعيد والبيانات الثابتة (Static
                                Details)
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* خط الطول Longitude */}
                            <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-200/60">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    خط الطول (Longitude){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="مثال: 31.1225"
                                    className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                    value={formData.lng}
                                    onChange={e =>
                                        handleStaticChange(
                                            "lng",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            {/* خط العرض Latitude */}
                            <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-200/60">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    خط العرض (Latitude){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    placeholder="مثال: 29.9942"
                                    className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                    value={formData.lat}
                                    onChange={e =>
                                        handleStaticChange(
                                            "lat",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            {/* تاريخ الافتتاح */}
                            <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-200/60">
                                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                    <Calendar
                                        size={14}
                                        className="text-accent"
                                    />
                                    تاريخ الافتتاح (Opening Date){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="مثال: 1902 أو 2025-11-01"
                                    className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                    value={formData.openingDate}
                                    onChange={e =>
                                        handleStaticChange(
                                            "openingDate",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            {/* السعة الاستيعابية */}
                            <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-200/60">
                                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                                    <Users size={14} className="text-accent" />
                                    السعة الاستيعابية (Capacity){" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="مثال: 15000"
                                    className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                    value={formData.capacity}
                                    onChange={e =>
                                        handleStaticChange(
                                            "capacity",
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* مواعيد العمل وأسعار التذاكر */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* مواعيد العمل */}
                            <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/60 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-200 pb-2">
                                    <Clock size={18} className="text-accent" />
                                    <span>مواعيد العمل (Work Time)</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            موعد الفتح (Open Time){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="مثال: 09:00 AM"
                                            className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                            value={formData.workTime.open.time}
                                            onChange={e =>
                                                handleWorkTimeChange(
                                                    "open",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            موعد الإغلاق (Close Time){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="مثال: 05:00 PM"
                                            className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                            value={formData.workTime.close.time}
                                            onChange={e =>
                                                handleWorkTimeChange(
                                                    "close",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* أسعار التذاكر */}
                            <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/60 space-y-3">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 border-b border-gray-200 pb-2">
                                    <Ticket size={18} className="text-accent" />
                                    <span>أسعار التذاكر (Tickets Price)</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            سعر تذكرة المصريين (Egyptian){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder="مثال: 200"
                                            className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                            value={
                                                formData.ticketsPrice.egyptian
                                            }
                                            onChange={e =>
                                                handleTicketPriceChange(
                                                    "egyptian",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">
                                            سعر تذكرة الأجانب (Foreigners /
                                            Else){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="any"
                                            placeholder="مثال: 1200"
                                            className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-accent"
                                            value={formData.ticketsPrice.else}
                                            onChange={e =>
                                                handleTicketPriceChange(
                                                    "else",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* صور المتحف (pics) */}
                        <div className="bg-gray-50/60 p-5 rounded-2xl border border-gray-200/60 space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                    <ImageIcon
                                        size={18}
                                        className="text-accent"
                                    />
                                    <span>
                                        صور المتحف ({formData.pics.length})
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddPic}
                                    className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer"
                                >
                                    <Plus size={14} /> إضافة رابط صورة
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.pics.map((picUrl, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="url"
                                            placeholder={`رابط الصورة المباشر رقم #${index + 1} (https://...) *`}
                                            className="flex-1 border border-gray-200 bg-white p-2.5 rounded-xl text-xs outline-none focus:ring-2 focus:ring-accent font-mono"
                                            dir="ltr"
                                            value={picUrl}
                                            onChange={e =>
                                                handlePicChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {formData.pics.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemovePic(index)
                                                }
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2.5 rounded-xl transition-colors cursor-pointer bg-white border border-gray-200"
                                                title="حذف الصورة"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. قسم المجموعات والمقتنيات (collectionData) */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <Layers className="text-accent" size={22} />
                                <h2 className="text-xl font-bold text-gray-800">
                                    3. المجموعات والمقتنيات الأثرية (
                                    {formData.collections.length})
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddCollection}
                                className="bg-accent text-white hover:bg-opacity-90 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                                <Plus size={18} /> إضافة مجموعة مقتنيات جديدة
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.collections.map((col, colIndex) => (
                                <div
                                    key={col.id || colIndex}
                                    className="p-5 sm:p-6 border border-gray-200 bg-gray-50/40 rounded-3xl relative flex flex-col gap-6 transition-all hover:border-gray-300 shadow-xs"
                                >
                                    {/* رأس المجموعة */}
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                        <span className="text-sm font-black text-accent bg-accent/10 px-3.5 py-1.5 rounded-xl">
                                            المجموعة رقم #{colIndex + 1}
                                        </span>
                                        {formData.collections.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveCollection(
                                                        colIndex,
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 text-sm font-bold cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                                <span>حذف المجموعة</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* بيانات المجموعة عربي وإنجليزي */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* المجموعة بالعربية */}
                                        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                                            <div className="text-xs font-bold text-emerald-700 border-b pb-2">
                                                🇸🇦 بيانات المجموعة بالعربية
                                                (Collection AR)
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                    اسم المجموعة (Name AR){" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: كنوز الملك توت عنخ آمون"
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent"
                                                    value={col.ar.name}
                                                    onChange={e =>
                                                        handleCollectionFieldChange(
                                                            colIndex,
                                                            "ar",
                                                            "name",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                    وصف المجموعة (Description
                                                    AR){" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    placeholder="اكتب وصفاً للمجموعة ومحتوياتها بالعربية..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent resize-none"
                                                    value={col.ar.description}
                                                    onChange={e =>
                                                        handleCollectionFieldChange(
                                                            colIndex,
                                                            "ar",
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* المقتنيات الفرعية بالعربية (subCollection AR) */}
                                            <div className="pt-2 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-xs font-semibold text-gray-600">
                                                        المقتنيات الفرعية
                                                        (Sub-Collection AR){" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAddSubCollection(
                                                                colIndex,
                                                                "ar",
                                                            )
                                                        }
                                                        className="text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Plus size={12} /> إضافة
                                                        مقتنى فرعي
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    {col.ar.subCollection.map(
                                                        (sub, subIndex) => (
                                                            <div
                                                                key={subIndex}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    placeholder={`مقتنى فرعي #${subIndex + 1} (مثال: القناع الذهبي)`}
                                                                    className="flex-1 border border-gray-200 bg-gray-50/50 p-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent"
                                                                    value={sub}
                                                                    onChange={e =>
                                                                        handleSubCollectionChange(
                                                                            colIndex,
                                                                            "ar",
                                                                            subIndex,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                {col.ar
                                                                    .subCollection
                                                                    .length >
                                                                    1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemoveSubCollection(
                                                                                colIndex,
                                                                                "ar",
                                                                                subIndex,
                                                                            )
                                                                        }
                                                                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg bg-white border border-gray-200 cursor-pointer"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* المجموعة بالإنجليزية */}
                                        <div
                                            className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3"
                                            dir="ltr"
                                        >
                                            <div className="text-xs font-bold text-blue-700 border-b pb-2 text-right">
                                                🇬🇧 Collection Details in English
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                                    Collection Name (EN){" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Treasures of King Tutankhamun"
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent text-left"
                                                    value={col.en.name}
                                                    onChange={e =>
                                                        handleCollectionFieldChange(
                                                            colIndex,
                                                            "en",
                                                            "name",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                                    Collection Description (EN){" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    placeholder="Describe the collection in English..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent resize-none text-left"
                                                    value={col.en.description}
                                                    onChange={e =>
                                                        handleCollectionFieldChange(
                                                            colIndex,
                                                            "en",
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* المقتنيات الفرعية بالإنجليزية (subCollection EN) */}
                                            <div className="pt-2 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAddSubCollection(
                                                                colIndex,
                                                                "en",
                                                            )
                                                        }
                                                        className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
                                                    >
                                                        <Plus size={12} /> Add
                                                        Sub-item
                                                    </button>
                                                    <label className="text-xs font-semibold text-gray-600">
                                                        Sub-Collection (EN){" "}
                                                        <span className="text-red-500">
                                                            *
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className="space-y-2">
                                                    {col.en.subCollection.map(
                                                        (sub, subIndex) => (
                                                            <div
                                                                key={subIndex}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    placeholder={`Sub-item #${subIndex + 1} (e.g. Golden Mask)`}
                                                                    className="flex-1 border border-gray-200 bg-gray-50/50 p-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent text-left"
                                                                    value={sub}
                                                                    onChange={e =>
                                                                        handleSubCollectionChange(
                                                                            colIndex,
                                                                            "en",
                                                                            subIndex,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                {col.en
                                                                    .subCollection
                                                                    .length >
                                                                    1 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemoveSubCollection(
                                                                                colIndex,
                                                                                "en",
                                                                                subIndex,
                                                                            )
                                                                        }
                                                                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg bg-white border border-gray-200 cursor-pointer"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. قسم الفعاليات والمعارض (eventsAndExhibitions) */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="text-accent" size={22} />
                                <h2 className="text-xl font-bold text-gray-800">
                                    4. الفعاليات والمعارض (
                                    {formData.events.length})
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddEvent}
                                className="bg-accent text-white hover:bg-opacity-90 px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                                <Plus size={18} /> إضافة فعالية / معرض جديد
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.events.map((ev, evIndex) => (
                                <div
                                    key={ev.id || evIndex}
                                    className="p-5 sm:p-6 border border-gray-200 bg-gray-50/40 rounded-3xl relative flex flex-col gap-6 transition-all hover:border-gray-300 shadow-xs"
                                >
                                    {/* رأس الفعالية */}
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                                        <span className="text-sm font-black text-accent bg-accent/10 px-3.5 py-1.5 rounded-xl">
                                            الفعالية / المعرض رقم #{evIndex + 1}
                                        </span>
                                        {formData.events.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveEvent(evIndex)
                                                }
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 text-sm font-bold cursor-pointer"
                                            >
                                                <Trash2 size={16} />
                                                <span>حذف الفعالية</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* تفاصيل الفعالية عربي وإنجليزي */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* الفعالية بالعربية */}
                                        <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                                            <div className="text-xs font-bold text-emerald-700 border-b pb-2">
                                                🇸🇦 تفاصيل الفعالية بالعربية
                                                (Event AR)
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                    عنوان الفعالية / المعرض
                                                    (Title AR){" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="مثال: معرض الآثار الغارقة المؤقت"
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent"
                                                    value={ev.ar.title}
                                                    onChange={e =>
                                                        handleEventFieldChange(
                                                            evIndex,
                                                            "ar",
                                                            "title",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                                    وصف الفعالية / المعرض
                                                    (Description AR){" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    placeholder="تفاصيل الفعالية أو المعرض بالعربية..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent resize-none"
                                                    value={ev.ar.description}
                                                    onChange={e =>
                                                        handleEventFieldChange(
                                                            evIndex,
                                                            "ar",
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* الفعالية بالإنجليزية */}
                                        <div
                                            className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3"
                                            dir="ltr"
                                        >
                                            <div className="text-xs font-bold text-blue-700 border-b pb-2 text-right">
                                                🇬🇧 Event / Exhibition in English
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                                    Event / Exhibition Title
                                                    (EN){" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Sunken Cities Temporary Exhibition"
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent text-left"
                                                    value={ev.en.title}
                                                    onChange={e =>
                                                        handleEventFieldChange(
                                                            evIndex,
                                                            "en",
                                                            "title",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1 text-right">
                                                    Event Description (EN){" "}
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                </label>
                                                <textarea
                                                    rows="2"
                                                    placeholder="Event details in English..."
                                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-1 focus:ring-accent resize-none text-left"
                                                    value={ev.en.description}
                                                    onChange={e =>
                                                        handleEventFieldChange(
                                                            evIndex,
                                                            "en",
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
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
                                <CheckCircle2
                                    size={22}
                                    className="shrink-0 text-emerald-600"
                                />
                            ) : (
                                <AlertCircle
                                    size={22}
                                    className="shrink-0 text-red-600"
                                />
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
                                    <Loader2
                                        className="animate-spin"
                                        size={22}
                                    />
                                    <span>جاري حفظ ونشر بيانات المتحف...</span>
                                </>
                            ) : (
                                "حفظ ونشر بيانات المتحف باللغتين 🏛️"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewMuseumPage;
