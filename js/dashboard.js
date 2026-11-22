
let loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
);

// Dashboard elements
let welcomeName = document.querySelector(".welcome-text h1");
let profileName = document.querySelector(".profile-info h4");
let profileDepartment = document.querySelector(".profile-info p");
let profileAvatar = document.querySelector(".profile-avatar");

let resourceList = document.querySelector(".resource-list");
let activitySection = document.querySelector(".recent-activity");

let searchInput = document.querySelector(".search-box input");
let searchButton = document.querySelector(".search-button");
let categorySelect = document.querySelector(".search-category");


// Load user information
function loadDashboardUser() {

    if (!loggedInUser) {
        return;
    }

    welcomeName.textContent = loggedInUser.name;
    profileName.textContent = loggedInUser.name;

    profileDepartment.textContent =
        loggedInUser.program || loggedInUser.department || "";

    profileAvatar.textContent =
        loggedInUser.name.charAt(0).toUpperCase();

}


// Get file extension
function getFileExtension(fileName) {

    if (!fileName || !fileName.includes(".")) {
        return "FILE";
    }

    return fileName.split(".").pop().toUpperCase();

}


// Display recently uploaded resources
function displayRecentResources() {

    let resources = getData("resources");

    // Get resources uploaded by current user
    let userResources = resources.filter(function(resource) {

        return loggedInUser &&
            resource.uploader === loggedInUser.name;

    });

    // Show latest uploads first
    userResources.reverse();

    userResources.forEach(function(resource) {

        let item = document.createElement("div");
        item.className = "resource-item dashboard-added-resource";

        // File icon
        let fileIcon = document.createElement("div");

        let extension = getFileExtension(resource.fileName);

        fileIcon.className = "file-icon";

        if (extension === "PDF") {
            fileIcon.classList.add("file-pdf");
        } else if (extension === "PPT" || extension === "PPTX") {
            fileIcon.classList.add("file-ppt");
        } else {
            fileIcon.classList.add("file-green");
        }

        fileIcon.textContent = extension;

        // Resource details
        let details = document.createElement("div");
        details.className = "resource-details";

        let title = document.createElement("h3");
        title.textContent = resource.title;

        let tags = document.createElement("div");
        tags.className = "resource-tags";

        let departmentTag = document.createElement("span");
        departmentTag.textContent = resource.department || "Department";

        let semesterTag = document.createElement("span");
        semesterTag.textContent = "Semester " + resource.semester;

        let categoryTag = document.createElement("span");
        categoryTag.textContent = resource.category || "Resource";

        let uploadedBy = document.createElement("p");
        uploadedBy.className = "uploaded-by";
        uploadedBy.textContent = "Uploaded by " + resource.uploader;

        tags.appendChild(departmentTag);
        tags.appendChild(semesterTag);
        tags.appendChild(categoryTag);

        details.appendChild(title);
        details.appendChild(tags);
        details.appendChild(uploadedBy);

        // Resource date and status
        let meta = document.createElement("div");
        meta.className = "resource-meta";

        let date = document.createElement("p");
        date.textContent = resource.date || "Recently";

        let status = document.createElement("span");
        status.textContent = resource.status || "Pending Approval";

        meta.appendChild(date);
        meta.appendChild(status);

        // Download button
        let downloadButton = document.createElement("a");
        downloadButton.href = "#";
        downloadButton.className = "download-button";
        downloadButton.textContent = "Download";

        downloadButton.addEventListener("click", function(event) {

            event.preventDefault();

            showMessage(
                "The actual file is not stored yet. File downloads will work after backend integration."
            );

        });

        // Add elements
        item.appendChild(fileIcon);
        item.appendChild(details);
        item.appendChild(meta);
        item.appendChild(downloadButton);

        resourceList.appendChild(item);

    });

}


// Display recent user activity
function displayRecentActivity() {

    let resources = getData("resources");
    let requests = getData("bookRequests");
    let reports = getData("reports");

    let activities = [];

    if (!loggedInUser) {
        return;
    }

    // User uploads
    resources.forEach(function(resource) {

        if (resource.uploader === loggedInUser.name) {

            activities.push({
                text: "You uploaded " + resource.title,
                date: resource.date,
                type: "upload"
            });

        }

    });

    // User borrowing requests
    requests.forEach(function(request) {

        if (request.requesterEmail === loggedInUser.email) {

            activities.push({
                text: "You requested " + request.bookTitle,
                date: request.requestDate,
                type: "request"
            });

        }

    });

    // User reports
    reports.forEach(function(report) {

        if (report.reporterEmail === loggedInUser.email) {

            activities.push({
                text: "You reported " + report.title,
                date: report.date,
                type: "report"
            });

        }

    });

    // Display latest activity first
    activities.reverse();

    activities.forEach(function(activity) {

        let item = document.createElement("div");
        item.className = "activity-item";

        let icon = document.createElement("span");
        icon.className = "activity-icon";

        if (activity.type === "upload") {
            icon.classList.add("activity-green");
            icon.textContent = "↑";
        } else if (activity.type === "request") {
            icon.classList.add("activity-purple");
            icon.textContent = "▤";
        } else {
            icon.classList.add("activity-red");
            icon.textContent = "⚑";
        }

        let text = document.createElement("p");
        text.textContent = activity.text;

        let date = document.createElement("small");
        date.textContent = activity.date || "Recently";

        item.appendChild(icon);
        item.appendChild(text);
        item.appendChild(date);

        activitySection.appendChild(item);

    });

}


// Search dashboard resources
function searchDashboardResources() {

    let searchText = searchInput.value.toLowerCase().trim();

    let selectedCategory = categorySelect.value;

    let resourceItems = document.querySelectorAll(".resource-item");

    resourceItems.forEach(function(item) {

        let resourceText = item.textContent.toLowerCase();

        let matchesSearch = resourceText.includes(searchText);

        let matchesCategory =
            selectedCategory === "All" ||
            resourceText.includes(selectedCategory.toLowerCase());

        if (matchesSearch && matchesCategory) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }

    });

}


// Search button
searchButton.addEventListener("click", function() {

    searchDashboardResources();

});


// Search when pressing Enter
searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchDashboardResources();
    }

});


// Update search when category changes
categorySelect.addEventListener("change", function() {

    searchDashboardResources();

});


// Prevent demo download links from pretending to download
let downloadButtons = document.querySelectorAll(
    ".resource-list .download-button"
);

downloadButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.preventDefault();

        showMessage(
            "Downloads will be available after actual file storage is implemented."
        );

    });

});


// Load dashboard
loadDashboardUser();
displayRecentResources();
displayRecentActivity();
