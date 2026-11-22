
let faqSearch = document.querySelector(".faq-search input");
let faqItems = document.querySelectorAll(".faq-item");

let messageInput = document.getElementById("message");
let subjectInput = document.getElementById("subject");

let messageCount = document.querySelector(".message-count");
let sendButton = document.querySelector(".send-message-button");


// FAQ Search
faqSearch.addEventListener("input", function() {

    let searchText = faqSearch.value.toLowerCase().trim();

    faqItems.forEach(function(item) {

        let question = item.textContent.toLowerCase();

        if (question.includes(searchText)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }

    });

});


// Message Character Counter
messageInput.addEventListener("input", function() {

    let currentLength = messageInput.value.length;

    messageCount.textContent =
        currentLength + " / 500 characters";

});


// Send Support Message
sendButton.addEventListener("click", function() {

    let subject = subjectInput.value;
    let message = messageInput.value.trim();

    // Check message
    if (message === "") {
        showMessage("Please enter your message.");
        messageInput.focus();
        return;
    }

    // Check message length
    if (message.length > 500) {
        showMessage("Message cannot exceed 500 characters.");
        return;
    }

    // Get logged-in user
    let loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    // Get existing messages
    let supportMessages = getData("supportMessages");

    // Create new support message
    let newMessage = {

        id: Date.now(),

        subject: subject,
        message: message,

        sender: loggedInUser
            ? loggedInUser.name
            : "Guest",

        senderEmail: loggedInUser
            ? loggedInUser.email
            : "",

        date: new Date().toLocaleDateString(),

        status: "Pending"

    };

    // Save message
    supportMessages.push(newMessage);

    saveData("supportMessages", supportMessages);

    // Show confirmation
    showMessage("Your message has been submitted successfully.");

    // Clear form
    messageInput.value = "";

    // Reset counter
    messageCount.textContent = "Maximum 500 characters";

});
