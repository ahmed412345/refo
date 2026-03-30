import Source from "../models/Source.js";

import UserSource from "../models/UserSource.js";

export const getSources = async (req, res) => {
    try {
        // 1. استخراج وتنظيف الـ Query Parameters
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const { author, year, category, search } = req.query;

        // 2. بناء المصفوفة التي ستحتوي على كل الشروط (Filters)
        const filters = [];

        // فلتر المؤلف
        if (author) {
            filters.push({ Author: { $regex: author.trim(), $options: "i" } });
        }

        // فلتر السنة
        if (year) {
            const parsedYear = parseInt(year);
            if (!isNaN(parsedYear)) {
                filters.push({ Year: parsedYear });
            }
        }

        // فلتر التصنيف
        if (category) {
            filters.push({ Category: category });
        }

        // فلتر البحث العام (العنوان أو الملخص)
        if (search) {
            const searchRegex = { $regex: search.trim(), $options: "i" };
            filters.push({
                $or: [
                    { title: searchRegex },
                    { Summary: searchRegex }
                ]
            });
        }

        // 3. تحديد الـ Query النهائي
        // إذا كانت المصفوفة تحتوي على شروط، نستخدم $and للربط بينهم، وإلا نرسل كائن فارغ {}
        const finalQuery = filters.length > 0 ? { $and: filters } : {};

        // 4. التنفيذ في قاعدة البيانات
        // تم استخدام .lean() لتحسين الأداء وتجنب مشاكل الـ Memory مع Documents الكبيرة
        const [result, total] = await Promise.all([
            Source.find(finalQuery)
                .sort({ serial_number: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Source.countDocuments(finalQuery)
        ]);

        // 5. إرسال الرد
        res.json({
            result,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            currentPage: page,
            limit,
        });

    } catch (error) {
        console.error("Error in getSources:", error);
        res.status(500).json({ message: "حدث خطأ أثناء جلب البيانات", error: error.message });
    }
};

export const addSrcFromUser = async (req, res) => {
    const data = req.body;

    const result = await UserSource.create(data);

    res.json({
        result,
    });
};
