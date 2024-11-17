window.startMode = function(mode) {
    switch (mode) {
        case 'ai':
            window.location.href = 'index.html';
            break;
        case 'offline':
            window.location.href = 'offline-mode.html';
            break;
        case 'online':
            initOnlineMode();
            break;
        default:
            console.error('Mystery Mode');
    }
};

// Check if user is logged in
const username = localStorage.getItem('username');
if (username) {
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('userNameDisplay').textContent = username;

    // Ensure avatar URL is correct
    const avatarUrl = localStorage.getItem('avatarUrl') || '/src/default-avatar.jpg';
    console.log('Avatar URL:', avatarUrl); 
    document.getElementById('userAvatar').src = avatarUrl;    
    
}


console.log('main.js loaded');

