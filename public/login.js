function onLoginSuccess() {
    alert('Login successful!');
    window.location.href = 'gobang.html'; // Redirect to the main game page
}

// Example: Bind the form submit event
document.getElementById('loginForm').onsubmit = function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    // Add your login validation logic here
    // If login is successful, call the function
    onLoginSuccess();
};
