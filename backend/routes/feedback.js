const express = require("express");

const Feedback = require("../models/Feedback");
const Notification = require("../models/Notification");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==========================================
// SUBMIT FEEDBACK
// USER MUST BE LOGGED IN
// ==========================================

router.post(
    "/",
    protect,

    async (req, res) => {

        try {

            const {
                rating,
                category,
                comments
            } = req.body;


            // Validate required fields
            if (
                rating === undefined ||
                !category ||
                !comments
            ) {

                return res.status(400).json({

                    message:
                        "Please fill all fields"

                });

            }


            // Validate rating
            const numericRating =
                Number(rating);


            if (
                !Number.isInteger(
                    numericRating
                ) ||
                numericRating < 1 ||
                numericRating > 5
            ) {

                return res.status(400).json({

                    message:
                        "Rating must be between 1 and 5"

                });

            }


            // Validate category
            const allowedCategories = [

                "Service",
                "Product",
                "Website",
                "Support",
                "Other"

            ];


            if (
                !allowedCategories.includes(
                    category
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid category"

                });

            }


            // Validate comments
            const cleanComments =
                String(comments).trim();


            if (
                cleanComments.length < 5
            ) {

                return res.status(400).json({

                    message:
                        "Comments must contain at least 5 characters"

                });

            }


            if (
                cleanComments.length > 500
            ) {

                return res.status(400).json({

                    message:
                        "Comments cannot exceed 500 characters"

                });

            }


            // Create feedback
            const feedback =
                new Feedback({

                    userId:
                        req.user.id,

                    rating:
                        numericRating,

                    category:
                        category,

                    comments:
                        cleanComments

                });


            await feedback.save();


            res.status(201).json({

                message:
                    "Feedback submitted successfully",

                feedback:
                    feedback

            });


        } catch (error) {

            console.error(
                "Submit Feedback Error:",
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
// GET LOGGED-IN USER FEEDBACK
// USER MUST BE LOGGED IN
// ==========================================

router.get(
    "/user",
    protect,

    async (req, res) => {

        try {

            const userId =
                req.user.id;


            const feedbacks =
                await Feedback.find({

                    userId:
                        userId

                })
                .sort({

                    createdAt:
                        -1

                });


            res.status(200).json(
                feedbacks
            );


        } catch (error) {

            console.error(
                "Get User Feedback Error:",
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
// GET ALL FEEDBACK
// ADMIN ONLY
// ==========================================

router.get(
    "/all",
    protect,
    adminOnly,

    async (req, res) => {

        try {

            const feedbacks =
                await Feedback.find()
                    .populate(
                        "userId",
                        "name email"
                    )
                    .sort({

                        createdAt:
                            -1

                    });


            res.status(200).json(
                feedbacks
            );


        } catch (error) {

            console.error(
                "Get All Feedback Error:",
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
// UPDATE FEEDBACK STATUS
// ADMIN ONLY
// ==========================================

router.put(
    "/:id/status",
    protect,
    adminOnly,

    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                status
            } = req.body;


            console.log(
                "Updating feedback:",
                id
            );


            console.log(
                "New status:",
                status
            );


            // Allowed statuses
            const allowedStatuses = [

                "Pending",

                "Reviewed",

                "Resolved"

            ];


            // Validate status
            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid status"

                });

            }


            // Find existing feedback
            const existingFeedback =
                await Feedback.findById(
                    id
                );


            if (!existingFeedback) {

                return res.status(404).json({

                    message:
                        "Feedback not found"

                });

            }


            const oldStatus =
                existingFeedback.status;


            // Update ONLY the status
            // This avoids re-validating
            // old feedback fields.
            const feedback =
                await Feedback.findByIdAndUpdate(

                    id,

                    {
                        status:
                            status
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                );


            console.log(
                "Updated feedback:",
                feedback
            );


            // Create notification
            // only when status changes
            if (
                oldStatus !== status
            ) {

                const notification =
                    new Notification({

                        userId:
                            feedback.userId,

                        message:
                            `Your feedback status has been changed from ${oldStatus} to ${status}.`,

                        isRead:
                            false

                    });


                await notification.save();


                console.log(
                    "Notification created:",
                    notification
                );

            }


            res.status(200).json({

                message:
                    "Feedback status updated successfully",

                feedback:
                    feedback

            });


        } catch (error) {

            console.error(
                "Update Feedback Status Error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error",

                error:
                    error.message

            });

        }

    }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;