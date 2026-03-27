// Input handler
class InputHandler {
    constructor(game) {
        this.game = game;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isTouching = false;
        this.bindEvents();
    }

    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Mouse movement view control - edge trigger
        const gameScreen = document.getElementById('game-screen');
        gameScreen.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch controls for mobile
        gameScreen.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        gameScreen.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        gameScreen.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    }

    handleKeyPress(e) {
        if (!this.game.state.isGameRunning) return;
        switch(e.key.toLowerCase()) {
            case 'v': 
                this.game.toggleVents(); 
                break;
            case ' ': 
                e.preventDefault();
                this.game.toggleCamera();
                break;
        }
    }
    
    showCheatNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = 'rgba(255, 215, 0, 0.9)';
        notification.style.color = '#000';
        notification.style.padding = '10px 20px';
        notification.style.fontSize = '20px';
        notification.style.fontWeight = 'bold';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '99999';
        notification.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.8)';
        notification.textContent = '🎮 CHEAT: ' + message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 1000);
    }

    handleMouseMove(e) {
        if (!this.game.state.isGameRunning || this.game.state.cameraOpen) return;
        
        const edgeThreshold = 100;
        const mouseX = e.clientX;
        const screenWidth = window.innerWidth;
        
        // Check if at left edge
        if (mouseX < edgeThreshold) {
            this.game.isRotatingLeft = true;
            this.game.isRotatingRight = false;
        }
        // Check if at right edge
        else if (mouseX > screenWidth - edgeThreshold) {
            this.game.isRotatingRight = true;
            this.game.isRotatingLeft = false;
        }
        // In middle area, stop rotation
        else {
            this.game.isRotatingLeft = false;
            this.game.isRotatingRight = false;
        }
    }
    
    handleTouchStart(e) {
        if (!this.game.state.isGameRunning || this.game.state.cameraOpen) return;
        
        // Don't prevent default if touching UI elements
        const target = e.target;
        if (target.closest('.hotspot') || target.closest('.control-panel-button') || target.closest('.camera-button') || target.closest('#control-panel-popup')) return;
        
        e.preventDefault();
        
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.isTouching = true;
    }
    
    handleTouchMove(e) {
        if (!this.game.state.isGameRunning || this.game.state.cameraOpen || !this.isTouching) return;
        
        // Don't prevent default if touching UI elements
        const target = e.target;
        if (target.closest('.hotspot') || target.closest('.control-panel-button') || 
            target.closest('.camera-button') || target.closest('#control-panel-popup')) {
            return;
        }
        
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = Math.abs(touch.clientY - this.touchStartY);
        
        // Only rotate if horizontal swipe (not vertical)
        if (deltaY < 50) {
            const sensitivity = 0.002;
            // Reverse the direction: swipe right = view right, swipe left = view left
            const movement = -deltaX * sensitivity;
            
            // Update view position directly
            this.game.viewPosition += movement;
            this.game.viewPosition = Math.max(0, Math.min(1, this.game.viewPosition));
            this.game.ui.updateViewPosition(this.game.viewPosition);
            
            // Update touch start position for smooth continuous movement
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        }
    }
    
    handleTouchEnd() {
        if (!this.game.state.isGameRunning) return;
        
        this.isTouching = false;
        this.game.isRotatingLeft = false;
        this.game.isRotatingRight = false;
    }
}
