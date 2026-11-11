import { Schema, model } from "mongoose";

const localizedContentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        about: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: String,
            trim: true,
        },
        collectionData: [
            {
                name: {
                    type: String,
                    trim: true,
                },
                description: {
                    type: String,
                    trim: true,
                },
                subCollection: [String],
            },
        ],
        eventsAndExhibitions: [
            {
                title: String,
                description: String,
            },
        ],
    },
    { _id: false }, // لمنع إنشاء _id فرعي للـ ar والـ en
);

const museumSchema = new Schema(
    {
        // 1. البيانات المتغيرة حسب اللغة
        ar: {
            type: localizedContentSchema,
            required: true,
        },
        en: {
            type: localizedContentSchema,
            required: true,
        },

        // 2. البيانات الثابتة (لا تتأثر باللغة)
        locationOnMap: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
        openingDate: {
            type: String,
            trim: true,
        },
        capacity: {
            type: Number,
        },
        workTime: {
            open: {
                time: String,
            },
            close: {
                time: String,
            },
        },

        ticketsPrice: {
            egyptian: Number,
            else: Number,
        },

        pics: [String],
        keywords: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

museumSchema.index({ locationOnMap: "2dsphere" });

export default model("Museum", museumSchema);
