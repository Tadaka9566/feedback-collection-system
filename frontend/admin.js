// ==========================================
// ADMIN ACCESS CHECK
// ==========================================

const userRole =
    localStorage.getItem("userRole");

const token =
    localStorage.getItem("token");


if (
    userRole !== "admin" ||
    !token
) {

    alert(
        "Access denied. Admins only."
    );

    window.location.href =
        "login.html";

}


// ==========================================
// ADMIN DASHBOARD
// ==========================================

const adminFeedbackList =
    document.getElementById(
        "adminFeedbackList"
    );


let allFeedbacks = [];

let statusChart = null;

let categoryChart = null;

let ratingChart = null;


// ==========================================
// LOAD ALL FEEDBACK
// ==========================================

async function loadAllFeedback() {

    try {

        const response =
            await fetch(
                "/api/feedback/all",
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
        // ACCESS DENIED
        // ======================================

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                "Your session has expired or access was denied."
            );


            localStorage.removeItem(
                "token"
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

            adminFeedbackList.innerHTML = `

                <p style="color: red;">

                    ${feedbacks.message}

                </p>

            `;

            return;

        }


        // ======================================
        // SAVE FEEDBACK
        // ======================================

        allFeedbacks =
            feedbacks;


        // ======================================
        // UPDATE STATISTICS
        // ======================================

        updateStatistics(
            feedbacks
        );


        // ======================================
        // CREATE CHARTS
        // ======================================

        createCharts(
            feedbacks
        );


        // ======================================
        // DISPLAY FEEDBACK
        // ======================================

        displayFeedback(
            feedbacks
        );


    } catch (error) {

        console.error(
            "Admin Feedback Error:",
            error
        );


        adminFeedbackList.innerHTML = `

            <p style="color: red;">

                Unable to load feedback.

            </p>

        `;

    }

}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(
    feedbacks
) {

    const total =
        feedbacks.length;


    const pending =
        feedbacks.filter(
            feedback =>
                feedback.status ===
                "Pending"
        ).length;


    const reviewed =
        feedbacks.filter(
            feedback =>
                feedback.status ===
                "Reviewed"
        ).length;


    const resolved =
        feedbacks.filter(
            feedback =>
                feedback.status ===
                "Resolved"
        ).length;


    // ======================================
    // CALCULATE AVERAGE RATING
    // ======================================

    let averageRating = 0;


    if (total > 0) {

        const totalRating =
            feedbacks.reduce(
                (
                    sum,
                    feedback
                ) => {

                    return sum +
                        Number(
                            feedback.rating
                        );

                },
                0
            );


        averageRating =
            (
                totalRating /
                total
            ).toFixed(2);

    }


    // ======================================
    // DISPLAY STATISTICS
    // ======================================

    document.getElementById(
        "totalFeedback"
    ).textContent =
        total;


    document.getElementById(
        "pendingFeedback"
    ).textContent =
        pending;


    document.getElementById(
        "reviewedFeedback"
    ).textContent =
        reviewed;


    document.getElementById(
        "resolvedFeedback"
    ).textContent =
        resolved;


    document.getElementById(
        "averageRating"
    ).textContent =
        `${averageRating} ⭐`;

}


// ==========================================
// CREATE CHARTS
// ==========================================

