import { Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { chatWithAi } from "../services/chatWithAi.js";

import ReactMarkdown from "react-markdown";

const AI = () => {
    const [allMsg, setAllMsg] = useState([{ sender: "ai", text: "مرحبا كيف يمكنني مساعدتك" }]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMsgHandler = async () => {
        if (inputValue.trim() === "" || loading) return;

        const userMessage = { sender: "user", text: inputValue };
        const updatedMessages = [...allMsg, userMessage];

        // 1. تحديث الواجهة فوراً
        setAllMsg(updatedMessages);
        setInputValue("");
        setLoading(true);

        try {
            // 2. إرسال آخر 10 رسائل لضمان فهم السياق (Context)
            const context = updatedMessages.slice(-5);

            const response = await chatWithAi(context);

            // 3. إضافة رد الـ AI (بافتراض أن السيرفر يرجع النص في خاصية text أو response)
            const aiResponse = { sender: "ai", text: response.text || "لم يتم العثور على رد." };
            setAllMsg(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("خطأ في الاتصال:", error);
            setAllMsg(prev => [...prev, { sender: "ai", text: "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="w-full lg:w-90 shrink-0 order-0 lg:order-2">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 h-fit">
                <div className="mb-6">
                    <h2 className="font-bold text-lg w-full text-left">Bloom</h2>
                </div>

                <div className="max-h-[50vh] md:max-h-[70vh] flex flex-col gap-4 overflow-y-auto p-4">
                    {allMsg.map((ele, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-2xl ${ele.sender === "ai" ? "bg-gray-100 mr-auto" : "bg-accent text-white ml-auto"} w-fit max-w-[80%]`}
                        >
                            <ReactMarkdown>{ele.text}</ReactMarkdown>
                        </div>
                    ))}
                    {loading && (
                        <div className="bg-gray-100 p-4 rounded-2xl w-fit mr-auto">
                            <Loader2 size={20} className="animate-spin text-accent" />
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <input
                        id="msg"
                        className="flex-1 outline-none text-sm bg-transparent"
                        placeholder="اسألني..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMsgHandler()}
                        disabled={loading}
                    />
                    <button onClick={sendMsgHandler} disabled={loading}>
                        {loading ? (
                            <Loader2 size={20} className="animate-spin text-gray-400" />
                        ) : (
                            <Send size={20} className="text-gray-400 cursor-pointer hover:text-accent duration-200" />
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AI;
