// ==========================================
// GET USER INFORMATION
// ==========================================

const token =
    localStorage.getItem("token");

const userName =
    localStorage.getItem("userName");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {

    alert(
        "Please login first."
    );

    window.location.href =
        "login.html";

}


// ==========================================
// GET FORM
// ==========================================

const feedbackForm =
    document.getElementById(
        "feedbackForm"
    );


// ==========================================
// SUBMIT FEEDBACK
// ==========================================

feedbackForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // ======================================
        // GET FORM VALUES
        // ======================================

        const rating =
            document.getElementById(
                "rating"
            ).value;


        const category =
            document.getElementById(
                "category"
            ).value;


        const comments =
            document.getElementById(
                "comments"
            ).value;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            !rating ||
            !category ||
            !comments
        ) {

            alert(
                "Please fill all fields."
            );

            return;

        }


        try {

            // ==================================
            // SEND FEEDBACK
            // ==================================

            const response =
                await fetch(
                    "/api/feedback",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                rating:
                                    Number(
                                        rating
                                    ),

                                category:
                                    category,

                                comments:
                                    comments

                            })

                    }
                );


            const data =
                await response.json();


            // ==================================
            // SESSION EXPIRED
            // ==================================

            if (
                response.status === 401
            ) {

                alert(
                    "Your session has expired. Please login again."
                );


                localStorage.removeItem(
                    "token"
                );


                localStorage.removeItem(
                    "userId"
                );


                localStorage.removeItem(
                    "userName"
                );


                localStorage.removeItem(
                    "userEmail"
                );


                localStorage.removeItem(
                    "userRole"
                );


                window.location.href =
                    "login.html";


                return;

            }


            // ==================================
            // SUCCESS
            // ==================================

            if (response.ok) {

                alert(
                    "Feedback submitted successfully!"
                );


                feedbackForm.reset();


                // Go to history page

                window.location.href =
                    "history.html";

            }


            // ==================================
            // ERROR
            // ==================================

            else {

                alert(
                    data.message ||
                    "Unable to submit feedback."
                );

            }


        } catch (error) {

            console.error(
                "Feedback Error:",
                error
            );


            alert(
                "Unable to connect to server."
            );

        }

    }
);