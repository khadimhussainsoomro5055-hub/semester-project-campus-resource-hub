
// Get the borrow button
let borrowButton = document.querySelector(".primary-btn");

// Run when the button is clicked
borrowButton.addEventListener("click", function() {

    // Get logged-in user
    let loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    // Check whether user is logged in
    if (!loggedInUser) {
        alert("Please login before requesting a book.");
        window.location.href = "login.html";
        return;
    }

    // Get existing requests
    let requests = getData("bookRequests");

    // Check if request already exists
    let existingRequest = requests.find(function(request) {
        return request.bookTitle === "Data Structures and Algorithms" &&
               request.requesterEmail === loggedInUser.email;
    });

    if (existingRequest) {
        alert("You have already requested this book.");
        return;
    }

    // Create a new request
    let newRequest = {
        id: Date.now(),
        bookTitle: "Data Structures and Algorithms",
        owner: "Ali Raza",
        requester: loggedInUser.name,
        requesterEmail: loggedInUser.email,
        status: "Pending",
        requestDate: new Date().toLocaleDateString()
    };

    // Save request
    requests.push(newRequest);
    saveData("bookRequests", requests);

    alert("Your borrowing request has been submitted successfully!");

});
