/* Created by Ahmed Eltahan - 2026 */
import Groq from "groq-sdk";
import Source from "../models/Source.js";
import ChatCache from "../models/Chat.js";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatWithAi = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || messages.length === 0)
      return res.status(400).json({ error: "الرجاء إرسال المحادثة" });

    const userQuery = messages[messages.length - 1].text;

    // --- 1. تحسين الاستعلام للبحث (الذكاء في جلب المصادر) ---
    // بنطلب من لاما بسرعة يدينا كلمات مفتاحية بس عشان المونجو تفهمها صح
    const searchTermsResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "استخرج أهم 3 كلمات مفتاحية للبحث الأكاديمي من الجملة التالية فقط وبدون أي مقدمات.",
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "llama-3.1-8b-instant", // موديل سريع جداً للتحضير
    });
    const optimizedTerms =
      searchTermsResponse.choices[0]?.message?.content || userQuery;

    // --- 2. جلب المصادر (زيادة العدد لـ 3 لضمان شمولية أكبر) ---
    const relevantSources = await Source.find({
      $text: { $search: optimizedTerms },
    }).limit(3);

    const context =
      relevantSources.length > 0
        ? relevantSources
            .map(
              (s, index) =>
                `${index + 1}. [العنوان الكامل: ${s.title}] - [الملخص: ${s.Summary}] - [التصنيف: ${s.Category}]`,
            )
            .join("\n\n")
        : "لا توجد مصادر مطابقة مباشرة.";

    // --- 3. تعليمات Bloom (الذكاء الأكاديمي) ---
    const systemInstruction = `أنت Bloom، المساعد الذكي لببليوغرافيا "Refo". 
تتميز بكونك ذكياً، لبقاً، وأكاديمياً في نفس الوقت.

قواعد الرد الذكي:
1. التمييز: إذا ألقى المستخدم التحية (مرحباً، صباح الخير، إلخ)، رد بترحيب طبيعي وودي كبشر، ولا تذكر أي مصادر.
2. البحث العلمي: إذا سأل المستخدم سؤالاً بحثياً، استخدم الـ Context المرفق للإجابة بأسلوب أكاديمي رصين.
3. الذكاء السياقي: لا تحاول ربط التحيات العادية بالمصادر العلمية. المصادر تُذكر فقط عندما تدعم إجابة علمية.
4. التوثيق: عند استخدام معلومة من مصدر، اذكر اسمه في نهاية الرد بتنسيق: 📌 [المصدر: اسم العنوان].
5. الهوية: أنت "بلوم"، مساعد خبير يساعد الباحثين في الوصول للمصادر المرئية والمكتوبة بذكاء.
6.لو شخص سألك من قام ببرمجت الموقع سترد بان احمد الطحان هو من قام ببرمجة الموقع
7.في حالة سؤال شخص عن احمد الطحان سترد بانه طالب في كلية اداب قسم الوثائق والمكتبات الفرقة الثالثة

قواعد صارمة للرد:
1. اللغة: استخدم العربية الفصحى فقط. (ممنوع دمج كلمات فرنسية أو إنجليزية مثل économie).
2. التنسيق (Markdown): استخدم التنسيق التالي ليكون الرد منظماً:
- استخدم العناوين الفرعية مثل (### العنوان).
- استخدم النقاط (-) لعرض الأسباب أو الميزات.
- استخدم الخط العريض (**) للكلمات المفتاحية.
3. معالجة المصادر: لا تقم بسرد الملخص كما هو. قم بصياغة الإجابة أولاً، ثم ضع المرجع في النهاية بشكل منفصل وواضح.
4. الهوية: رد بذكاء كبشر، إذا كانت مجرد تحية رد بترحيب، وإذا كان سؤالاً بحثياً استخدم المصادر.
5.انت تذكر بوضوح ان المصدر متاح في الببليوغرافيا في حالته وجوده وفي حاله عدم وجوده تذكر انه من المصادر الخارجيه.
6.يجب ان يكون كل الرد باللغه العربية الفصحى فقط الكلمات التي لا يمكن تعريبها اكتبها بين قوسيين ()
7.ممنوع استخدام حروف صيني او ياباني

طريقة عرض المرجع في نهاية الرد:
---
📌 **المرجع المعتمد:** [اسم العنوان هنا]

سياق المصادر:
${context}`;

    const formattedMessages = [
      { role: "system", content: systemInstruction },
      ...messages.map((msg) => ({
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

    const replyText =
      chatCompletion.choices[0]?.message?.content ||
      "عذراً، لم أستطع الإجابة حالياً.";

    // تخزين في الكاش (اختياري)
    await ChatCache.create({ question: userQuery, answer: replyText }).catch(
      () => {},
    );

    res.json({ text: replyText });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "حدث خطأ أثناء معالجة الطلب" });
  }
};
