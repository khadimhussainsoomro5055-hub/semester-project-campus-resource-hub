
let contentType = document.getElementById("content-type");
let resourceTitle = document.getElementById("resource-title");
let resourceLink = document.getElementById("resource-link");
let reason = document.getElementById("reason");
let description = document.getElementById("description");

let submitButton = document.querySelector(".primary-btn");
let reportForm = document.querySelector(".report-form-panel form");


// Submit report
submitButton.addEventListener("click", function() {

    // Check required fields
    if (!reportForm.checkValidity()) {
        reportForm.reportValidity();
        return;
    }

    // Get logged-in user
    let loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    // Get existing reports
    let reports = getData("reports");

    // Create new report
    let newReport = {
        id: Date.now(),

        contentType: contentType.value,
        title: resourceTitle.value.trim(),
        resourceLink: resourceLink.value.trim(),

        reason: reason.value,
        description: description.value.trim(),

        reporter: loggedInUser ? loggedInUser.name : "Guest",
        reporterEmail: loggedInUser ? loggedInUser.email : "",

        date: new Date().toLocaleDateString(),
        status: "Pending"
    };

    // Save report
    reports.push(newReport);

    saveData("reports", reports);

    // Show confirmation
    showMessage("Your report has been submitted successfully.");

    // Clear form
    reportForm.reset();

});
