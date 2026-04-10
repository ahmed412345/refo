/* Created by Ahmed Eltahan - 2026 */
import { Schema, model } from "mongoose";

const userSourceSchema = new Schema({
  title: { type: String, required: true, trim: true },
  Summary: { type: String, required: true },
  Author: { type: String, required: true },
  Year: { type: Number, required: true },
  Category: { type: String, required: true },
  link: { type: String, required: true },
});

export default model("UserSource", userSourceSchema);
