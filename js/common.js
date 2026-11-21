
// Show a message on the screen
function showMessage(message) {
    alert(message);
}

// Get data from localStorage
function getData(key) {
    let data = localStorage.getItem(key);

    if (data == null) {
        return [];
    }

    return JSON.parse(data);
}

// Save data in localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Notification button
let notificationButton = document.querySelector(".notification-button");

if (notificationButton) {
    notificationButton.addEventListener("click", function () {
        showMessage("You have no new notifications.");
    });
}
