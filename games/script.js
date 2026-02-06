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
        a.addEventListener('click', () => {
            const background = document.createElement('div');
            const view = document.createElement('iframe');
            [
                ['height', '100vh'],
                ['width', '100vw'],
                ['backgroundColor', document.getElementById("darktest").classList.contains('darkmode')? 'gray' : 'white'],
                ['position', 'fixed']
            ].forEach([e, v] => { background.style[e] = v });
            view.src = '/games/' + info.url;
            view.style.position = 'fixed';
            background.append(view);
            document.getElementById('main').after(background);
        });
        a.className = 'game-icon';
        img.src = info.img;
        if (window.matchMedia("(any-pointer: coarse)").matches) span.style.opacity = 1;
        span.className = 'game-name';
        span.textContent = key;
        a.append(img, span)
        document.getElementById('games').appendChild(a);
    })
}