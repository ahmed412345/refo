import { Schema, model } from "mongoose";

const localizedContentSchema = new Schema(
    {
        name: {
            // [ar]: من عمود "museum name arabic"
            // [en]: من عمود "museum name eng"
            type: String,
            required: true,
            trim: true,
        },
        about: {
            // من عمود "about (نبذة مختصرة)" -> نص عربي جاهز، ويُترجم للـ en
            type: String,
            required: true,
            trim: true,
        },
        type: {
            // من عمود "type (تصنيف المتحف)" -> (مثال: متحف أثري / Archaeological Museum)
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            // من عمود "owner (المؤسسة او الجهة التابع لها المتحف)"
            type: String,
            trim: true,
        },
        openingDate: {
            // من عمود "foundation - opening date (تاريخ التأسيس او الافتتاح)"
            type: String,
            trim: true,
        },
        renovationHistory: {
            // من عمود "renovation history (تاريخ التطوير)"
            type: String,
            trim: true,
        },
        capacity: {
            // من عمود "capacity (المساحة الكلية للمتحف )"
            type: String,
            trim: true,
        },
        workingDays: {
            // جديد: أيام العمل (مثال: يومياً طوال أيام الأسبوع / من السبت إلى الخميس)
            type: String,
            trim: true,
        },
        accessibility: {
            // من عمود "accessbility (توفير مسارات لذوى الهمم ، مرشديين)"
            // قسم السطور لعناصر جوه المصفوفة، مثلاً: ["مصعد", "بطاقات برايل", "مدخل بمنحدر"]
            type: [String],
        },
        highlights: {
            // من عمود "أهم ما يميز المتحف"
            // كل ميزة أو نقطة في سطر تتحط كعنصر String في المصفوفة
            type: [String],
        },
        collectionData: [
            // من عمود "collection (تخصص المجموعات المتحفية )"
            {
                name: {
                    // اسم المجموعة الرئيسية أو العصر (مثل: "عصر الدولة القديمة" أو "الفنون الإسلامية")
                    type: String,
                    trim: true,
                },
                description: {
                    // الوصف العام للمجموعة المكتوب في أول الفقرة بالعمود
                    type: String,
                    trim: true,
                },
                subCollection: [
                    // التقسيمات الفرعية المذكورة تحتها (مثل: ["المعادن", "الخزف", "المخطوطات"])
                    String,
                ],
            },
        ],
        eventsAndExhibitions: [
            // من عمود "events and temporary exbihitions ( خدمات أخرى ،المعارض ، ورش العمل ، الانشطة الثقافية )"
            {
                title: {
                    // عنوان المعرض أو النشاط (مثل: "المعارض الدائمة" أو "معارض الخط العربي")
                    type: String,
                    trim: true,
                },
                description: {
                    // الشرح الخاص بالمعرض أو النشاط المذكور بعد العنوان
                    type: String,
                    trim: true,
                },
            },
        ],
    },
    { _id: false }, // لمنع إنشاء _id فرعي للـ ar والـ en
);

const museumSchema = new Schema(
    {
        // 1. البيانات المتغيرة حسب اللغة
        ar: {
            type: localizedContentSchema,
            required: true,
        },
        en: {
            type: localizedContentSchema,
            required: true,
        },

        // 2. البيانات الثابتة (لا تتأثر باللغة)
        locationOnMap: {
            // [غير موجودة كأرقام في الشيت] -> عمود "location on google maps" فيه العنوان نصياً بس
            // هتجيب الإحداثيات [longitude, latitude] من Google Maps باستخدام اسم المتحف
            type: [Number],
            required: true,
        },
        workTime: {
            // تُستخرج الأوقات من النص الموجود في عمود "opening - closing time (مواعيد العمل)"
            open: {
                time: String, // مثال: "09:00 AM"
            },
            close: {
                time: String, // مثال: "05:00 PM"
            },
        },
        ticketsPrice: {
            // تُستخرج الأرقام فقط من النص الموجود في عمود "tickets (أسعار تذاكر الدخول للمصريين ، الاجانب )"
            egyptian: Number, // سعر المصريين الكبار (مثال: 30)
            egyptianStudent: Number, // سعر الطلاب المصريين (مثال: 10)
            foreigner: Number, // سعر الأجانب الكبار (مثال: 550)
            foreignerStudent: Number, // سعر الطلاب الأجانب (مثال: 275)
        },
        pics: [
            // من عمود "pics " (حالياً فاضي في الشيت، هتحط فيه روابط الصور بتاعتك)
            String,
        ],
        keywords: {
            // [إضافة من عندك للبحث] -> كلمات مفتاحية مشتقة من اسم المتحف، نوعه، ومكانه
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

museumSchema.index({ locationOnMap: "2dsphere" });

export default model("Museum", museumSchema);
