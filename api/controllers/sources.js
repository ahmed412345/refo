import Source from "../models/Source.js";

export const getSources = async (req, res) => {
    // 1. استخراج معاملات الفلترة والصفحة من الـ Query
    const { page = 1, author, year, category, search } = req.query;

    const limit = 20;
    const skip = (parseInt(page) - 1) * limit;

    // 2. بناء كائن الفلترة ديناميكياً
    let query = {};

    // فلترة بالمؤلف (إذا أُرسل في الطلب)
    if (author) {
        query.Author = { $regex: author, $options: "i" }; // بحث مرن غير حساس لحالة الأحرف
    }

    // فلترة بالسنة
    if (year) {
        query.Year = parseInt(year);
    }

    // فلترة بالتصنيف
    if (category) {
        query.Category = category;
    }

    // بحث عام بالاسم أو المحتوى (Text Search)
    if (search) {
        query.$or = [{ title: { $regex: search, $options: "i" } }, { Summary: { $regex: search, $options: "i" } }];
    }
    // 3. التنفيذ: نطبق الفلترة ثم الـ Pagination
    const result = await Source.find(query)
        .sort({ createdAt: -1 }) // ترتيب الأحدث أولاً
        .skip(skip)
        .limit(limit);

    // 4. حساب الإجمالي بناءً على الفلترة وليس كل المستندات
    const total = await Source.countDocuments(query);

    res.json({
        result,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        currentPage: parseInt(page),
    });
};
