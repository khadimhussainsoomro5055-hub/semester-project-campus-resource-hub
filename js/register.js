
let registerForm = document.querySelector("#registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get form values
        let name = document.querySelector("#fullname").value;
        let email = document.querySelector("#email").value;
        let confirmEmail = document.querySelector("#confirm-email").value;
        let password = document.querySelector("#password").value;
        let confirmPassword = document.querySelector("#confirm-password").value;

        let department = document.querySelector("#department").value;
        let program = document.querySelector("#program").value;
        let semester = document.querySelector("#semester").value;
        let phone = document.querySelector("#phone").value;

        let terms = document.querySelector("#terms").checked;

        // Check empty fields
        if (
            name === "" ||
            email === "" ||
            confirmEmail === "" ||
            password === "" ||
            confirmPassword === "" ||
            department === "" ||
            program === "" ||
            semester === "" ||
            phone === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }

        // Check email
        if (email !== confirmEmail) {
            alert("Email addresses do not match.");
            return;
        }

        // Check password
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Check terms and conditions
        if (!terms) {
            alert("Please accept the terms and conditions.");
            return;
        }

        // Get existing users
        let users = getData("users");

        // Check duplicate email
        let existingUser = users.find(function (user) {
            return user.email === email;
        });

        if (existingUser) {
            alert("This email is already registered.");
            return;
        }

        // Create new user
        let newUser = {
            name: name,
            email: email,
            password: password,
            department: department,
            program: program,
            semester: semester,
            phone: phone
        };

        // Add user to array
        users.push(newUser);

        // Save users
        saveData("users", users);

        alert("Registration successful!");

        // Go to login page
        window.location.href = "login.html";

    });

}
