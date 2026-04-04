import { Send, Loader2, Bot, X } from "lucide-react";
import { useState } from "react";
import { chatWithAi } from "../services/chatWithAi.js";

import ReactMarkdown from "react-markdown";

const AI = () => {
  const [allMsg, setAllMsg] = useState([
    { sender: "ai", text: "مرحبا كيف يمكنني مساعدتك" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const markdownComponents = {
    p: ({ node, ...props }) => (
      <p className="text-sm leading-relaxed" {...props} />
    ),
    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
    em: ({ node, ...props }) => <em className="italic" {...props} />,
    code: ({ node, ...props }) => (
      <code className="bg-black/10 px-1.5 py-0.5 rounded text-xs" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc list-inside space-y-1" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal list-inside space-y-1" {...props} />
    ),
    li: ({ node, ...props }) => <li className="text-sm" {...props} />,
  };

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
      const aiResponse = {
        sender: "ai",
        text: response.text || "لم يتم العثور على رد.",
      };
      setAllMsg((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("خطأ في الاتصال:", error);
      setAllMsg((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
                @keyframes slideInLeft {
                    from {
                        transform: translateX(-30px) scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                }

                @keyframes slideOutLeft {
                    from {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-30px) scale(0.8);
                        opacity: 0;
                    }
                }

                @keyframes popIn {
                    from {
                        transform: scale(0.3) rotate(-45deg);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                }

                @keyframes popOut {
                    from {
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                    to {
                        transform: scale(0.3) rotate(-45deg);
                        opacity: 0;
                    }
                }

                @keyframes bounce {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                .chat-bubble {
                    animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .chat-bubble.closing {
                    animation: popOut 0.3s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards;
                }

                .chat-window {
                    animation: slideInLeft 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .chat-window.closing {
                    animation: slideOutLeft 0.3s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards;
                }

                .floating-button:hover {
                    animation: float 2s ease-in-out infinite;
                }

                .message-enter {
                    animation: slideInLeft 0.3s ease-out;
                }
            `}</style>

      {/* Floating Chat Button - Bubble */}
      <div className="fixed bottom-6 left-6 cursor-pointer z-50 md:45 group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`floating-button cursor-pointer relative w-16 h-16 rounded-full bg-linear-to-br from-accent to-accent2 shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-white active:scale-95 group-hover:scale-110 ${
            isOpen ? "chat-bubble closing" : "chat-bubble"
          }`}
        >
          {isOpen ? (
            <X size={28} className="transition-all duration-300" />
          ) : (
            <Bot size={28} className="transition-all duration-300" />
          )}
        </button>

        {/* Label on Hover */}
        <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg font-medium">
            Bloom AI
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`chat-window fixed bottom-28 left-6 z-50 md:45 w-96 max-w-[calc(100vw-3rem)]`}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col h-[50vh] md:h-[70vh]">
            {/* Header */}
            <div className="bg-linear-to-r from-accent to-accent2 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Bloom AI</h2>
                  <p className="text-xs text-white/80">مساعد ذكي</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-300 active:scale-95"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {allMsg.map((ele, index) => (
                <div
                  key={index}
                  className={`message-enter flex ${
                    ele.sender === "ai" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] ${
                      ele.sender === "ai"
                        ? "bg-white border border-gray-200 text-gray-800 shadow-sm"
                        : "bg-linear-to-br from-accent to-accent2 text-white shadow-md"
                    }`}
                  >
                    <ReactMarkdown components={markdownComponents}>
                      {ele.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-enter flex justify-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-sm">
                    <Loader2 size={20} className="animate-spin text-accent" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white flex items-center gap-3">
              <input
                id="msg"
                className="flex-1 outline-none text-sm border border-gray-300 rounded-full px-4 py-2 transition-all duration-300 focus:border-accent focus:ring-2 focus:ring-accent/20"
                placeholder="اسألني..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsgHandler()}
                disabled={loading}
              />
              <button
                onClick={sendMsgHandler}
                disabled={loading}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin text-gray-400" />
                ) : (
                  <Send
                    size={20}
                    className="text-accent hover:text-accent2 transition-colors cursor-pointer"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AI;
