
let search = document.querySelector(".browse-search input");
let topSearch = document.querySelector(".search-box input");
let searchButton = document.querySelector(".search-button");
let topCategory = document.querySelector(".search-category");

let category = document.getElementById("category-filter");
let department = document.getElementById("department-filter");
let semester = document.getElementById("semester-filter");
let cards = document.querySelectorAll(".resource-card");
let results = document.querySelector(".browse-results");

function filterResources() {
    let count = 0;

    cards.forEach(function(card) {
        let text = card.textContent.toLowerCase();
        let tags = card.querySelectorAll(".resource-tags span");
        let type = tags[2].textContent.trim();

        if (type === "Notes")
            type = "Lecture Notes";

        let match =
            text.includes(search.value.toLowerCase().trim()) &&
            (category.value === "" || type === category.value) &&
            (department.value === "" || tags[0].textContent.trim() === department.value) &&
            (semester.value === "" || tags[1].textContent.trim() === semester.value);

        card.style.display = match ? "" : "none";

        if (match)
            count++;
    });

    results.textContent = count === 0
        ? "No resources found"
        : "Showing " + count + " results";
}

function topBarSearch() {
    search.value = topSearch.value;

    if (topCategory.value === "All")
        category.value = "";
    else if (topCategory.value === "Notes")
        category.value = "Lecture Notes";
    else
        category.value = topCategory.value;

    filterResources();
}

searchButton.onclick = topBarSearch;

topSearch.onkeydown = function(e) {
    if (e.key === "Enter")
        topBarSearch();
};

search.oninput = filterResources;
category.onchange = filterResources;
department.onchange = filterResources;
semester.onchange = filterResources;

filterResources();

let sort = document.getElementById("sort-filter");
let grid = document.querySelector(".resources-grid");

sort.onchange = function() {
    let list = Array.from(cards);

    list.sort(function(a, b) {
        if (sort.value === "title") {
            return a.querySelector("h3").textContent.localeCompare(
                b.querySelector("h3").textContent
            );
        }

        if (sort.value === "downloads") {
            return parseInt(b.querySelector(".download-info").textContent)
                 - parseInt(a.querySelector(".download-info").textContent);
        }

        let dateA = new Date(a.querySelectorAll(".resource-meta span")[1].textContent.trim());
        let dateB = new Date(b.querySelectorAll(".resource-meta span")[1].textContent.trim());

        return sort.value === "newest" ? dateB - dateA : dateA - dateB;
    });

    list.forEach(function(card) {
        grid.appendChild(card);
    });
};

let gridBtn = document.querySelector(".grid-view");
let listBtn = document.querySelector('[aria-label="List View"]');

gridBtn.onclick = function() {
    grid.style.gridTemplateColumns = "";
    gridBtn.classList.add("grid-view");
    listBtn.classList.remove("grid-view");
};

listBtn.onclick = function() {
    grid.style.gridTemplateColumns = "1fr";
    listBtn.classList.add("grid-view");
    gridBtn.classList.remove("grid-view");
};

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

let pagination = document.querySelector(".browse-pagination");
let currentPage = 1;
let perPage = 4;

function showPage() {
    let visibleCards = Array.from(grid.children).filter(function(card) {
        return card.style.display !== "none";
    });

    let totalPages = Math.ceil(visibleCards.length / perPage);

    currentPage = Math.min(currentPage, Math.max(1, totalPages));

    visibleCards.forEach(function(card, i) {
        card.hidden = !(i >= (currentPage - 1) * perPage &&
                        i < currentPage * perPage);
        card.style.display = card.hidden ? "none" : "";
    });

    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        let link = document.createElement("a");

        link.href = "#";
        link.textContent = i;

        if (i === currentPage)
            link.className = "selected";

        link.onclick = function(e) {
            e.preventDefault();
            currentPage = i;
            filterResources();
        };

        pagination.appendChild(link);
    }
}

let originalFilter = filterResources;

filterResources = function() {
    cards.forEach(function(card) {
        card.hidden = false;
    });

    originalFilter();
    showPage();
};

search.oninput = category.onchange =
department.onchange = semester.onchange = function() {
    currentPage = 1;
    filterResources();
};

sort.addEventListener("change", filterResources);

filterResources();