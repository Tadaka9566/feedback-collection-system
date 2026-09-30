// ==========================================
// GET LOGIN TOKEN
// ==========================================

const token =
    localStorage.getItem("token");


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
// HISTORY LIST
// ==========================================

const historyList =
    document.getElementById(
        "historyList"
    );


// ==========================================
// LOAD USER FEEDBACK
// ==========================================

async function loadHistory() {

    try {

        const response =
            await fetch(
                "/api/feedback/user",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const feedbacks =
            await response.json();


        // ======================================
        // SESSION EXPIRED
        // ======================================

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


        // ======================================
        // OTHER ERROR
        // ======================================

        if (!response.ok) {

            historyList.innerHTML = `

                <p style="color:red;">

                    ${
                        feedbacks.message ||
                        "Unable to load feedback history."
                    }

                </p>

            `;

            return;

        }


        // ======================================
        // NO FEEDBACK
        // ======================================

        if (
            feedbacks.length === 0
        ) {

            historyList.innerHTML = `

                <p>
                    No feedback submitted yet.
                </p>

            `;

            return;

        }


        // ======================================
        // CLEAR OLD CONTENT
        // ======================================

        historyList.innerHTML =
            "";


        // ======================================
        // DISPLAY FEEDBACK
        // ======================================

        feedbacks.forEach(
            (
                feedback,
                index
            ) => {

                const feedbackBox =
                    document.createElement(
                        "div"
                    );


                feedbackBox.style.border =
                    "1px solid #ddd";


                feedbackBox.style.padding =
                    "15px";


                feedbackBox.style.marginBottom =
                    "15px";


                feedbackBox.style.borderRadius =
                    "8px";


                feedbackBox.style.background =
                    "#f9fafb";


                // ==================================
                // STATUS DISPLAY
                // ==================================

                let statusColor =
                    "#f59e0b";


                if (
                    feedback.status ===
                    "Reviewed"
                ) {

                    statusColor =
                        "#2563eb";

                }


                if (
                    feedback.status ===
                    "Resolved"
                ) {

                    statusColor =
                        "#16a34a";

                }


                // ==================================
                // FEEDBACK CONTENT
                // ==================================

                feedbackBox.innerHTML = `

                    <h3>
                        Feedback ${index + 1}
                    </h3>


                    <p>

                        <strong>
                            Rating:
                        </strong>

                        ${
                            "⭐".repeat(
                                Number(
                                    feedback.rating
                                )
                            )
                        }

                    </p>


                    <p>

                        <strong>
                            Category:
                        </strong>

                        ${feedback.category}

                    </p>


                    <p>

                        <strong>
                            Comments:
                        </strong>

                        ${feedback.comments}

                    </p>


                    <p>

                        <strong>
                            Status:
                        </strong>

                        <span
                            style="
                                color:${statusColor};
                                font-weight:bold;
                            "
                        >
                            ${feedback.status}
                        </span>

                    </p>


                    <p>

                        <strong>
                            Submitted:
                        </strong>

                        ${new Date(
                            feedback.createdAt
                        ).toLocaleString()}

                    </p>

                `;


                historyList.appendChild(
                    feedbackBox
                );

            }
        );


    } catch (error) {

        console.error(
            "History Error:",
            error
        );


        historyList.innerHTML = `

            <p style="color:red;">

                Unable to connect to server.

            </p>

        `;

    }

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

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

    localStorage.removeItem(
        "token"
    );


    window.location.href =
        "login.html";

}


// ==========================================
// START
// ==========================================

loadHistory();