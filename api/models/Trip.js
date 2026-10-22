import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    tripTitle: { type: String, required: true },
    description: { type: String },
    locations: [
        {
            id: { type: String },
            name: { type: String },
            type: { type: String },
            position: [{ type: Number }], // مصفوفة أرقام (خط الطول والعرض)
            description: { type: String },
            image: { type: String },
        },
    ],
});

export const TripModel = mongoose.model("Trip", tripSchema);
