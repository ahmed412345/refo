import { TripModel } from "../models/Trip.js";

export const addTrip = async (req, res) => {
    try {
        // سحب كائنات ar و en والمحطات stops من req.body
        const { ar, en, stops } = req.body;

        // التحقق من وجود العنوان الأساسي (مثلاً في العربي أو الإنجليزي)
        if (!ar?.title && !en?.title) {
            return res.status(400).json({ message: "عنوان الرحلة مطلوب بأي لغة على الأقل" });
        }

        // إنشاء الرحلة باستخدام الهيكل الجديد
        const result = await TripModel.create({
            ar: ar || {},
            en: en || {},
            stops: stops || [], // للتأكد أن المحطات ليست undefined
        });

        res.status(201).json({
            message: "تمت إضافة الرحلة بنجاح",
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
