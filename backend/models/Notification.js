const mongoose = require("mongoose");


// ==========================================
// NOTIFICATION SCHEMA
// ==========================================

const notificationSchema =
    new mongoose.Schema(

        {

            // User who receives notification
            userId: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref:
                    "User",

                required:
                    true

            },


            // Notification message
            message: {

                type:
                    String,

                required:
                    true

            },


            // Whether user has read it
            isRead: {

                type:
                    Boolean,

                default:
                    false

            }

        },

        {

            timestamps:
                true

        }

    );


// ==========================================
// EXPORT MODEL
// ==========================================

module.exports =
    mongoose.model(
        "Notification",
        notificationSchema
    );