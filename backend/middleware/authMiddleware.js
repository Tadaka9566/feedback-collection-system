const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


// ==========================================
// PROTECT ROUTES
// ==========================================

const protect = (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                message:
                    "No token provided"

            });

        }


        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({

                message:
                    "Invalid token"

            });

        }


        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );


        req.user =
            decoded;


        next();


    } catch (error) {

        console.error(
            "Authentication Error:",
            error.message
        );


        return res.status(401).json({

            message:
                "Invalid or expired token"

        });

    }

};


// ==========================================
// ADMIN ONLY
// ==========================================

const adminOnly = (
    req,
    res,
    next
) => {

    if (!req.user) {

        return res.status(401).json({

            message:
                "Authentication required"

        });

    }


    if (
        req.user.role !== "admin"
    ) {

        return res.status(403).json({

            message:
                "Admin access required"

        });

    }


    next();

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    protect,
    adminOnly
};