class AssetManager {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.loaded = false;
        this.volumeSettings = this.loadVolumeSettings();
    }
    
    loadVolumeSettings() {
        const saved = localStorage.getItem('fnae_volume_settings');
        if (saved) return JSON.parse(saved);
        return {
            master: 0.7,
            gameBg: 0.7,
            menuMusic: 0.7,
            jumpscare: 0.7,
            ventCrawling: 0.7
        };
    }
    
    saveVolumeSettings() { localStorage.setItem('fnae_volume_settings', JSON.stringify(this.volumeSettings)); }
    
    setVolume(type, volume) {
        this.volumeSettings[type] = Math.max(0, Math.min(1, volume));
        this.saveVolumeSettings();
    }
    
    getVolume(type) { return this.volumeSettings[type] || 0.7; }
    
    getAllVolumes() { return this.volumeSettings; }

    async loadAssets() {
        const imagePaths = {
            office: `./assets/images/original.png`,
            cam1: `./assets/images/Cam1.png`,
            cam2: `./assets/images/Cam2.png`,
            cam3: `./assets/images/Cam3.png`,
            cam4: `./assets/images/Cam4.png`,
            cam5: `./assets/images/Cam5.png`,
            cam6: `./assets/images/Cam6.png`,
            cam7: `./assets/images/Cam7.png`,
            cam8: `./assets/images/Cam8.png`,
            cam9: `./assets/images/Cam9.png`,
            cam10: `./assets/images/Cam10.png`,
            cam11: `./assets/images/Cam11.png`,
            jumpscare: `./assets/images/jump.png`,
            trumpJumpscare: `./assets/images/jumptrump.png`,
            hawkingJumpscare: `./assets/images/scaryhawking.png`,
        };

        const soundPaths = {
            ambient: `./assets/sounds/music.ogg`,
            static: `./assets/sounds/Static_sound.ogg`,
            staticLoop: `./assets/sounds/Static_sound.ogg`,
            vents: `./assets/sounds/vents.ogg`,
            ventCrawling: `./assets/sounds/vent-crawling.mp3`,
            jumpscare: `./assets/sounds/jumpcare.ogg`,
            hawkingJumpscare: `./assets/sounds/stephenjumpscare.ogg`,
            blip: `./assets/sounds/Blip.ogg`,
            win: `./assets/sounds/winmusic.ogg`,
            chimes: `./assets/sounds/chimes.ogg`,
            crank1: `./assets/sounds/Crank1.ogg`,
            crank2: `./assets/sounds/Crank2.ogg`,
            ekg: `./assets/sounds/ekg.wav`,
            hawking_shock: `./assets/sounds/hawking_shock.wav`,
            goldenstephenscare: `./assets/sounds/goldenstephenscare.ogg`,
        };

        for (const [key, path] of Object.entries(imagePaths)) {
            try {
                this.images[key] = await this.loadImage(path);
            } catch (e) {
                console.warn(`Failed to load image: ${path}`);
            }
        }

        for (const [key, path] of Object.entries(soundPaths)) {
            try {
                this.sounds[key] = new Audio(path);
            } catch (e) {
                console.warn(`Failed to load sound: ${path}`);
            }
        }
        this.loaded = true;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    playSound(key, loop = false, volume = 1.0) {
        if (this.sounds[key]) {
            this.sounds[key].loop = loop;
            let categoryVolume = this.volumeSettings.master;
            if (key === 'music' || key === 'music3') categoryVolume *= this.volumeSettings.menuMusic;
            else if (key === 'jumpscare' || key === 'hawkingJumpscare' || key === 'trumpJumpscare') categoryVolume *= this.volumeSettings.jumpscare;
            else if (key === 'ventCrawling') categoryVolume *= this.volumeSettings.ventCrawling;
            else if (key === 'vents' || key === 'ambience' || key === 'staticLoop' || key === 'static' || key === 'blip' || key === 'Blip') categoryVolume *= this.volumeSettings.gameBg;
            this.sounds[key].volume = Math.min(1, volume * categoryVolume);
            this.sounds[key].play();
        }
    }

    stopSound(key) {
        if (this.sounds[key]) {
            this.sounds[key].pause();
            this.sounds[key].currentTime = 0;
        }
    }

    setSoundVolume(key, volume) { if (this.sounds[key]) this.sounds[key].volume = volume; }
}
