import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    eyebrow: { type: String },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    
    stops: [
        {
            id: { type: String, required: true },
            name: { type: String, required: true },
            governorate: { type: String },
            coords: [{ type: Number }], // خطوط الطول والعرض [Lat, Lng]
            category: { type: String },
            period: { type: String },
            short: { type: String },
            description: { type: String },
            tip: { type: String },
            mapURL: { type: String },
            images: [
                {
                    src: { type: String, required: true },
                    alt: { type: String },
                }
            ],
        }
    ],
}, { timestamps: true });

export const TripModel = mongoose.model("Trip", tripSchema);
