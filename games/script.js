// Load games
function loadGames() {
    try {
    document.getElementsByClassName('game-icon')?.forEach(e => e.remove());
    let gamesList = fetch('/games/games.json');
    gamesList = JSON.parse(gamesList);
    console.log(gamesList)
    Object.keys(gamesList).forEach(key => {
        const a = document.createElement('a');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const info = gamesList[key];
        a.href = '/games/' + info.url;
        a.class = 'game-icon';
        img.src = info.img;
        span.class = 'game-name';
        span.textContent = key;
    } )
    } catch (e) {
        console.log(e)
    }
}