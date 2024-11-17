async function handleLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Save authentication token
            localStorage.setItem('username', username); // Save username into local storage
            localStorage.setItem('avatarUrl', data.avatarUrl || '/src/default-avatar.jpg'); // Save avatar URL into local storage

            // Redirect to the main game page after successful login
            window.location.href = 'index.html';
        } else {
            alert('Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error:', error); // Log any errors for debugging
        alert('An error occurred. Please try again later.');
    }
}

async function handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validate that passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            alert('Registration successful! You can now log in.');
            mySwitch(); // Switch to the login form after registration
        } else {
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error); // Log any errors for debugging
        alert('An error occurred. Please try again later.');
    }
}
