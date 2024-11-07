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

console.log('main.js loaded');



