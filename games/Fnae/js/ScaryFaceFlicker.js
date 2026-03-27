const getBasePath = () => {
    if (window.location.pathname.includes('/FNAE-HTML5-1.2.2-fix/')) return '/FNAE-HTML5-1.2.2-fix/';
    return './';
};

const basePath = getBasePath();
const normalBackground = `${basePath}assets/images/menubackground.png`;
const scaryBackgrounds = [
    `${basePath}assets/images/scaryhawk.png`,
    `${basePath}assets/images/scaryep.png`,
    `${basePath}assets/images/scarytrump.png`
];

let scaryFaceInterval = null;
const preloadedImages = {};

function preloadBackgrounds() {
    const normalImg = new Image();
    normalImg.src = normalBackground;
    preloadedImages['normal'] = normalImg;
    
    scaryBackgrounds.forEach((bg, index) => {
        const img = new Image();
        img.src = bg;
        preloadedImages[`scary-${index}`] = img;
    });
}

function startScaryFaceFlicker() {
    if (scaryFaceInterval) stopScaryFaceFlicker();
    
    const mainMenu = document.getElementById('main-menu');
    if (!mainMenu) return;
    
    scaryFaceInterval = setInterval(() => {
        if (Math.random() < 0.1) {
            mainMenu.style.backgroundImage = `url('${scaryBackgrounds[Math.floor(Math.random() * 3)]}')`;
            const hideDelay = 50 + Math.random() * 150;
            setTimeout(() => {
                mainMenu.style.backgroundImage = `url('${normalBackground}')`;
            }, hideDelay);
        }
    }, 100);
}

function stopScaryFaceFlicker() {
    if (scaryFaceInterval) {
        clearInterval(scaryFaceInterval);
        scaryFaceInterval = null;
        
        const mainMenu = document.getElementById('main-menu');
        if (mainMenu) mainMenu.style.backgroundImage = `url('${normalBackground}')`;
    }
}
