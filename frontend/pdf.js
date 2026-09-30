async function generatePDF() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert("Please login first.");

        window.location.href =
            "login.html";

        return;
    }


    try {

        // ==========================================
        // GET ALL FEEDBACK
        // ==========================================

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


        // ==========================================
        // CHECK ADMIN ACCESS
        // ==========================================

        if (response.status === 401) {

            alert(
                "Your session has expired. Please login again."
            );

            localStorage.clear();

            window.location.href =
                "login.html";

            return;
        }


        if (response.status === 403) {

            alert(
                "Access denied. Admins only."
            );

            return;
        }


        if (!response.ok) {

            alert(
                feedbacks.message ||
                "Unable to generate report."
            );

            return;
        }


        if (!feedbacks.length) {

            alert(
                "No feedback available to generate a report."
            );

            return;
        }


        // ==========================================
        // CALCULATE STATISTICS
        // ==========================================

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


        const totalRating =
            feedbacks.reduce(
                (
                    sum,
                    feedback
                ) =>
                    sum +
                    Number(
                        feedback.rating
                    ),
                0
            );


        const averageRating =
            (
                totalRating /
                total
            ).toFixed(2);


        // ==========================================
        // CREATE PDF
        // ==========================================

        const {
            jsPDF
        } = window.jspdf;


        const doc =
            new jsPDF();


        // ==========================================
        // TITLE
        // ==========================================

        doc.setFontSize(20);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Feedback Collection System",
            105,
            20,
            {
                align: "center"
            }
        );


        doc.setFontSize(15);

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            "Feedback Report",
            105,
            30,
            {
                align: "center"
            }
        );


        // ==========================================
        // REPORT DATE
        // ==========================================

        doc.setFontSize(10);

        doc.text(
            `Generated: ${new Date().toLocaleString()}`,
            14,
            42
        );


        // ==========================================
        // STATISTICS
        // ==========================================

        doc.setFontSize(13);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Summary",
            14,
            55
        );


        doc.setFontSize(11);

        doc.setFont(
            "helvetica",
            "normal"
        );


        doc.text(
            `Total Feedback: ${total}`,
            14,
            65
        );


        doc.text(
            `Pending: ${pending}`,
            14,
            73
        );


        doc.text(
            `Reviewed: ${reviewed}`,
            14,
            81
        );


        doc.text(
            `Resolved: ${resolved}`,
            14,
            89
        );


        doc.text(
            `Average Rating: ${averageRating} / 5`,
            14,
            97
        );


        // ==========================================
        // FEEDBACK TABLE
        // ==========================================

        const tableData =
            feedbacks.map(
                feedback => {

                    const userName =
                        feedback.userId?.name ||
                        "Unknown";


                    const userEmail =
                        feedback.userId?.email ||
                        "N/A";


                    const submittedDate =
                        new Date(
                            feedback.createdAt
                        ).toLocaleDateString();


                    return [

                        userName,

                        userEmail,

                        feedback.category,

                        `${feedback.rating}/5`,

                        feedback.comments,

                        feedback.status,

                        submittedDate

                    ];

                }
            );


        doc.autoTable({

            startY: 108,

            head: [[

                "Name",

                "Email",

                "Category",

                "Rating",

                "Comments",

                "Status",

                "Date"

            ]],

            body:
                tableData,

            theme:
                "grid",

            styles: {

                fontSize: 7,

                cellPadding: 3,

                overflow:
                    "linebreak"

            },

            headStyles: {

                fontSize: 8,

                fontStyle:
                    "bold"

            },

            columnStyles: {

                0: {
                    cellWidth: 25
                },

                1: {
                    cellWidth: 35
                },

                2: {
                    cellWidth: 22
                },

                3: {
                    cellWidth: 15
                },

                4: {
                    cellWidth: 45
                },

                5: {
                    cellWidth: 22
                },

                6: {
                    cellWidth: 22
                }

            },

            margin: {

                left: 10,

                right: 10

            }

        });


        // ==========================================
        // FOOTER
        // ==========================================

        const pageCount =
            doc.internal
                .getNumberOfPages();


        for (
            let page = 1;
            page <= pageCount;
            page++
        ) {

            doc.setPage(page);


            doc.setFontSize(8);


            doc.text(

                `Page ${page} of ${pageCount}`,

                105,

                290,

                {
                    align:
                        "center"
                }

            );

        }


        // ==========================================
        // DOWNLOAD PDF
        // ==========================================

        doc.save(
            "feedback-report.pdf"
        );


    } catch (error) {

        console.error(
            "PDF Report Error:",
            error
        );


        alert(
            "Unable to generate PDF report."
        );

    }

}