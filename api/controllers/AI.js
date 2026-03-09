import { GoogleGenAI } from "@google/genai";
import Source from "../models/Source.js";
import ChatCache from "../models/Chat.js";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

export const chatWithAi = async (req, res) => {
    try {
        const { userQuery } = req.body;
        if (!userQuery) return res.status(400).json({ error: "الرجاء إرسال سؤال" });

        // --- إضافة الـ Cache (البحث أولاً) ---
        const cachedResponse = await ChatCache.findOne({ question: userQuery });
        if (cachedResponse) {
            return res.json({ reply: cachedResponse.answer });
        }

        // 1. جلب البيانات من المونجو
        const relevantSources = await Source.find({ $text: { $search: userQuery } }).limit(2);

        const context = relevantSources.length > 0 ? relevantSources.map(s => `[${s.title}]: ${s.Summary}`).join("\n") : "لا توجد مصادر محددة.";

        // 2. تعليمات النظام (كما هي دون تعديل)
        const systemInstruction = `أنت مساعد خبير في علم النفس. 
أجب على أسئلة المستخدم بوضوح ودقة. 
- انت مساعد موضوع في موقع عباره عن ببليوغرافيا تجيمع للمصادر الرقميه 
-اسم الببليوغرافيا هو الصحة النفسيه للمراهقين في عصر السوشيال ميديا
- استخدم المصادر المقدمة لكي تأخذ فكره عن الموضوع واجب باسلوب علمي
- إذا سُئلت عن شيء غير موجود في المصادر، أجب باختصار من معلوماتك العامة.
-لا تذكر كلمه بناء علي كذا او بالرجوع الي كذا اجب فقط 
- التزم بأسلوب مهني ومباشر، وتجنب الحشو والترحيب الطويل.
- اذا سألت المستخدم سؤال لا علاقه له بعلم النفس قم بالاعتذار بشكل محترم ولا تجب علي السؤال
-اذا سألك شخص عن اسمك فأجب انك مساعد خبير في علم النفس يمكنك مساعدته في الحصول على اي معلومات يريدها
`;

        // 3. بناء الطلب
        const fullPrompt = `المصادر المتاحة:
${context}

سؤال المستخدم: ${userQuery}`;

        // 4. استدعاء النموذج
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
            },
        });

        const replyText = response.candidates[0].content.parts[0].text;

        // --- إضافة الـ Cache (التخزين بعد الحصول على الرد) ---
        await ChatCache.create({ question: userQuery, answer: replyText });

        res.json({ reply: replyText });
    } catch (error) {
        console.error("خطأ في الاتصال بـ Gemini:", error);
        res.status(500).json({ error: "حدث خطأ في الاتصال بالذكاء الاصطناعي" });
    }
};
