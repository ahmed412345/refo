/* Created by Ahmed Eltahan - 2026 */
import Source from "../models/Source.js";
import UserSource from "../models/UserSource.js";

export const getSources = async (req, res) => {
  try {
    // 1. استخراج وتنظيف الـ Query Parameters
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const { author, year, category, search, novel, issue, volume } = req.query;

    // 2. بناء كائن الفلتر (Query Object)
    // استخدام كائن {} بدلاً من مصفوفة $and يجعله أكثر مرونة وبساطة في الـ MongoDB
    const query = {};

    if (author) {
      query.Author = { $regex: author.trim(), $options: "i" };
    }

    if (year) {
      const parsedYear = parseInt(year);
      if (!isNaN(parsedYear)) query.Year = parsedYear;
    }

    if (category) {
      query.Category = category;
    }

    // تصحيح الخطأ هنا: فصل الـ volume عن الـ issue
    if (volume) {
      query.volume = parseInt(volume);
    }

    if (issue) {
      query.issue = parseInt(issue);
    }

    if (novel) {
      query.novel_name = novel;
    }

    if (search) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [{ title: searchRegex }, { Summary: searchRegex }];
    }

    // 3. التنفيذ في قاعدة البيانات
    const [result, total] = await Promise.all([
      Source.find(query)
        .sort({ novel_name: 1, volume: -1, issue: -1, serial_number: 1 }) // ترتيب حسب الرواية، ثم المجلد، ثم العدد
        .skip(skip)
        .limit(limit)
        .lean(),
      Source.countDocuments(query),
    ]);

    // 4. إرسال الرد
    res.status(200).json({
      result,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error("Error in getSources:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء جلب البيانات",
      error: error.message,
    });
  }
};

export const addSrcFromUser = async (req, res) => {
  try {
    const data = req.body;

    // إضافة تحقق بسيط من البيانات قبل الإرسال (اختياري)
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ message: "البيانات المطلوبة ناقصة" });
    }

    const result = await UserSource.create(data);

    res.status(201).json({
      message: "تمت إضافة المصدر بنجاح",
      result,
    });
  } catch (error) {
    console.error("Error in addSrcFromUser:", error);
    res.status(400).json({
      message: "فشل في إضافة المصدر",
      error: error.message,
    });
  }
};
