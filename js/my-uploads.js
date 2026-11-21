
// Get HTML elements
let uploadsGrid = document.querySelector(".uploads-grid");
let search = document.querySelector(".upload-search input");

let filters = document.querySelectorAll(".uploads-filters select");

let categoryFilter = filters[0];
let statusFilter = filters[1];
let sortFilter = filters[2];

let results = document.querySelector(".results-text");
let emptyMessage = document.querySelector(".uploads-empty");


// Get saved resources
let resources = getData("resources");


// Get logged-in user
let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));


// Display newly uploaded resources
resources.forEach(function(resource) {

    // Create a card
    let card = document.createElement("article");

    card.className = "upload-card";

    // Store resource information
    card.dataset.title = resource.title;
    card.dataset.category = resource.category;
    card.dataset.department = resource.department;
    card.dataset.status = resource.status;
    card.dataset.date = resource.date;
    card.dataset.uploader = resource.uploader;

    // Create card content
    let content = document.createElement("div");
    content.className = "upload-card-content";

    let details = document.createElement("div");
    details.className = "book-details";

    let status = document.createElement("span");
    status.className = "status pending";
    status.textContent = resource.status === "Pending Approval"
        ? "Pending"
        : resource.status;

    let title = document.createElement("h3");
    title.textContent = resource.title;

    let department = document.createElement("p");
    department.textContent = resource.department;

    let semester = document.createElement("p");
    semester.textContent = resource.semester;

    let date = document.createElement("p");
    date.textContent = resource.date;

    let type = document.createElement("span");
    type.className = "resource-type";
    type.textContent = resource.category;

    // Add details to card
    details.appendChild(status);
    details.appendChild(title);
    details.appendChild(department);
    details.appendChild(semester);
    details.appendChild(date);
    details.appendChild(type);

    content.appendChild(details);
    card.appendChild(content);

    // Create delete button
    let actions = document.createElement("div");
    actions.className = "card-actions";

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete";

    deleteButton.onclick = function() {

        if (confirm("Are you sure you want to delete this resource?")) {

            let savedResources = getData("resources");

            savedResources = savedResources.filter(function(item) {
                return item.id !== resource.id;
            });

            saveData("resources", savedResources);

            card.remove();

            filterUploads();
        }
    };

    actions.appendChild(deleteButton);
    card.appendChild(actions);

    // Add card to page
    uploadsGrid.appendChild(card);

});


// Filter uploads
function filterUploads() {

    let cards = document.querySelectorAll(".upload-card");
    let count = 0;

    cards.forEach(function(card) {

        let title = card.querySelector("h3").textContent.toLowerCase();

        let text = card.textContent.toLowerCase();

        let category = card.querySelector(".resource-type").textContent.trim();

        let status = card.querySelector(".status").textContent.trim();

        let matchesSearch = title.includes(search.value.toLowerCase());

        let matchesCategory =
            categoryFilter.value === "All Categories" ||
            category === categoryFilter.value;

        let matchesStatus =
            statusFilter.value === "All Status" ||
            status === statusFilter.value;

        let matchesUser = true;

        // Check current user's uploads for dynamically added cards
        if (card.dataset.uploader && loggedInUser) {
            matchesUser = card.dataset.uploader === loggedInUser.name;
        }

        let match =
            matchesSearch &&
            matchesCategory &&
            matchesStatus &&
            matchesUser;

        card.style.display = match ? "" : "none";

        if (match) {
            count++;
        }

    });

    // Update results
    results.textContent = "Showing " + count + " uploads";

    // Show empty message
    emptyMessage.style.display = count === 0 ? "block" : "none";
}


// Search
search.oninput = filterUploads;


// Category, status and sorting
categoryFilter.onchange = filterUploads;
statusFilter.onchange = filterUploads;


// Sort uploads
sortFilter.onchange = function() {

    let cards = Array.from(uploadsGrid.querySelectorAll(".upload-card"));

    cards.sort(function(a, b) {

        let dateA = new Date(a.querySelectorAll(".book-details p")[2].textContent);
        let dateB = new Date(b.querySelectorAll(".book-details p")[2].textContent);

        if (sortFilter.value === "Newest First") {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }

    });

    cards.forEach(function(card) {
        uploadsGrid.appendChild(card);
    });

    filterUploads();
};


// Load uploads
filterUploads();
