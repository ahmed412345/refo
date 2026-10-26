import { TripModel } from "../models/Trip.js";

export const addTrip = async (req, res) => {
    try {
        // سحب كائنات ar و en والمحطات stops من req.body
        const { ar, en, stops } = req.body;

        // التحقق من وجود العنوان الأساسي (مثلاً في العربي أو الإنجليزي)
        if (!ar?.title && !en?.title) {
            return res.status(400).json({ message: "عنوان الرحلة مطلوب بأي لغة على الأقل" });
        }

        // تجميع الكلمات المفتاحية تلقائياً باستخدام Set لمنع التكرار
        const keywordsSet = new Set();

        // 1. إضافة بيانات الرحلة الرئيسية (العناوين، الـ eyebrow، ووصف الرحلة لو موجود)
        if (ar?.title) keywordsSet.add(ar.title.trim());
        if (ar?.eyebrow) keywordsSet.add(ar.eyebrow.trim());
        if (ar?.subtitle) keywordsSet.add(ar.subtitle.trim());

        if (en?.title) keywordsSet.add(en.title.trim());
        if (en?.eyebrow) keywordsSet.add(en.eyebrow.trim());
        if (en?.subtitle) keywordsSet.add(en.subtitle.trim());

        // 2. المرور على كل المحطات (Stops) وتجميع بياناتها
        const safeStops = stops || [];
        safeStops.forEach(stop => {
            // المحتوى العربي للمحطة
            if (stop.ar) {
                if (stop.ar.name) keywordsSet.add(stop.ar.name.trim());
                if (stop.ar.governorate) keywordsSet.add(stop.ar.governorate.trim());
                if (stop.ar.category) keywordsSet.add(stop.ar.category.trim());
                if (stop.ar.period) keywordsSet.add(stop.ar.period.trim());
            }

            // المحتوى الإنجليزي للمحطة
            if (stop.en) {
                if (stop.en.name) keywordsSet.add(stop.en.name.trim());
                if (stop.en.governorate) keywordsSet.add(stop.en.governorate.trim());
                if (stop.en.category) keywordsSet.add(stop.en.category.trim());
                if (stop.en.period) keywordsSet.add(stop.en.period.trim());
            }
        });

        // تحويل الـ Set إلى مصفوفة (Array) وتصفية أي قيم فارغة
        const finalKeywords = Array.from(keywordsSet).filter(Boolean);

        // إنشاء الرحلة باستخدام الهيكل الجديد مع إدراج الكلمات المفتاحية المجمعة
        const result = await TripModel.create({
            ar: ar || {},
            en: en || {},
            stops: safeStops,
            keywords: finalKeywords,
        });

        res.status(201).json({
            message: "تمت إضافة الرحلة وتوليد الكلمات المفتاحية بنجاح",
            result,
        });
    } catch (error) {
        console.error("Error in addTrip:", error);
        res.status(400).json({
            message: "فشل في إضافة الرحلة",
            error: error.message,
        });
    }
};
