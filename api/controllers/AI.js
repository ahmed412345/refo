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

        const lastUserMessage = messages.filter(m => m.sender === "user").pop();
        const userQuery = lastUserMessage.text;

        // التحقق من الـ Cache
        const cachedResponse = await ChatCache.findOne({ question: userQuery });
        if (cachedResponse) return res.json({ text: cachedResponse.answer });

        // جلب المصادر
        const relevantSources = await Source.find({ $text: { $search: userQuery } }).limit(2);
        const context = relevantSources.length > 0 ? relevantSources.map(s => `[${s.title}]: ${s.Summary}`).join("\n") : "لا توجد مصادر محددة.";

        // تحويل التاريخ لصيغة Groq (نفس تنسيق OpenAI)
        const formattedMessages = [
            {
                role: "system",
                content: `أنت مساعد خبير في علم النفس. 
أجب على أسئلة المستخدم بوضوح ودقة. 
- انت مساعد موضوع في موقع عباره عن ببليوغرافيا تجيمع للمصادر الرقميه 
-اسم الببليوغرافيا هو الصحة النفسيه للمراهقين في عصر السوشيال ميديا
- استخدم المصادر المقدمة لكي تأخذ فكره عن الموضوع واجب باسلوب علمي
- إذا سُئلت عن شيء غير موجود في المصادر، أجب باختصار من معلوماتك العامة.
-لا تذكر كلمه بناء علي كذا او بالرجوع الي كذا اجب فقط 
- التزم بأسلوب مهني ومباشر، وتجنب الحشو والترحيب الطويل.
- اذا سألت المستخدم سؤال لا علاقه له بعلم النفس قم بالاعتذار بشكل محترم ولا تجب علي السؤال
-اذا سألك شخص عن اسمك فأجب انك مساعد خبير في علم النفس يمكنك مساعدته في الحصول على اي معلومات يريدها

        المصادر المتاحة:
        ${context}`,
            },
            ...messages.map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
            })),
        ];

        // استدعاء الموديل (Llama 3 هو الموديل الأفضل والأسرع لديهم)
        const chatCompletion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
        });

        const replyText = chatCompletion.choices[0]?.message?.content || "عذراً، لم أستطع الإجابة.";

        // التخزين في الكاش
        await ChatCache.create({ question: userQuery, answer: replyText });

        res.json({ text: replyText });
    } catch (error) {
        console.error("Groq Error:", error);
        res.status(500).json({ error: "حدث خطأ في الاتصال بمزود الخدمة" });
    }
};
