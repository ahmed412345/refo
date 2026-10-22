import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({
    tripTitle: String,
    description: String,
    locations: [
        {
            id: String,
            name: String,
            type: String,
            position: [Number],
            description: String,
            image: String,
        },
    ],
});

export const TripModel = mongoose.model("Trip", tripSchema);
