
// Get the login form
let loginForm = document.querySelector("#loginForm");

// Check if the form exists
if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        // Stop page from refreshing
        event.preventDefault();

        // Get email and password
        let email = document.querySelector("#email").value;
        let password = document.querySelector("#password").value;

        // Check empty fields
        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Get registered users
        let users = getData("users");

        // Check whether user exists
        let foundUser = users.find(function (user) {
            return user.email === email && user.password === password;
        });

        if (foundUser) {

            // Save logged-in user
            localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

            alert("Login successful!");

            // Open dashboard
            window.location.href = "index.html";

        } else {
            alert("Invalid email or password.");
        }

    });
}
