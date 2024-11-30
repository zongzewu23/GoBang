window.startMode = function (mode) {
    switch (mode) {
        case 'ai':
            window.location.href = 'index.html';
            break;
        case 'offline':
            window.location.href = 'offline-mode.html';
            break;
        default:
            console.error('Mystery Mode');
    }
};


const username = localStorage.getItem('username');
if (username) {
    const userInfo = document.getElementById('userInfo');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userAvatar = document.getElementById('userAvatar');
    const statsDisplay = document.getElementById('statsDisplay');

    if (userInfo) userInfo.style.display = 'flex';
    if (userNameDisplay) userNameDisplay.textContent = username;

   
    const avatarUrl = localStorage.getItem('avatarUrl') || '/src/default-avatar.jpg';
    if (userAvatar) userAvatar.src = avatarUrl;

    
    fetch(`/api/get-stats?username=${username}`)
        .then(response => response.json())
        .then(data => {
            if (statsDisplay) {
               statsDisplay.textContent = `
                    Games: ${data.total_games}, 
                    Wins: ${data.wins}, 
                    Max Streak: ${data.max_streak}, 
                    Win Rate: ${data.win_rate}%
                `.trim();
            }
        })
        .catch(error => console.error('Error fetching stats:', error));
}

console.log('main.js loaded');
