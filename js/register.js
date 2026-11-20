
document.getElementById("registerForm").onsubmit = function(e) {
    e.preventDefault();

    let name = document.getElementById("fullname").value.trim();
    let email = document.getElementById("email").value.trim();
    let confirmEmail = document.getElementById("confirm-email").value.trim();
    let pass = document.getElementById("password").value;
    let confirmPass = document.getElementById("confirm-password").value;
    let department = document.getElementById("department").value;
    let program = document.getElementById("program").value;
    let semester = document.getElementById("semester").value;
    let phone = document.getElementById("phone").value.trim();
    let terms = document.getElementById("terms").checked;

    if (name === "") {
        alert("Please enter your full name");
    }
    else if (!/^[^\s@]+@iba\.edu\.pk$/i.test(email)) {
        alert("Please enter a valid IBA email");
    }
    else if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
        alert("Emails do not match");
    }
    else if (pass.length < 8) {
        alert("Password must contain at least 8 characters");
    }
    else if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass) || !/[^a-zA-Z0-9]/.test(pass)) {
        alert("Use a capital letter, number and special character");
    }
    else if (pass !== confirmPass) {
        alert("Passwords do not match");
    }
    else if (department === "") {
        alert("Please select your department");
    }
    else if (program === "") {
        alert("Please select your academic program");
    }
    else if (semester === "") {
        alert("Please select your semester");
    }
    else if (phone !== "" && !/^03[0-9]{9}$/.test(phone)) {
        alert("Enter a valid 11-digit phone number");
    }
    else if (!terms) {
        alert("Please accept the terms and conditions");
    }
    else {
        alert("Registration form validated successfully!");
    }
};
