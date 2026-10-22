import { TripModel } from "../models/Trip";

export const addTrip = async (req, res) => {
    try {
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ message: "البيانات المطلوبة ناقصة" });
        }

        const result = await TripModel.create(data);

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
