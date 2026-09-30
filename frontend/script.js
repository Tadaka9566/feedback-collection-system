const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.textContent = data.message;
            message.style.color = "green";

            registerForm.reset();
        } else {
            message.textContent = data.message;
            message.style.color = "red";
        }

    } catch (error) {
        console.error("Registration Error:", error);

        message.textContent = "Unable to connect to server";
        message.style.color = "red";
    }
});