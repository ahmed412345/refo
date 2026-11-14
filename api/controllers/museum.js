import MuseumModel from "../models/Museum.js";

export const addMuseum = async (req, res) => {
    try {
        // 1. شيلنا openingDate و capacity من هنا لأنهم بقوا جوه ar و en
        const { ar, en, locationOnMap, workTime, ticketsPrice, pics } =
            req.body;

        // تحقق من وجود الاسم باللغتين لأنهم required في الـ Schema
        if (!ar?.name || !en?.name) {
            return res.status(400).json({
                message: "اسم المتحف مطلوب باللغتين العربية والإنجليزية",
            });
        }

        // تجميع الكلمات المفتاحية تلقائياً من جميع الحقول العربية والإنجليزية باستخدام Set لمنع التكرار
        const keywordsSet = new Set();

        const collectLocalizedKeywords = (langObj) => {
            if (!langObj) return;

            // الحقول النصية المباشرة (بما فيها الحقول المنقولة والجديدة)
            const stringFields = [
                langObj.name,
                langObj.about,
                langObj.type,
                langObj.owner,
                langObj.openingDate,
                langObj.renovationHistory,
                langObj.capacity,
            ];

            stringFields.forEach((field) => {
                if (typeof field === "string" && field.trim()) {
                    keywordsSet.add(field.trim());
                }
            });

            // الحقول الجديدة اللي من نوع Array of Strings (accessibility & highlights)
            const arrayFields = [langObj.accessibility, langObj.highlights];
            arrayFields.forEach((arr) => {
                if (Array.isArray(arr)) {
                    arr.forEach((item) => {
                        if (typeof item === "string" && item.trim()) {
                            keywordsSet.add(item.trim());
                        }
                    });
                }
            });

            // المرور على المجموعات المتحفية (collectionData)
            if (Array.isArray(langObj.collectionData)) {
                langObj.collectionData.forEach((item) => {
                    if (item?.name) keywordsSet.add(item.name.trim());
                    if (item?.description)
                        keywordsSet.add(item.description.trim());

                    if (Array.isArray(item?.subCollection)) {
                        item.subCollection.forEach((sub) => {
                            if (typeof sub === "string" && sub.trim()) {
                                keywordsSet.add(sub.trim());
                            }
                        });
                    }
                });
            }

            // المرور على الفعاليات والمعارض (eventsAndExhibitions)
            if (Array.isArray(langObj.eventsAndExhibitions)) {
                langObj.eventsAndExhibitions.forEach((event) => {
                    if (event?.title) keywordsSet.add(event.title.trim());
                    if (event?.description)
                        keywordsSet.add(event.description.trim());
                });
            }
        };

        // تجميع بيانات اللغة العربية والإنجليزية
        collectLocalizedKeywords(ar);
        collectLocalizedKeywords(en);

        // تحويل الـ Set إلى مصفوفة وتصفية أي قيم فارغة
        const finalKeywords = Array.from(keywordsSet).filter(Boolean);

        // إنشاء المتحف في قاعدة البيانات
        const result = await MuseumModel.create({
            ar,
            en,
            locationOnMap,
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
