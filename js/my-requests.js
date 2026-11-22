
// Get HTML elements
let requestsList = document.querySelector(".requests-list");
let searchInput = document.querySelector(".request-search input");
let requestTabs = document.querySelectorAll(".request-tab");

let summaryCards = document.querySelectorAll(".summary-info h3");
let totalRequestLabel = document.querySelector(".total-request-label");

// Get saved requests
let requests = getData("bookRequests");

// Get logged-in user
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Current filter
let currentFilter = "All";


// Display saved requests
function displayRequests() {

    // Remove previously generated cards
    document.querySelectorAll(".saved-request-card").forEach(function(card) {
        card.remove();
    });

    // Show requests belonging to current user
    let userRequests = requests.filter(function(request) {
        return !loggedInUser ||
            request.requesterEmail === loggedInUser.email;
    });

    userRequests.forEach(function(request) {

        // Create request card
        let card = document.createElement("article");
        card.className = "request-card saved-request-card";

        // Book information
        let book = document.createElement("div");
        book.className = "request-book";

        let bookInfo = document.createElement("div");
        bookInfo.className = "request-book-info";

        let title = document.createElement("h3");
        title.textContent = request.bookTitle;

        let type = document.createElement("span");
        type.className = "book-type";
        type.textContent = "Physical Book";

        bookInfo.appendChild(title);
        bookInfo.appendChild(type);
        book.appendChild(bookInfo);

        // Owner information
        let owner = document.createElement("div");
        owner.className = "request-owner";

        let ownerLabel = document.createElement("span");
        ownerLabel.className = "detail-label";
        ownerLabel.textContent = "BOOK OWNER";

        let ownerName = document.createElement("h4");
        ownerName.textContent = request.owner || "Book Owner";

        owner.appendChild(ownerLabel);
        owner.appendChild(ownerName);

        // Request date
        let date = document.createElement("div");
        date.className = "request-date";

        let dateLabel = document.createElement("span");
        dateLabel.className = "detail-label";
        dateLabel.textContent = "REQUEST DATE";

        let dateText = document.createElement("p");
        dateText.textContent = request.requestDate || "Not available";

        date.appendChild(dateLabel);
        date.appendChild(dateText);

        // Request status
        let statusBox = document.createElement("div");
        statusBox.className = "request-status";

        let status = document.createElement("span");
        status.className = "status-badge " +
            request.status.toLowerCase() + "-status";
        status.textContent = request.status;

        statusBox.appendChild(status);

        // Actions
        let actions = document.createElement("div");
        actions.className = "request-actions";

        if (request.status === "Pending") {

            let cancelButton = document.createElement("button");
            cancelButton.className = "cancel-button";
            cancelButton.textContent = "Cancel Request";

            cancelButton.onclick = function() {

                if (confirm("Are you sure you want to cancel this request?")) {

                    requests = requests.filter(function(item) {
                        return item.id !== request.id;
                    });

                    saveData("bookRequests", requests);

                    displayRequests();
                }
            };

            actions.appendChild(cancelButton);
        }

        if (request.status === "Approved") {

            let receivedButton = document.createElement("button");
            receivedButton.className = "received-button";
            receivedButton.textContent = "Mark as Received";

            receivedButton.onclick = function() {

                request.status = "Completed";

                saveData("bookRequests", requests);

                displayRequests();
            };

            actions.appendChild(receivedButton);
        }

        // Add all sections to card
        card.appendChild(book);
        card.appendChild(owner);
        card.appendChild(date);
        card.appendChild(statusBox);
        card.appendChild(actions);

        requestsList.appendChild(card);

    });

    updateSummary();
    filterRequests();
}


// Update summary numbers
function updateSummary() {

    let userRequests = requests.filter(function(request) {
        return !loggedInUser ||
            request.requesterEmail === loggedInUser.email;
    });

    let total = userRequests.length;
    let pending = 0;
    let approved = 0;
    let completed = 0;

    userRequests.forEach(function(request) {

        if (request.status === "Pending") {
            pending++;
        }

        if (request.status === "Approved") {
            approved++;
        }

        if (request.status === "Completed") {
            completed++;
        }

    });

    summaryCards[0].textContent = total;
    summaryCards[1].textContent = pending;
    summaryCards[2].textContent = approved;
    summaryCards[3].textContent = completed;

    if (totalRequestLabel) {
        totalRequestLabel.textContent = total + " Requests";
    }

}


// Filter requests
function filterRequests() {

    let cards = document.querySelectorAll(".request-card");

    let searchText = searchInput.value.toLowerCase().trim();

    let count = 0;

    cards.forEach(function(card) {

        let text = card.textContent.toLowerCase();

        let status = card.querySelector(".status-badge");

        let statusText = status
            ? status.textContent.trim()
            : "";

        let matchesSearch = text.includes(searchText);

        let matchesStatus =
            currentFilter === "All" ||
            statusText === currentFilter;

        let match = matchesSearch && matchesStatus;

        card.style.display = match ? "" : "none";

        if (match) {
            count++;
        }

    });

    let emptyMessage = document.querySelector(".requests-empty");

    if (!emptyMessage) {

        emptyMessage = document.createElement("p");
        emptyMessage.className = "requests-empty";
        emptyMessage.textContent = "No requests found.";

        requestsList.appendChild(emptyMessage);
    }

    emptyMessage.style.display = count === 0 ? "block" : "none";

}


// Search requests
searchInput.addEventListener("input", filterRequests);


// Request status tabs
requestTabs.forEach(function(tab) {

    tab.addEventListener("click", function(event) {

        event.preventDefault();

        currentFilter = tab.textContent.trim().split(/\s+/)[0];

        if (currentFilter === "All") {
            currentFilter = "All";
        }

        requestTabs.forEach(function(item) {
            item.classList.remove("active-tab");
        });

        tab.classList.add("active-tab");

        filterRequests();

    });

});


// Initial display
displayRequests();
