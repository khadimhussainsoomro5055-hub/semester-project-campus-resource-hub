
// Get the upload form
let uploadForm = document.querySelector(".upload-left form");

// Get the file input
let resourceFile = document.getElementById("resourceFile");


// Run when the form is submitted
uploadForm.addEventListener("submit", function(event) {

    // Stop page refresh
    event.preventDefault();

    // Get form values
    let title = document.getElementById("title").value.trim();
    let category = document.getElementById("category").value;
    let department = document.getElementById("department").value;
    let course = document.getElementById("course").value;
    let semester = document.getElementById("semester").value;
    let resourceType = document.getElementById("resourceType").value;
    let description = document.getElementById("description").value.trim();

    // Get selected file
    let file = resourceFile.files[0];

    // Check required fields
    if (
        title === "" ||
        category === "" ||
        department === "" ||
        semester === "" ||
        resourceType === "" ||
        file == null
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    // Check file size (20 MB)
    let maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
        alert("File size must not exceed 20 MB.");
        return;
    }

    // Check file format
    let allowedTypes = [
        "pdf", "doc", "docx",
        "ppt", "pptx", "xls", "xlsx",
        "zip", "jpg", "jpeg", "png"
    ];

    let extension = file.name.split(".").pop().toLowerCase();

    if (!allowedTypes.includes(extension)) {
        alert("This file format is not supported.");
        return;
    }

    // Get existing resources
    let resources = getData("resources");

    // Create a new resource
    let newResource = {
        id: Date.now(),
        title: title,
        category: category,
        department: department,
        course: course,
        semester: semester,
        resourceType: resourceType,
        description: description,
        fileName: file.name,
        fileSize: file.size,
        fileType: extension,
        uploader: JSON.parse(localStorage.getItem("loggedInUser"))?.name || "Guest",
        status: "Pending Approval",
        date: new Date().toLocaleDateString(),
        downloads: 0
    };

    // Add resource to the array
    resources.push(newResource);

    // Save resources
    saveData("resources", resources);

    // Show success message
    alert("Resource submitted successfully! Waiting for admin approval.");

    // Reset form
    uploadForm.reset();

});
