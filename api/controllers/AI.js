import Groq from "groq-sdk";
import Source from "../models/Source.js";
import ChatCache from "../models/Chat.js";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithAi = async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || messages.length === 0) return res.status(400).json({ error: "الرجاء إرسال المحادثة" });

        const userQuery = messages[messages.length - 1].text;

        // --- 1. تحسين الاستعلام للبحث (الذكاء في جلب المصادر) ---
        // بنطلب من لاما بسرعة يدينا كلمات مفتاحية بس عشان المونجو تفهمها صح
        const searchTermsResponse = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "استخرج أهم 3 كلمات مفتاحية للبحث الأكاديمي من الجملة التالية فقط وبدون أي مقدمات.",
                },
                {
                    role: "user",
                    content: userQuery,
                },
            ],
            model: "llama-3.1-8b-instant", // موديل سريع جداً للتحضير
        });
        const optimizedTerms = searchTermsResponse.choices[0]?.message?.content || userQuery;

        // --- 2. جلب المصادر (زيادة العدد لـ 3 لضمان شمولية أكبر) ---
        const relevantSources = await Source.find({ $text: { $search: optimizedTerms } }).limit(3);

        const context =
            relevantSources.length > 0
                ? relevantSources
                      .map((s, index) => `${index + 1}. [العنوان الكامل: ${s.title}] - [الملخص: ${s.Summary}] - [التصنيف: ${s.Category}]`)
                      .join("\n\n")
                : "لا توجد مصادر مطابقة مباشرة.";

        // --- 3. تعليمات Bloom (الذكاء الأكاديمي) ---
        const systemInstruction = `أنت Bloom، مساعد خبير متخصص في تحليل المعلومات الأكاديمية لببليوغرافيا "Refo".

قواعد السلوك والرد:
- الأسلوب: استخدم لغة عربية فصحى، رصينة، وأكاديمية. ابتعد عن العامية أو الردود الودية الزائدة.
- معالجة المعلومات: اقرأ الـ Context المرفق بعناية. إذا سأل المستخدم عن موضوع، ابحث عن الروابط المنطقية بين سؤاله وبين ملخصات المصادر.
- في حالة عدم وجود مصدر: لا تقُل "لا أعرف"، بل قُل "بناءً على المصادر المتاحة حالياً في الببليوغرافيا، لا يتوفر محتوى مباشر لهذا الاستفسار، ولكن يمكنك التوسع في [اقترح مجال بحثي]."
- التوثيق: أنت ملزم بذكر اسم المصدر الذي استعنت به في نهاية ردك.

تنسيق الرد النهائي:
1. ابدأ بالإجابة التحليلية مباشرة.
2. في نهاية الرد، اترك سطرين ثم اكتب المراجع بهذا الشكل الدقيق:
[المصدر: اسم العنوان هنا كما ورد في السياق]

سياق المصادر المتاحة (Context):
${context}`;

        const formattedMessages = [
            { role: "system", content: systemInstruction },
            ...messages.map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text,
            })),
        ];

        // --- 4. توليد الإجابة النهائية بـ Llama 3.3 لضمان أعلى ذكاء ---
        const chatCompletion = await groq.chat.completions.create({
            messages: formattedMessages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.3, // خفضنا الحرارة جداً لضمان عدم التأليف والالتزام بالمصادر
            max_tokens: 1000,
        });

        const replyText = chatCompletion.choices[0]?.message?.content || "عذراً، لم أستطع الإجابة حالياً.";

        // تخزين في الكاش (اختياري)
        await ChatCache.create({ question: userQuery, answer: replyText }).catch(() => {});

        res.json({ text: replyText });
    } catch (error) {
        console.error("Groq Error:", error);
        res.status(500).json({ error: "حدث خطأ أثناء معالجة الطلب" });
    }
};
