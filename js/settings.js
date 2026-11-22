
let loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);

// Profile fields
let fullName = document.getElementById("full-name");
let email = document.getElementById("email");
let department = document.getElementById("department");
let semester = document.getElementById("semester");
let phone = document.getElementById("phone");
let campus = document.getElementById("campus");
let bio = document.getElementById("bio");

let editButton = document.querySelector(".edit-profile-button");
let saveButton = document.querySelector(".save-changes-button");


// Load user information
function loadProfile() {

    if (!loggedInUser) {
        showMessage("Please log in to manage your settings.");
        return;
    }

    fullName.value = loggedInUser.name || "";
    email.value = loggedInUser.email || "";
    department.value = loggedInUser.department || "";
    semester.value = loggedInUser.semester || "";
    phone.value = loggedInUser.phone || "";
    campus.value = loggedInUser.campus || "";
    bio.value = loggedInUser.bio || "";

    setProfileEditing(false);
}


// Enable or disable profile editing
function setProfileEditing(editable) {

    fullName.disabled = !editable;
    semester.disabled = !editable;
    phone.disabled = !editable;
    campus.disabled = !editable;
    bio.disabled = !editable;

    saveButton.disabled = !editable;

    editButton.style.display = editable ? "none" : "inline-flex";
}


// Edit profile button
editButton.addEventListener("click", function() {

    if (!loggedInUser) {
        showMessage("Please log in first.");
        return;
    }

    setProfileEditing(true);

});


// Save profile information
saveButton.addEventListener("click", function() {

    if (!loggedInUser) {
        showMessage("Please log in first.");
        return;
    }

    if (fullName.value.trim() === "") {
        showMessage("Please enter your name.");
        return;
    }

    // Update user information
    loggedInUser.name = fullName.value.trim();
    loggedInUser.semester = semester.value;
    loggedInUser.phone = phone.value.trim();
    loggedInUser.campus = campus.value.trim();
    loggedInUser.bio = bio.value.trim();

    // Get all registered users
    let users = getData("users");

    // Find current user
    let userIndex = users.findIndex(function(user) {
        return user.email === loggedInUser.email;
    });

    if (userIndex !== -1) {

        users[userIndex] = loggedInUser;

        saveData("users", users);
    }

    // Update logged-in user
    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
    );

    showMessage("Profile updated successfully.");

    setProfileEditing(false);

});


// Change password
let currentPassword = document.getElementById("current-password");
let newPassword = document.getElementById("new-password");
let confirmPassword = document.getElementById("confirm-password");

let updatePasswordButton = document.querySelector(
    ".update-password-button"
);

updatePasswordButton.addEventListener("click", function() {

    if (!loggedInUser) {
        showMessage("Please log in first.");
        return;
    }

    if (
        currentPassword.value === "" ||
        newPassword.value === "" ||
        confirmPassword.value === ""
    ) {
        showMessage("Please fill in all password fields.");
        return;
    }

    if (currentPassword.value !== loggedInUser.password) {
        showMessage("Your current password is incorrect.");
        return;
    }

    if (newPassword.value.length < 8) {
        showMessage("New password must contain at least 8 characters.");
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        showMessage("New passwords do not match.");
        return;
    }

    if (currentPassword.value === newPassword.value) {
        showMessage("Please choose a different password.");
        return;
    }

    // Update password
    loggedInUser.password = newPassword.value;

    let users = getData("users");

    let userIndex = users.findIndex(function(user) {
        return user.email === loggedInUser.email;
    });

    if (userIndex !== -1) {

        users[userIndex] = loggedInUser;

        saveData("users", users);
    }

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
    );

    // Clear password fields
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";

    showMessage("Password updated successfully.");

});


// Show and hide passwords
let passwordToggles = document.querySelectorAll(".password-toggle");

passwordToggles.forEach(function(button) {

    button.addEventListener("click", function() {

        let input = button.parentElement.querySelector("input");

        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }

    });

});


// Profile picture preview
let profilePhoto = document.getElementById("profile-photo");
let profileAvatar = document.querySelector(".large-profile-avatar");

profilePhoto.addEventListener("change", function() {

    let file = profilePhoto.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        showMessage("Please select an image file.");
        profilePhoto.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showMessage("Image size must be less than 2MB.");
        profilePhoto.value = "";
        return;
    }

    let reader = new FileReader();

    reader.onload = function(event) {

        profileAvatar.style.backgroundImage =
            "url('" + event.target.result + "')";

        profileAvatar.style.backgroundSize = "cover";
        profileAvatar.style.backgroundPosition = "center";
        profileAvatar.textContent = "";

    };

    reader.readAsDataURL(file);

});


// Save notification and privacy preferences
function savePreferences() {

    if (!loggedInUser) {
        return;
    }

    let notificationOptions = document.querySelectorAll(
        ".notification-card .setting-option input"
    );

    let privacyOptions = document.querySelectorAll(
        ".privacy-card .setting-option input"
    );

    let preferences = {
        notifications: [],
        privacy: []
    };

    notificationOptions.forEach(function(input) {
        preferences.notifications.push(input.checked);
    });

    privacyOptions.forEach(function(input) {
        preferences.privacy.push(input.checked);
    });

    let allSettings = getData("userSettings");

    let userIndex = allSettings.findIndex(function(item) {
        return item.email === loggedInUser.email;
    });

    let userSettings = {
        email: loggedInUser.email,
        preferences: preferences
    };

    if (userIndex === -1) {
        allSettings.push(userSettings);
    } else {
        allSettings[userIndex] = userSettings;
    }

    saveData("userSettings", allSettings);

}


// Load notification and privacy preferences
function loadPreferences() {

    if (!loggedInUser) {
        return;
    }

    let allSettings = getData("userSettings");

    let userSettings = allSettings.find(function(item) {
        return item.email === loggedInUser.email;
    });

    if (!userSettings) {
        return;
    }

    let notificationOptions = document.querySelectorAll(
        ".notification-card .setting-option input"
    );

    let privacyOptions = document.querySelectorAll(
        ".privacy-card .setting-option input"
    );

    notificationOptions.forEach(function(input, index) {

        input.checked =
            userSettings.preferences.notifications[index];

    });

    privacyOptions.forEach(function(input, index) {

        input.checked =
            userSettings.preferences.privacy[index];

    });

}


// Save preferences when a setting changes
let allPreferenceInputs = document.querySelectorAll(
    ".notification-card .setting-option input, " +
    ".privacy-card .setting-option input"
);

allPreferenceInputs.forEach(function(input) {

    input.addEventListener("change", savePreferences);

});


// Load saved information
loadProfile();
loadPreferences();
