import { TripModel } from "../models/Trip.js";

export const addTrip = async (req, res) => {
    try {
        // سحب القيم الجديدة مباشرة من req.body بناءً على الـ Schema الأخيرة
        const { eyebrow, title, subtitle, description, stops } = req.body;

        // التحقق من وجود العنوان الأساسي
        if (!title) {
            return res.status(400).json({ message: "عنوان الرحلة مطلوب" });
        }

        // إنشاء الرحلة باستخدام الحقول الجديدة
        const result = await TripModel.create({
            eyebrow,
            title,
            subtitle,
            description,
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
