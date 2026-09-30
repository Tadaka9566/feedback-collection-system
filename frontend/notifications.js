// ==========================================
// GET TOKEN
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
// NOTIFICATION LIST
// ==========================================

const notificationList =
    document.getElementById(
        "notificationList"
    );


// ==========================================
// NOTIFICATION TITLE
// ==========================================

const notificationTitle =
    document.getElementById(
        "notificationTitle"
    );


// ==========================================
// LOAD NOTIFICATIONS
// ==========================================

async function loadNotifications() {

    try {

        const response =
            await fetch(
                "/api/notifications",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const notifications =
            await response.json();


        // ======================================
        // ACCESS DENIED
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

            notificationList.innerHTML = `

                <p style="color:red;">

                    Unable to load notifications.

                </p>

            `;

            return;

        }


        // ======================================
        // COUNT UNREAD NOTIFICATIONS
        // ======================================

        const unreadCount =
            notifications.filter(
                notification =>
                    !notification.isRead
            ).length;


        // ======================================
        // UPDATE TITLE
        // ======================================

        if (
            unreadCount > 0
        ) {

            notificationTitle.textContent =
                `🔔 Notifications (${unreadCount})`;

        } else {

            notificationTitle.textContent =
                "🔔 Notifications";

        }


        // ======================================
        // NO NOTIFICATIONS
        // ======================================

        if (
            notifications.length === 0
        ) {

            notificationList.innerHTML = `

                <p>
                    No notifications yet.
                </p>

            `;

            return;

        }


        // ======================================
        // CLEAR LIST
        // ======================================

        notificationList.innerHTML =
            "";


        // ======================================
        // DISPLAY NOTIFICATIONS
        // ======================================

        notifications.forEach(
            notification => {

                const notificationBox =
                    document.createElement(
                        "div"
                    );


                notificationBox.style.border =
                    "1px solid #ddd";


                notificationBox.style.padding =
                    "15px";


                notificationBox.style.marginBottom =
                    "15px";


                notificationBox.style.borderRadius =
                    "8px";


                // ==================================
                // UNREAD NOTIFICATION
                // ==================================

                if (
                    !notification.isRead
                ) {

                    notificationBox.style.background =
                        "#eef6ff";

                    notificationBox.style.border =
                        "2px solid #2563eb";

                }


                // ==================================
                // READ NOTIFICATION
                // ==================================

                else {

                    notificationBox.style.background =
                        "#f9fafb";

                }


                // ==================================
                // NOTIFICATION CONTENT
                // ==================================

                notificationBox.innerHTML = `

                    <p>

                        <strong>

                            ${notification.message}

                        </strong>

                    </p>


                    <p>

                        <small>

                            ${new Date(
                                notification.createdAt
                            ).toLocaleString()}

                        </small>

                    </p>


                    ${
                        !notification.isRead
                            ? `
                                <button
                                    onclick="markAsRead(
                                        '${notification._id}'
                                    )"
                                >
                                    Mark as Read
                                </button>
                              `
                            : `
                                <p
                                    style="color:green;"
                                >
                                    ✓ Read
                                </p>
                              `
                    }

                `;


                notificationList.appendChild(
                    notificationBox
                );

            }
        );


    } catch (error) {

        console.error(
            "Notification Error:",
            error
        );


        notificationList.innerHTML = `

            <p style="color:red;">

                Unable to connect to server.

            </p>

        `;

    }

}


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

async function markAsRead(
    notificationId
) {

    try {

        const response =
            await fetch(
                `/api/notifications/${notificationId}/read`,
                {

                    method:
                        "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to mark notification as read."
            );

            return;

        }


        // Reload notifications

        loadNotifications();


    } catch (error) {

        console.error(
            "Mark Notification Error:",
            error
        );


        alert(
            "Unable to connect to server."
        );

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

loadNotifications();