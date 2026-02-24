// Load games
async function loadGames(sort) {
    [...document.getElementsByClassName("game-icon")]?.forEach(e => e.remove());
    let gamesList = await getJSON("/games/games.json");
    if (sort === "az") gamesSort = Object.keys(gamesList).sort();
    else if (sort === "za") gamesSort = Object.keys(gamesList).sort().reverse();
    else gamesSort = Object.keys(gamesList);
    console.log("Sorted " + gamesSort + " by " + sort);
    gamesSort.forEach(key => {
        const a = document.createElement("a");
        const img = document.createElement("img");
        const span = document.createElement("span");
        const info = gamesList[key];
        a.addEventListener("click", () => {
            const background = document.createElement("div");
            const view = document.createElement("iframe");
            const exit = document.createElement("button");
            exit.textContent = "X";
            exit.style.position = "fixed";
            exit.style.top = "0px";
            exit.style.marginLeft = "auto";
            exit.style.zIndex = "1000000000";
            exit.addEventListener("click", () => background.remove());
            [
                ["height", "100vh"],
                ["width", "100vw"],
                ["display", "flex"],
                ["alignItems", "center"],
                ["backgroundColor", document.getElementById("darktest").classList.contains("darkmode") ? "gray" : "white"],
                ["position", "fixed"]
            ].forEach(([e, v]) => {
                background.style[e] = v;
            });
            view.src = (info.url.startsWith("http") ? "" : "/games/") + info.url;
            view.style.position = "absolute";
            view.style.height = "100vh";
            view.style.width = "100vw";
            background.append(exit, view);
            document.getElementById("main").after(background);
        });
        a.className = "game-icon";
        img.src = info.img;
        if (window.matchMedia("(any-pointer: coarse)").matches) span.style.opacity = 1;
        span.className = "game-name";
        span.textContent = key;
        a.append(img, span);
        document.getElementById("games").appendChild(a);
    });
}
