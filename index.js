// Wait for the document to load
document.addEventListener("DOMContentLoaded", function () {
    // Get the elements you want to add functionality to
    const authorizeButton = document.getElementById("authorizeButton");
    const myAccountTitle = document.getElementById("myAccountTitle");

    // Add click event listener to the authorize button
    authorizeButton.addEventListener("click", function () {
        // Redirect to auth.html when the button is clicked
        window.location.href = "auth.html";
    });

    // Add click event listener to the My Account title
    myAccountTitle.addEventListener("click", function () {
        // Redirect to personal account page when the title is clicked
        window.location.href = "personal_account.html";
    });
});
