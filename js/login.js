
let password = document.getElementById("password");
let button = document.getElementById("togglePassword");
let email = document.getElementById("email");
let form = document.querySelector("form");

// Show / Hide Password
button.onclick = function() {
    if (password.type == "password") {
        password.type = "text";
        button.innerText = "Hide";
    } else {
        password.type = "password";
        button.innerText = "Show";
    }
};

// Login Validation
form.onsubmit = function(e) {
    e.preventDefault();

    let pass = password.value;

    if (!email.value.endsWith("@iba.edu.pk")) {
        alert("Enter a valid IBA email");
    }
    else if (pass.length < 8) {
        alert("Password must have at least 8 characters");
    }
    else if (!/[A-Z]/.test(pass)) {
        alert("Add a capital letter");
    }
    else if (!/[0-9]/.test(pass)) {
        alert("Add a number");
    }
    else if (!/[^a-zA-Z0-9]/.test(pass)) {
        alert("Add a special character");
    }
    else {
        alert("Validation successful!");
    }
};
