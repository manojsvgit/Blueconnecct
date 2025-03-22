// Example of a simple script (if you need to add interactivity later)
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners or any scripts if needed
    const workerBtn = document.getElementById("workerBtn");
    const clientBtn = document.getElementById("clientBtn");

    workerBtn.addEventListener("click", function() {
        console.log("Redirecting to Worker Login...");
    });

    clientBtn.addEventListener("click", function() {
        console.log("Redirecting to Client Login...");
    });
});
