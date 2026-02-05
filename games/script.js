// Load games
async function loadGames(sort) {
    [...document.getElementsByClassName('game-icon')]?.forEach(e => e.remove());
    let gamesList = await getJSON('/games/games.json');
    if (sort === 'az') gamesSort = Object.keys(gamesList).sort();
    else if (sort === 'za') gamesSort = Object.keys(gamesList).sort().reverse();
    else gamesSort = Object.keys(gamesList);
    console.log('Sorted '+gamesSort+' by '+sort);
    gamesSort.forEach(key => {
        const a = document.createElement('a');
        const img = document.createElement('img');
        const span = document.createElement('span');
        const info = gamesList[key];
        a.href = '/games/' + info.url;
        a.className = 'game-icon';
        img.src = info.img;
        if (window.matchMedia("(any-pointer: coarse)").matches) span.style.opacity = 1;
        span.className = 'game-name';
        span.textContent = key;
        a.append(img, span)
        document.getElementById('games').appendChild(a);
    })
}