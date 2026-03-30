import Groq from "groq-sdk";
import Source from "../models/Source.js";
import ChatCache from "../models/Chat.js";
import dotenv from "dotenv";
dotenv.config();

// تهيئة Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithAi = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || messages.length === 0) return res.status(400).json({ error: "الرجاء إرسال المحادثة" });

        // جلب آخر رسالة من المستخدم
        const userQuery = messages[messages.length - 1].text;

        // --- الخطوة 1: تحسين استعلام البحث (Query Optimization) ---
        // بنطلب من موديل صغير وسريع يستخرج الكلمات المفتاحية فقط عشان البحث في MongoDB يكون أدق
        const keywordCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "استخرج الكلمات المفتاحية الأساسية فقط للبحث العلمي من الجملة التالية، بدون أي مقدمات أو علامات ترقيم:",
                },
                {
                    role: "user",
                    content: userQuery,
                },
            ],
            model: "llama3-8b-8192", // موديل سريع للمهام الجانبية
        });

        const optimizedQuery = keywordCompletion.choices[0]?.message?.content || userQuery;

        // --- الخطوة 2: جلب المصادر بذكاء (Hybrid Search Logic) ---
        let relevantSources = await Source.find({ $text: { $search: optimizedQuery } }).limit(3);

        // إذا لم يجد نتائج بالبحث النصي العادي، نستخدم Regex للبحث عن الكلمات بشكل مرن
        if (relevantSources.length === 0) {
            const words = optimizedQuery.split(" ").filter(w => w.length > 2);
            if (words.length > 0) {
                const regexQueries = words.map(word => ({
                    $or: [{ title: { $regex: word, $options: "i" } }, { Summary: { $regex: word, $options: "i" } }],
                }));
                relevantSources = await Source.find({ $or: regexQueries }).limit(2);
            }
        }

        const context =
            relevantSources.length > 0
                ? relevantSources.map(s => `[العنوان: ${s.title}] [الملخص: ${s.Summary}] [التصنيف: ${s.Category}]`).join("\n")
                : "لا توجد مصادر مباشرة متطابقة في قاعدة البيانات حالياً.";

        // --- الخطوة 3: تعليمات Bloom المطورة (Advanced System Prompt) ---
        const systemInstruction = `أنت Bloom، مساعد ذكي وخبير في استرجاع المعلومات لببليوغرافيا "Refo".
هدفك هو مساعدة الباحثين بأسلوب أكاديمي رصين ومبتكر.

قواعد التعامل الذكي:
1. الربط الدلالي: إذا سأل المستخدم عن موضوع (مثل: تأثير الألعاب)، وكان المصدر يتحدث عن (الترفيه الرقمي)، اربط بينهما بذكاء واشرح العلاقة.
2. التحليل: لا تنقل الملخص حرفياً، بل صُغه بأسلوبك لخدمة سؤال المستخدم.
3. الأمانة الأكاديمية: إذا لم تجد المصدر، قل بوضوح "هذا المصدر غير متوفر حالياً في مكتبتنا الرقمية، ولكن يمكنك البحث في [اقترح قواعد بيانات عالمية مثل Google Scholar]".
4. الهوية: أنت "بلوم (Bloom)"، لست مجرد بوت، بل خبير في هذه الببليوغرافيا.

طريقة التنسيق:
- الإجابة تكون فقرة علمية مركزة.
- في نهاية الرد، اذكر المراجع المستخدمة فقط بهذا الشكل: 
📌 المصدر: [اسم العنوان هنا]

سياق المصادر المتاحة (Context):
${context}`;

        // تحويل الرسائل لصيغة Groq
        const formattedMessages = [
            { role: "system", content: systemInstruction },
            ...messages.map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
            })),
        ];

        // --- الخطوة 4: استدعاء الموديل العملاق للإجابة النهائية ---
        const chatCompletion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.4, // حرارة منخفضة لضمان الدقة الأكاديمية وعدم التأليف
            max_tokens: 1024,
            top_p: 0.9,
        });

        const replyText = chatCompletion.choices[0]?.message?.content || "عذراً، واجهت مشكلة في معالجة البيانات.";

        // تخزين في الكاش (اختياري)
        await ChatCache.create({ question: userQuery, answer: replyText }).catch(err => console.log("Cache Error ignored"));

        res.json({ text: replyText });
    } catch (error) {
        console.error("Groq/DB Error:", error);
        res.status(500).json({ error: "حدث خطأ فني، يرجى المحاولة لاحقاً" });
    }
};
