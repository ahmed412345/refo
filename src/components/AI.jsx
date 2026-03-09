import { Send } from "lucide-react";
import { useState } from "react";

const AI = () => {
    // حالة للرسائل
    const [allMsg, setAllMsg] = useState([
        { sender: "ai", text: "مرحبا كيف يمكنني مساعدتك" },
    ]);

    // حالة للنص الموجود حالياً في الـ input
    const [inputValue, setInputValue] = useState("");

    const sendMsgHandler = () => {
        // التأكد من أن الحقل ليس فارغاً
        if (inputValue.trim() === "") return;

        // 1. إنشاء رسالة جديدة
        const newMessage = { sender: "user", text: inputValue };

        // 2. تحديث الحالة بإضافة الرسالة الجديدة للمصفوفة الحالية
        setAllMsg([...allMsg, newMessage]);

        // 3. مسح محتوى الـ input
        setInputValue("");
    };

    return (
        <aside className="w-full lg:w-90 shrink-0 order-0 lg:order-2">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 h-fit">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg">Copilot</h2>
                </div>

                <div className="max-h-[50vh] flex flex-col gap-4 overflow-y-scroll p-4">
                    {allMsg.map((ele, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-2xl ${ele.sender === "ai" ? "bg-gray-100 mr-auto" : "bg-accent text-white ml-auto"} w-fit`}
                        >
                            {ele.text}
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <input
                        id="msg"
                        className="flex-1 outline-none text-sm bg-transparent"
                        placeholder="اسألني..."
                        value={inputValue} // ربط القيمة بالحالة
                        onChange={e => setInputValue(e.target.value)} // تحديث الحالة عند الكتابة
                        onKeyDown={e => e.key === "Enter" && sendMsgHandler()} // إرسال عند ضغط Enter
                    />
                    <button onClick={sendMsgHandler}>
                        <Send size={20} className="text-gray-400 cursor-pointer hover:text-accent duration-200" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AI;
