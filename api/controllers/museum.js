import MuseumModel from "../models/Museum.js";

export const addMuseum = async (req, res) => {
    try {
        const {
            ar,
            en,
            locationOnMap,
            openingDate,
            capacity,
            workTime,
            ticketsPrice,
            pics,
        } = req.body;

        // تحقق بسيط من وجود اسم المتحف بأي لغة على الأقل
        if (!ar?.name && !en?.name) {
            return res
                .status(400)
                .json({ message: "اسم المتحف مطلوب بأي لغة على الأقل" });
        }

        // تجميع الكلمات المفتاحية تلقائياً من جميع الحقول العربية والإنجليزية باستخدام Set لمنع التكرار
        const keywordsSet = new Set();

        const collectLocalizedKeywords = langObj => {
            if (!langObj) return;

            if (langObj.name) keywordsSet.add(langObj.name.trim());
            if (langObj.about) keywordsSet.add(langObj.about.trim());
            if (langObj.type) keywordsSet.add(langObj.type.trim());
            if (langObj.owner) keywordsSet.add(langObj.owner.trim());

            // المرور على المقتنيات والمجموعات (collectionData)
            if (Array.isArray(langObj.collectionData)) {
                langObj.collectionData.forEach(item => {
                    if (item?.name) keywordsSet.add(item.name.trim());
                    if (item?.description)
                        keywordsSet.add(item.description.trim());

                    if (Array.isArray(item?.subCollection)) {
                        item.subCollection.forEach(sub => {
                            if (typeof sub === "string" && sub.trim()) {
                                keywordsSet.add(sub.trim());
                            }
                        });
                    }
                });
            }

            // المرور على الفعاليات والمعارض (eventsAndExhibitions)
            if (Array.isArray(langObj.eventsAndExhibitions)) {
                langObj.eventsAndExhibitions.forEach(event => {
                    if (event?.title) keywordsSet.add(event.title.trim());
                    if (event?.description)
                        keywordsSet.add(event.description.trim());
                });
            }
        };

        // 1. تجميع بيانات اللغة العربية والإنجليزية
        collectLocalizedKeywords(ar);
        collectLocalizedKeywords(en);

        // 2. إضافة تاريخ الافتتاح إن وُجد
        if (openingDate && typeof openingDate === "string" && openingDate.trim()) {
            keywordsSet.add(openingDate.trim());
        }

        // تحويل الـ Set إلى مصفوفة وتصفية أي قيم فارغة
        const finalKeywords = Array.from(keywordsSet).filter(Boolean);

        // إنشاء المتحف في قاعدة البيانات
        const result = await MuseumModel.create({
            ar: ar || {},
            en: en || {},
            locationOnMap,
            openingDate,
            capacity,
            workTime,
            ticketsPrice,
            pics: pics || [],
            keywords: finalKeywords,
        });

        res.status(201).json({
            message: "تمت إضافة المتحف وتوليد الكلمات المفتاحية بنجاح",
            result,
        });
    } catch (error) {
        console.error("Error in addMuseum:", error);
        res.status(400).json({
            message: "فشل في إضافة المتحف",
            error: error.message,
        });
    }
};
