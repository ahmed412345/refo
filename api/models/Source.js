import { Schema, model } from "mongoose";

const newSourceSchema = new Schema({
    title: { type: String, required: true, trim: true },
    Summary: { type: String, required: true },
    Author: { type: String, required: true },
    Year: { type: Number, required: true },
    Category: { type: String, required: true },
    link: { type: String, required: true },
    novel_name: { type: String, required: true },
    serial_number: { type: Number, required: true },
    videoId: { type: String, required: true },
});
sourceSchema.index({ title: "text", Summary: "text" });

export default model("NewSource", newSourceSchema);
