import { Schema, model } from "mongoose";

const sourceSchema = new Schema({
    title: { type: String, required: true, trim: true },
    Summary: { type: String, required: true },
    Author: { type: String, required: true },
    Year: { type: Number, required: true },
    Category: { type: String, required: true },
    link: { type: String, required: true },
});

sourceSchema.index({ title: "text", Summary: "text" });

export default model("Source", sourceSchema);
