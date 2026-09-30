require("dotenv").config({
    path: require("path").join(
        __dirname,
        "../.env"
    )
});

const express = require("express");
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const feedbackRoutes = require("./routes/feedback");
const notificationRoutes = require("./routes/notifications");

const app = express();

const PORT =
    process.env.PORT || 5000;


// ==========================================
// CHECK JWT SECRET
// ==========================================

if (!process.env.JWT_SECRET) {

    console.error(
        "ERROR: JWT_SECRET is not loaded from .env"
    );

    process.exit(1);

}


// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(
    express.json()
);


// ==========================================
// SERVE FRONTEND
// ==========================================

app.use(
    express.static(
        path.join(
            __dirname,
            "../frontend"
        )
    )
);


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/feedback",
    feedbackRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);


// ==========================================
// HOME PAGE
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "../frontend/index.html"
            )
        );

    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

        console.log(
            "JWT_SECRET loaded successfully"
        );

    }
);