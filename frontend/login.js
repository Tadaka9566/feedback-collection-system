const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    try {

        const response = await fetch(
            "/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );


        const data =
            await response.json();


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        if (response.ok) {

            message.textContent =
                data.message;

            message.style.color =
                "green";


            // ==========================================
            // SAVE USER INFORMATION
            // ==========================================

            localStorage.setItem(
                "userId",
                data.user.id
            );

            localStorage.setItem(
                "userName",
                data.user.name
            );

            localStorage.setItem(
                "userEmail",
                data.user.email
            );

            localStorage.setItem(
                "userRole",
                data.user.role
            );


            // ==========================================
            // SAVE JWT TOKEN
            // ==========================================

            localStorage.setItem(
                "token",
                data.token
            );


            console.log(
                "Logged in user:",
                data.user
            );


            console.log(
                "JWT Token:",
                data.token
            );


            // ==========================================
            // REDIRECT
            // ==========================================

            if (data.user.role === "admin") {

                window.location.href =
                    "admin.html";

            } else {

                window.location.href =
                    "feedback.html";

            }


        } else {

            message.textContent =
                data.message;

            message.style.color =
                "red";

        }


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        message.textContent =
            "Unable to connect to server";

        message.style.color =
            "red";

    }

});