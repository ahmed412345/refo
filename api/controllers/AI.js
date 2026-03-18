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

        // جلب آخر رسالة من المستخدم للبحث في قاعدة البيانات
        const userQuery = messages[messages.length - 1].text;

        // التحقق من الـ Cache
        const cachedResponse = await ChatCache.findOne({ question: userQuery });
        if (cachedResponse) return res.json({ text: cachedResponse.answer });

        // جلب المصادر ذات الصلة
        const relevantSources = await Source.find({ $text: { $search: userQuery } }).limit(2);
        const context =
            relevantSources.length > 0
                ? relevantSources.map(s => `[عنوان المصدر: ${s.title}] ملخص المصدر: [${s.Summary}]`).join("\n")
                : "لا توجد مصادر محددة في قاعدة البيانات لهذا الاستفسار.";

        // تجهيز التعليمات الصارمة لـ Bloom
        const systemInstruction = `أنت Bloom، مساعد ذكي وخبير في إدارة واسترجاع المعلومات الرقمية لببليوغرافيا الحاليه وهي ببليوجرافيا عامة تجمع مصادر وتوفرها بشكل مرئي.
مهامك:
- تحليل المصادر المقدمة في الـ (Context) والإجابة منها بأسلوب علمي مباشر.
- إذا لم تجد المعلومة في المصادر، أجب باختصار من معلوماتك العامة.
- لا تستخدم عبارات مثل "بناءً على المصادر" أو "وفقاً للبيانات".
- إذا سُئلت عن هويتك: "أنا بلوم (Bloom)، مساعد خبير في هذه الببليوغرافيا".
- إذا كان السؤال خارج سياق البحث العلمي أو المكتبة، اعتذر بلباقة.
- تجنب الحشو والترحيب الطويل.
-اذا وجدت مصادر اذكر العنوان الخاص بها فقط في نهايه الرد

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

        // استدعاء الموديل
        const chatCompletion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.6, // خفض الحرارة قليلاً يزيد من دقة الإجابات العلمية
            max_tokens: 1024,
        });

        const replyText = chatCompletion.choices[0]?.message?.content || "عذراً، لم أستطع الإجابة حالياً.";

        // تخزين في الكاش (اختياري: يفضل تخزين الأسئلة الفريدة فقط)
        await ChatCache.create({ question: userQuery, answer: replyText });

        res.json({ text: replyText });
    } catch (error) {
        console.error("Groq Error:", error);
        res.status(500).json({ error: "حدث خطأ أثناء معالجة الطلب" });
    }
};
