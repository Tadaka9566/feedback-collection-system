const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Service",
                "Product",
                "Website",
                "Support",
                "Other"
            ]
        },

        comments: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 500,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Reviewed",
                "Resolved"
            ],
            default: "Pending"
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Feedback",
        feedbackSchema
    );