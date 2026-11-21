
// Get HTML elements
let search = document.querySelector(".browse-search input");
let topSearch = document.querySelector(".search-box input");
let searchButton = document.querySelector(".search-button");
let topCategory = document.querySelector(".search-category");

let category = document.getElementById("category-filter");
let department = document.getElementById("department-filter");
let semester = document.getElementById("semester-filter");
let sort = document.getElementById("sort-filter");

let grid = document.querySelector(".resources-grid");
let cards = Array.from(document.querySelectorAll(".resource-card"));
let results = document.querySelector(".browse-results");
let pagination = document.querySelector(".browse-pagination");

let currentPage = 1;
let perPage = 4;


// Filter resources
function filterResources() {

    let filteredCards = [];

    cards.forEach(function(card) {

        let text = card.textContent.toLowerCase();
        let tags = card.querySelectorAll(".resource-tags span");

        let type = tags[2].textContent.trim();

        if (type === "Notes") {
            type = "Lecture Notes";
        }

        let match =
            text.includes(search.value.toLowerCase().trim()) &&
            (category.value === "" || type === category.value) &&
            (department.value === "" || tags[0].textContent.trim() === department.value) &&
            (semester.value === "" || tags[1].textContent.trim() === semester.value);

        if (match) {
            filteredCards.push(card);
        }

    });

    // Sort resources
    if (sort.value === "title") {

        filteredCards.sort(function(a, b) {
            return a.querySelector("h3").textContent.localeCompare(
                b.querySelector("h3").textContent
            );
        });

    } else if (sort.value === "downloads") {

        filteredCards.sort(function(a, b) {
            let downloadsA = parseInt(a.querySelector(".download-info").textContent);
            let downloadsB = parseInt(b.querySelector(".download-info").textContent);

            return downloadsB - downloadsA;
        });

    } else {

        filteredCards.sort(function(a, b) {

            let dateA = new Date(a.querySelectorAll(".resource-meta span")[1].textContent.trim());
            let dateB = new Date(b.querySelectorAll(".resource-meta span")[1].textContent.trim());

            return sort.value === "newest"
                ? dateB - dateA
                : dateA - dateB;

        });

    }

    // Hide all cards first
    cards.forEach(function(card) {
        card.hidden = true;
    });

    // Display results count
    results.textContent = filteredCards.length === 0
        ? "No resources found"
        : "Showing " + filteredCards.length + " results";

    // Show current page
    showPage(filteredCards);
}


// Pagination
function showPage(filteredCards) {

    let totalPages = Math.ceil(filteredCards.length / perPage);

    if (currentPage > totalPages) {
        currentPage = 1;
    }

    let start = (currentPage - 1) * perPage;
    let end = start + perPage;

    filteredCards.forEach(function(card, index) {

        if (index >= start && index < end) {
            card.hidden = false;
        }

    });

    // Create pagination buttons
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        let link = document.createElement("a");

        link.href = "#";
        link.textContent = i;

        if (i === currentPage) {
            link.className = "selected";
        }

        link.onclick = function(event) {
            event.preventDefault();

            currentPage = i;

            showPage(filteredCards);
        };

        pagination.appendChild(link);
    }

}


// Top search
function topBarSearch() {

    search.value = topSearch.value;

    if (topCategory.value === "All") {
        category.value = "";
    } else if (topCategory.value === "Notes") {
        category.value = "Lecture Notes";
    } else {
        category.value = topCategory.value;
    }

    currentPage = 1;
    filterResources();
}


// Event listeners
search.oninput = function() {
    currentPage = 1;
    filterResources();
};

category.onchange = department.onchange = semester.onchange = sort.onchange = function() {
    currentPage = 1;
    filterResources();
};

searchButton.onclick = topBarSearch;

topSearch.onkeydown = function(event) {
    if (event.key === "Enter") {
        topBarSearch();
    }
};


// Grid and list view
let gridBtn = document.querySelector(".grid-view");
let listBtn = document.querySelector('[aria-label="List View"]');

gridBtn.onclick = function() {
    grid.style.gridTemplateColumns = "";
};

listBtn.onclick = function() {
    grid.style.gridTemplateColumns = "1fr";
};


// Bookmarks
let bookmarks = document.querySelectorAll(".bookmark");

bookmarks.forEach(function(bookmark) {

    bookmark.style.cursor = "pointer";

    bookmark.onclick = function() {

        let icon = bookmark.querySelector("svg");

        bookmark.classList.toggle("saved");

        if (bookmark.classList.contains("saved")) {
            icon.style.fill = "#F59E0B";
        } else {
            icon.style.fill = "none";
        }

    };

});


// Load resources when page opens
filterResources();
