import { TripModel } from "../models/Trip.js";

export const addTrip = async (req, res) => {
    try {
        // سحب القيم مباشرة من req.body
        const { tripTitle, description, locations } = req.body;

        // التحقق من وجود البيانات الأساسية (مثلاً العنوان)
        if (!tripTitle) {
            return res.status(400).json({ message: "عنوان الرحلة مطلوب" });
        }

        // إنشاء الرحلة باستخدام القيم المستخرجة صراحةً
        const result = await TripModel.create({
            tripTitle,
            description,
            locations: locations || [], // للتأكد إنها لو مش موجودة تبقاش undefined
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
