import Source from "../models/Source.js";

import UserSource from "../models/UserSource.js";

export const getSources = async (req, res) => {
    // 1. استخراج وتنظيف الـ Query Parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20)); // حد أقصى للـ limit

    const skip = (page - 1) * limit;

    const { author, year, category, search } = req.query;

    // 2. بناء الفلتر ديناميكيًا (بشكل أفضل)
    const query = {};

    if (author) {
        query.Author = { $regex: author.trim(), $options: "i" };
    }

    if (year) {
        const parsedYear = parseInt(year);
        if (!isNaN(parsedYear)) {
            query.Year = parsedYear;
        }
    }

    if (category) {
        query.Category = category; // لو string عادي، أو استخدم $in لو ممكن يبقى array
    }

    // البحث العام (مهم: نستخدم $and لو في فلاتر أخرى)
    if (search) {
        const searchRegex = { $regex: search.trim(), $options: "i" };

        if (Object.keys(query).length > 0) {
            // لو في فلاتر أخرى → نستخدم $and
            query.$and = [
                query, // الفلاتر القديمة
                { $or: [{ title: searchRegex }, { Summary: searchRegex }] },
            ];
            // نحذف النسخة القديمة من query عشان متتعارضش
            delete query.$or; // لو كان موجود (مش هنا بس احتياط)
        } else {
            query.$or = [{ title: searchRegex }, { Summary: searchRegex }];
        }
    }

    // 3. التنفيذ
    const result = await Source.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(); // أسرع لو مش محتاج Mongoose documents

    const total = await Source.countDocuments(query);

    res.json({
        result,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        currentPage: page,
        limit,
    });
};

export const addSrcFromUser = async (req, res) => {
    const data = req.body;

    const result = await UserSource.create(data);

    res.json({
        result,
    });
};
