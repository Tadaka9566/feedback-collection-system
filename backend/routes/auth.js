const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;


// ==========================================
// REGISTER USER
// ==========================================

router.post(
    "/register",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password
            } = req.body;


            if (
                !name ||
                !email ||
                !password
            ) {

                return res.status(400).json({

                    message:
                        "Please fill all fields"

                });

            }


            const existingUser =
                await User.findOne({
                    email: email
                });


            if (existingUser) {

                return res.status(400).json({

                    message:
                        "User already exists"

                });

            }


            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );


            const user =
                new User({

                    name:
                        name,

                    email:
                        email,

                    password:
                        hashedPassword

                });


            await user.save();


            res.status(201).json({

                message:
                    "Registration successful"

            });


        } catch (error) {

            console.error(
                "Registration Error:",
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
// LOGIN USER
// ==========================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    message:
                        "Please enter email and password"

                });

            }


            const user =
                await User.findOne({
                    email: email
                });


            if (!user) {

                return res.status(401).json({

                    message:
                        "Invalid email or password"

                });

            }


            const isPasswordCorrect =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!isPasswordCorrect) {

                return res.status(401).json({

                    message:
                        "Invalid email or password"

                });

            }


            const token =
                jwt.sign(

                    {
                        id:
                            user._id,

                        name:
                            user.name,

                        email:
                            user.email,

                        role:
                            user.role

                    },

                    JWT_SECRET,

                    {
                        expiresIn:
                            "1h"
                    }

                );


            res.status(200).json({

                message:
                    "Login successful",

                token:
                    token,

                user: {

                    id:
                        user._id,

                    name:
                        user.name,

                    email:
                        user.email,

                    role:
                        user.role

                }

            });


        } catch (error) {

            console.error(
                "Login Error:",
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
// EXPORT ROUTER
// ==========================================

module.exports = router;