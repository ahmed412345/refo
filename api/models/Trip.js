import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    // كائن اللغة العربية للرحلة الرئيسية
    ar: {
        eyebrow: { type: String },
        title: { type: String, required: true },
        subtitle: { type: String },
        description: { type: String },
    },
    // كائن اللغة الإنجليزية للرحلة الرئيسية
    en: {
        eyebrow: { type: String },
        title: { type: String, required: true },
        subtitle: { type: String },
        description: { type: String },
    },
    
    // المحطات (Stops) جوه نفس السكيما الرئيسية
    stops: [
        {
            id: { type: String, required: true },
            coords: [{ type: Number }], // خطوط الطول والعرض [Lat, Lng]
            mapURL: { type: String },
            
            // المحتوى النصي العربي للمحطة
            ar: {
                name: { type: String, required: true },
                governorate: { type: String },
                category: { type: String },
                period: { type: String },
                short: { type: String },
                description: { type: String },
                tip: { type: String },
            },
            // المحتوى النصي الإنجليزي للمحطة
            en: {
                name: { type: String, required: true },
                governorate: { type: String },
                category: { type: String },
                period: { type: String },
                short: { type: String },
                description: { type: String },
                tip: { type: String },
            },
            
            images: [
                {
                    src: { type: String, required: true },
                    alt: {
                        ar: { type: String },
                        en: { type: String }
                    },
                }
            ],
        }
    ],
}, { timestamps: true });

export const TripModel = mongoose.model("Trip", tripSchema);