function createCharts(
    feedbacks
) {

    // ======================================
    // STATUS COUNTS
    // ======================================

    const pending =
        feedbacks.filter(
            feedback =>
                feedback.status ===
                "Pending"
        ).length;


    const reviewed =
        feedbacks.filter(
            feedback =>
                feedback.status ===
                "Reviewed"
        ).length;


    const resolved =
        feedbacks.filter(
            feedback =>
                feedback.status ===
                "Resolved"
        ).length;


    // ======================================
    // CATEGORY COUNTS
    // ======================================

    const categoryCounts = {};


    feedbacks.forEach(
        feedback => {

            const category =
                feedback.category;


            if (
                categoryCounts[category]
            ) {

                categoryCounts[category]++;

            } else {

                categoryCounts[category] =
                    1;

            }

        }
    );


    // ======================================
    // STATUS CHART
    // ======================================

    if (statusChart) {

        statusChart.destroy();

    }


    const statusCanvas =
        document.getElementById(
            "statusChart"
        );


    statusChart =
        new Chart(
            statusCanvas,
            {

                type:
                    "doughnut",

                data: {

                    labels: [

                        "Pending",

                        "Reviewed",

                        "Resolved"

                    ],

                    datasets: [

                        {

                            label:
                                "Feedback Status",

                            data: [

                                pending,

                                reviewed,

                                resolved

                            ]

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        }

                    }

                }

            }
        );


    // ======================================
    // CATEGORY CHART
    // ======================================

    if (categoryChart) {

        categoryChart.destroy();

    }


    const categoryCanvas =
        document.getElementById(
            "categoryChart"
        );


    categoryChart =
        new Chart(
            categoryCanvas,
            {

                type:
                    "bar",

                data: {

                    labels:
                        Object.keys(
                            categoryCounts
                        ),

                    datasets: [

                        {

                            label:
                                "Number of Feedback",

                            data:
                                Object.values(
                                    categoryCounts
                                )

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                stepSize:
                                    1

                            }

                        }

                    }

                }

            }

        );


    // ======================================
    // RATING DISTRIBUTION
    // ======================================

    const ratingCounts = {

        "1 Star": 0,

        "2 Stars": 0,

        "3 Stars": 0,

        "4 Stars": 0,

        "5 Stars": 0

    };


    feedbacks.forEach(
        feedback => {

            const rating =
                Number(
                    feedback.rating
                );


            if (rating === 1) {

                ratingCounts[
                    "1 Star"
                ]++;

            }

            else if (rating === 2) {

                ratingCounts[
                    "2 Stars"
                ]++;

            }

            else if (rating === 3) {

                ratingCounts[
                    "3 Stars"
                ]++;

            }

            else if (rating === 4) {

                ratingCounts[
                    "4 Stars"
                ]++;

            }

            else if (rating === 5) {

                ratingCounts[
                    "5 Stars"
                ]++;

            }

        }
    );


    // ======================================
    // DESTROY OLD RATING CHART
    // ======================================

    if (ratingChart) {

        ratingChart.destroy();

    }


    const ratingCanvas =
        document.getElementById(
            "ratingChart"
        );


    // ======================================
    // CREATE RATING CHART
    // ======================================

    ratingChart =
        new Chart(
            ratingCanvas,
            {

                type:
                    "bar",

                data: {

                    labels:
                        Object.keys(
                            ratingCounts
                        ),

                    datasets: [

                        {

                            label:
                                "Number of Feedback",

                            data:
                                Object.values(
                                    ratingCounts
                                )

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                stepSize:
                                    1

                            }

                        }

                    }

                }

            }

        );

}


// ==========================================
// DISPLAY FEEDBACK
// ==========================================

function displayFeedback(
    feedbacks
) {

    if (
        feedbacks.length === 0
    ) {

        adminFeedbackList.innerHTML = `

            <p>
                No feedback found.
            </p>

        `;

        return;

    }


    adminFeedbackList.innerHTML =
        "";


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
            // USER INFORMATION
            // ==================================

            let userName =
                "Unknown User";


            let userEmail =
                "Email not available";


            if (
                feedback.userId &&
                typeof feedback.userId ===
                    "object"
            ) {

                userName =
                    feedback.userId.name ||
                    "Unknown User";


                userEmail =
                    feedback.userId.email ||
                    "Email not available";

            }


            // ==================================
            // DISPLAY FEEDBACK
            // ==================================

            feedbackBox.innerHTML = `

                <h3>
                    Feedback ${index + 1}
                </h3>


                <p>

                    <strong>
                        User Name:
                    </strong>

                    ${userName}

                </p>


                <p>

                    <strong>
                        Email:
                    </strong>

                    ${userEmail}

                </p>


                <p>

                    <strong>
                        Rating:
                    </strong>

                    ${"⭐".repeat(
                        feedback.rating
                    )}

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
                        Submitted:
                    </strong>

                    ${new Date(
                        feedback.createdAt
                    ).toLocaleString()}

                </p>


                <label>

                    <strong>
                        Status:
                    </strong>

                </label>


                <select
                    id="status-${feedback._id}"
                >

                    <option
                        value="Pending"

                        ${
                            feedback.status ===
                            "Pending"
                                ? "selected"
                                : ""
                        }
                    >
                        Pending
                    </option>


                    <option
                        value="Reviewed"

                        ${
                            feedback.status ===
                            "Reviewed"
                                ? "selected"
                                : ""
                        }
                    >
                        Reviewed
                    </option>


                    <option
                        value="Resolved"

                        ${
                            feedback.status ===
                            "Resolved"
                                ? "selected"
                                : ""
                        }
                    >
                        Resolved
                    </option>

                </select>


                <button
                    onclick="updateStatus(
                        '${feedback._id}'
                    )"
                >
                    Update Status
                </button>


                <p
                    id="statusMessage-${feedback._id}"
                ></p>

            `;


            adminFeedbackList.appendChild(
                feedbackBox
            );

        }
    );

}


// ==========================================
// UPDATE FEEDBACK STATUS
// ==========================================

