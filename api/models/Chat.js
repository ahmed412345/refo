/* Created by Ahmed Eltahan - 2026 */
// models/ChatCache.js
import mongoose from "mongoose";

const chatCacheSchema = new mongoose.Schema({
  question: { type: String, required: true, index: true }, // فهرسة السؤال للبحث السريع
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "7d" }, // الإجابة ستُحذف تلقائياً بعد 7 أيام
});

export default mongoose.model("ChatCache", chatCacheSchema);
