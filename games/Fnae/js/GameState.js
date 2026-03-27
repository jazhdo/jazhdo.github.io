class GameState {
    constructor() {
        this.currentNight = 1;
        this.maxNights = 5;
        this.currentTime = 0;
        this.oxygen = 100;
        this.isGameRunning = false;
        this.tutorialActive = false;
        this.currentScene = 'office';
        this.cameraOpen = false;
        this.ventsClosed = false;
        this.ventsToggling = false;
        this.currentCam = 'cam11';
        this.cameraFailed = false;
        this.cameraRestarting = false;
        this.controlPanelBusy = false;

        this.customNight = false;
        this.customAILevels = {
            epstein: 0,
            trump: 0,
            hawking: 0
        };
    }

    reset() {
        this.currentTime = 0;
        this.oxygen = 100;
        this.isGameRunning = true;
        this.tutorialActive = false;
        this.currentScene = 'office';
        this.cameraOpen = false;
        this.ventsClosed = false;
        this.ventsToggling = false;
        this.currentCam = 'cam11';
        this.cameraFailed = false;
        this.cameraRestarting = false;
        this.controlPanelBusy = false;
    }
}