async function updateStatus(
    feedbackId
) {

    const statusSelect =
        document.getElementById(
            `status-${feedbackId}`
        );


    const statusMessage =
        document.getElementById(
            `statusMessage-${feedbackId}`
        );


    const newStatus =
        statusSelect.value;


    try {

        const response =
            await fetch(
                `/api/feedback/${feedbackId}/status`,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            status:
                                newStatus

                        })

                }
            );


        const data =
            await response.json();


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                "Your session has expired or access was denied."
            );


            localStorage.removeItem(
                "token"
            );


            localStorage.removeItem(
                "userRole"
            );


            window.location.href =
                "login.html";


            return;

        }


        if (response.ok) {

            statusMessage.textContent =
                "Status updated successfully!";


            statusMessage.style.color =
                "green";


            await loadAllFeedback();

        }

        else {

            statusMessage.textContent =
                data.message;


            statusMessage.style.color =
                "red";

        }


    } catch (error) {

        console.error(
            "Update Status Error:",
            error
        );


        statusMessage.textContent =
            "Unable to update status.";


        statusMessage.style.color =
            "red";

    }

}


// ==========================================
// SEARCH AND FILTER
// ==========================================

function filterFeedback() {

    const searchText =
        document.getElementById(
            "searchInput"
        ).value
        .toLowerCase();


    const selectedStatus =
        document.getElementById(
            "statusFilter"
        ).value;


    const selectedCategory =
        document.getElementById(
            "categoryFilter"
        ).value;


    const filteredFeedback =
        allFeedbacks.filter(
            feedback => {

                const comments =
                    feedback.comments
                        ? feedback.comments
                            .toLowerCase()
                        : "";


                const category =
                    feedback.category
                        ? feedback.category
                            .toLowerCase()
                        : "";


                const userName =
                    feedback.userId &&
                    typeof feedback.userId ===
                        "object"
                        ? (
                            feedback.userId.name ||
                            ""
                        ).toLowerCase()
                        : "";


                const userEmail =
                    feedback.userId &&
                    typeof feedback.userId ===
                        "object"
                        ? (
                            feedback.userId.email ||
                            ""
                        ).toLowerCase()
                        : "";


                const matchesSearch =

                    comments.includes(
                        searchText
                    )

                    ||

                    category.includes(
                        searchText
                    )

                    ||

                    userName.includes(
                        searchText
                    )

                    ||

                    userEmail.includes(
                        searchText
                    );


                const matchesStatus =

                    selectedStatus ===
                        "All"

                    ||

                    feedback.status ===
                        selectedStatus;


                const matchesCategory =

                    selectedCategory ===
                        "All"

                    ||

                    feedback.category ===
                        selectedCategory;


                return (

                    matchesSearch

                    &&

                    matchesStatus

                    &&

                    matchesCategory

                );

            }
        );


    displayFeedback(
        filteredFeedback
    );

}


// ==========================================
// SEARCH EVENT
// ==========================================

document.getElementById(
    "searchInput"
).addEventListener(
    "input",
    filterFeedback
);


// ==========================================
// STATUS FILTER EVENT
// ==========================================

document.getElementById(
    "statusFilter"
).addEventListener(
    "change",
    filterFeedback
);


// ==========================================
// CATEGORY FILTER EVENT
// ==========================================

document.getElementById(
    "categoryFilter"
).addEventListener(
    "change",
    filterFeedback
);


// ==========================================
// EXPORT FEEDBACK TO CSV
// ==========================================

function exportCSV() {

    if (
        allFeedbacks.length === 0
    ) {

        alert(
            "No feedback available to export."
        );

        return;

    }


    const headers = [

        "User Name",

        "Email",

        "Rating",

        "Category",

        "Comments",

        "Status",

        "Submitted Date"

    ];


    const rows =
        allFeedbacks.map(
            feedback => {

                let userName =
                    "Unknown User";


                let userEmail =
                    "Email not available";


                if (
                    feedback.userId &&
                    typeof feedback.userId ===
                        "object"
                ) {

                    userName =
                        feedback.userId.name ||
                        "Unknown User";


                    userEmail =
                        feedback.userId.email ||
                        "Email not available";

                }


                return [

                    userName,

                    userEmail,

                    feedback.rating,

                    feedback.category,

                    feedback.comments,

                    feedback.status,

                    new Date(
                        feedback.createdAt
                    ).toLocaleString()

                ];

            }
        );


    const csvData = [

        headers,

        ...rows

    ];


    const csvContent =
        csvData
            .map(
                row =>

                    row
                        .map(
                            value => {

                                const text =
                                    String(
                                        value ??
                                        ""
                                    );


                                return `"${text.replace(
                                    /"/g,
                                    '""'
                                )}"`;

                            }
                        )
                        .join(",")

            )
            .join("\n");


    const blob =
        new Blob(
            [csvContent],
            {

                type:
                    "text/csv;charset=utf-8;"

            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "feedback_report.csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


// ==========================================
// ADMIN LOGOUT
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
// START ADMIN DASHBOARD
// ==========================================

loadAllFeedback();