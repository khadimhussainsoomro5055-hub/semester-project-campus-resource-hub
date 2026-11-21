
// Get HTML elements
let search = document.querySelector(".physical-search-box input");

let filterSelects = document.querySelectorAll(".physical-filter-row select");

let departmentFilter = filterSelects[0];
let semesterFilter = filterSelects[1];
let conditionFilter = filterSelects[2];
let sortFilter = filterSelects[3];

let booksGrid = document.querySelector(".physical-books-grid");
let books = Array.from(document.querySelectorAll(".physical-book-card"));

let resultText = document.querySelector(".physical-results p");


// Filter books
function filterBooks() {

    let count = 0;

    books.forEach(function(book) {

        let title = book.querySelector("h3").textContent.toLowerCase();

        let tags = book.querySelectorAll(".physical-tags span");

        let department = tags[0].textContent.trim();
        let semester = tags[1].textContent.trim();

        let condition = book.querySelector(".book-condition").textContent.trim();

        let text = book.textContent.toLowerCase();

        let match =
            text.includes(search.value.toLowerCase().trim()) &&
            (departmentFilter.value === "All Departments" ||
                department === departmentFilter.value) &&
            (semesterFilter.value === "All Semesters" ||
                semester === semesterFilter.value) &&
            (conditionFilter.value === "All Conditions" ||
                condition === conditionFilter.value);

        book.style.display = match ? "" : "none";

        if (match) {
            count++;
        }

    });

    resultText.textContent = "Showing " + count + " results";
}


// Search books
search.oninput = filterBooks;


// Filter books
departmentFilter.onchange = filterBooks;
semesterFilter.onchange = filterBooks;
conditionFilter.onchange = filterBooks;


// Sort books

function getBookDate(book) {
    let paragraphs = book.querySelectorAll(".physical-book-details p");

    for (let p of paragraphs) {
        let date = new Date(p.textContent.trim());

        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    return new Date(0);
}


// Sort books
sortFilter.onchange = function() {

    let sortedBooks = books.slice();

    if (sortFilter.value === "Title A-Z") {

        sortedBooks.sort(function(a, b) {
            let titleA = a.querySelector("h3").textContent;
            let titleB = b.querySelector("h3").textContent;

            return titleA.localeCompare(titleB);
        });

    } else {

        sortedBooks.sort(function(a, b) {
            let dateA = getBookDate(a);
            let dateB = getBookDate(b);

            return sortFilter.value === "Newest First"
                ? dateB - dateA
                : dateA - dateB;
        });

    }

    sortedBooks.forEach(function(book) {
        booksGrid.appendChild(book);
    });

    filterBooks();
};



// Grid and list view
let viewButtons = document.querySelectorAll(".physical-view-buttons button");

let gridButton = viewButtons[0];
let listButton = viewButtons[1];

gridButton.onclick = function() {

    booksGrid.style.gridTemplateColumns = "";

    gridButton.classList.add("active-view");
    listButton.classList.remove("active-view");

};

listButton.onclick = function() {

    booksGrid.style.gridTemplateColumns = "1fr";

    listButton.classList.add("active-view");
    gridButton.classList.remove("active-view");

};


// Initial display
filterBooks();
