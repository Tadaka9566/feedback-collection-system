const express = require("express");
const Notification = require("../models/Notification");

const {
    protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// GET USER NOTIFICATIONS
// ==========================================

router.get(
    "/",
    protect,
    async (req, res) => {

        try {

            const notifications =
                await Notification.find({
                    userId: req.user.id
                })
                .sort({
                    createdAt: -1
                });


            res.status(200).json(
                notifications
            );

        } catch (error) {

            console.error(
                "Get Notifications Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

router.put(
    "/:id/read",
    protect,
    async (req, res) => {

        try {

            const notification =
                await Notification.findOneAndUpdate(

                    {
                        _id:
                            req.params.id,

                        userId:
                            req.user.id
                    },

                    {
                        isRead:
                            true
                    },

                    {
                        new:
                            true
                    }

                );


            if (!notification) {

                return res.status(404).json({

                    message:
                        "Notification not found"

                });

            }


            res.status(200).json({

                message:
                    "Notification marked as read",

                notification:
                    notification

            });

        } catch (error) {

            console.error(
                "Mark Notification Error:",
                error
            );

            res.status(500).json({

                message:
                    "Server error"

            });

        }

    }
);


module.exports = router;