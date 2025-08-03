import audioManager from "./audioManager";
import gameData from "./gameData";

const {ccclass, property} = cc._decorator;

export enum GameState {
    LOADING,
    START,
    PLAYING,
    PAUSED,
    DIED,
    WIN,
    GAMEOVER,
}

@ccclass
export default class gameManager extends cc.Component {

    // Audio manager reference
    private audioMgr: audioManager = null;
    
    // Game properties
    private timer: number = 0;
    private warning: boolean = false;
    private gameState: GameState = GameState.LOADING;
    private initTimer: number = 300; // Initial timer value
    private maxScore: number = 99999999; // Maximum score limit
    private maxCoins: number = 99;
    private maxLives: number = 99;

    // Player properties
    private score: number = 0;
    private coins: number = 0;
    private lives: number = 5; // Player lives  
    private playerHealth: number = 1; // Player health, 1 for small, 2 for big

    private callOnce: boolean = false; // Flag to ensure certain actions are called only once
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.game.setFrameRate(59);
    }

    start () {
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");

        this.resetGame();
        // Show loading screen or splash screen
        // TODO...
        // 
        this.scheduleOnce(() => {
            this.startGame();
        }, 2); // Start the game after 2 seconds
    }

    update (dt) {
        if (this.getGameState() == GameState.PLAYING) {
            this.setTimer(this.getTimer() - dt * 1.25);
            if (this.getTimer() <= 100 && !this.warning) {
                this.warning = true;
                this.audioMgr.playHurryUp();
                cc.log("Warning: Time is running out!");
            }
            if (this.getTimer() <= 0) {
                this.playerDied();
            }
        }
        else if (this.getGameState() == GameState.DIED) {
            if (this.callOnce) {
                if (this.getLives() <= 0) {
                    this.setGameState(GameState.GAMEOVER);
                }
                else {
                    this.scheduleOnce(() => {
                        this.setPlayerHealth(1); // Reset player health to small
                        this.SaveGameData();
                        cc.director.loadScene(cc.director.getScene().name);
                    }, 2.5);
                }
                this.callOnce = false; // Reset flag after handling
            }
        }
    }

    /**
     * Save and Load functions
     */
    SaveGameData() {
        gameData.score = this.getScore();
        gameData.coins = this.getCoins();
        gameData.lives = this.getLives();
        gameData.playerHealth = (this.getPlayerHealth() <= 0) ? 1 : this.getPlayerHealth(); // Ensure health is at least 1
        cc.log("Game Data Saved: ");
        cc.log("Score: " + gameData.score);
        cc.log("Coins: " + gameData.coins); 
        cc.log("Lives: " + gameData.lives);
        cc.log("Player Health: " + gameData.playerHealth);
    }

    LoadGameData() {
        cc.log("Game Data Loaded: ");
        this.setScore(gameData.score);
        this.setCoins(gameData.coins);
        this.setLives(gameData.lives);
        this.setPlayerHealth(gameData.playerHealth);
    }

    /**
     * Getters and Setters functions
     */

    getTimer(): number {
        return this.timer;
    }

    setTimer(value: number): void {
        this.timer = value;
        // cc.log("Set Timer: " + this.timer);
    }

    getGameState(): GameState {
        return this.gameState;
    }

    setGameState(state: GameState): void {
        this.gameState = state;
        cc.log("Set Game State: " + GameState[this.gameState]);
    }

    getScore(): number {
        return this.score;
    }

    setScore(value: number): void {
        if (value < 0) {
            value = 0; // Prevent negative scores
        }
        else if (value > this.maxScore) {
            value = this.maxScore; // Cap score at maxScore
        }
        this.score = value;
        cc.log("Set Score: " + this.score);
    }

    getCoins(): number {
        return this.coins;
    }

    setCoins(value: number): void {
        if (value < 0) {
            value = 0; // Prevent negative coins
        }
        else if (value > this.maxCoins) {
            value = this.maxCoins; // Cap coins at maxCoins
        }
        this.coins = value;
        cc.log("Set Coins: " + this.coins);
    }

    getLives(): number {
        return this.lives;
    }

    setLives(value: number): void {
        if (value < 0) {
            value = 0; // Prevent negative lives
        }
        else if (value > this.maxLives) {
            value = this.maxLives; // Cap lives at maxLives
        }
        this.lives = value;
        cc.log("Set Lives: " + this.lives);
    }

    getPlayerHealth(): number {
        return this.playerHealth;
    }

    setPlayerHealth(value: number): void {
        if (value < 0) {
            value = 0; // Prevent health below 0
        }
        else if (value > 2) {
            value = 2; // Cap health at 2 (small or big)
        }
        this.playerHealth = value;
        cc.log("Set Player Health: " + this.playerHealth);
    }

    /**
     * Game control functions
     */

    private resetGame(): void {
        this.audioMgr.stopBGM();
        this.setGameState(GameState.LOADING);
        this.setTimer(this.initTimer);
        this.LoadGameData();
        cc.log("Game Reset!");
    }

    private startGame(): void {
        this.setGameState(GameState.PLAYING);
        this.audioMgr.playBGM();
        cc.log("Game Started!");
    }

    addScore(value: number): void {
        this.setScore(this.getScore() + value);
        cc.log("Score - Add: " + value + ", Current: " + this.getScore());
    }

    addCoins(value: number): void {
        let result = this.getCoins() + value;
        if (result > this.maxCoins) {
            while(result > this.maxCoins) {
                result -= 100; // 每100個硬幣增加1條命
                this.setLives(this.getLives() + 1);
                this.audioMgr.playOneUp100();
            }
        }
        this.setCoins(result);
        cc.log("Coins - Add: " + value + ", Current: " + this.getCoins());
    }

    addLives(value: number): void {
        this.setLives(this.getLives() + value);
        cc.log("Lives - Add: " + value + ", Current: " + this.getLives());
    }

    PlayerHurt(): void {
        this.setPlayerHealth(this.getPlayerHealth() - 1);
        if (this.getPlayerHealth() >= 1) {
            this.audioMgr.playChangeSmall();
            cc.log("Player Hurt!");
        }
        else if (this.getPlayerHealth() <= 0) {
            this.playerDied();
        } 
    }

    playerDied(): void {
        this.audioMgr.playDead();
        this.setLives(this.getLives() - 1);
        this.setGameState(GameState.DIED);
        this.callOnce = true; // Set flag to prevent multiple calls
        cc.log("Player Died!");
    }

    playerWon(): void {
        this.setGameState(GameState.WIN);
        cc.log("Player Won! Congratulations!");
    }

    gameOver(): void {
        this.audioMgr.playGameOver();
        cc.log("Player has no lives left. Game Over!");
    }

    collectCoin(): void {
        this.addCoins(1);
        this.addScore(100);
        this.audioMgr.playCoin();
    }

    collectMushroom(): void {
        if (this.getPlayerHealth() == 1) {
            this.setPlayerHealth(2); // Change to big
            this.audioMgr.playChangeBig();
            cc.log("Collected Mushroom!");
        }
        else if (this.getPlayerHealth() == 2) {
            this.audioMgr.playGetItemAgain();
            cc.log("Already big!");
        }
        this.addScore(1000);
    }

    collectMushroom1Up(): void {
        this.addLives(1);
        this.audioMgr.playOneUp();
        cc.log("Collected 1-Up Mushroom!");
    }

    enemyHurt(): void {
        this.audioMgr.playEnemyHurt();
        this.addScore(200);
    }

    shellKick(): void {
        this.audioMgr.playShellKick();
        this.addScore(200);
    }
}
