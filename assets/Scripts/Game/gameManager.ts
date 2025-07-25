import audioManager from "./audioManager";
import gameData from "./gameData";

const {ccclass, property} = cc._decorator;

export enum GameState {
    LOADING,
    START,
    PLAYING,
    PAUSED,
    GAME_OVER,
    WIN
}

@ccclass
export default class gameManager extends cc.Component {

    // Audio manager reference
    private audioMgr: audioManager
    
    // Game properties
    private timer: number = 200;
    private warning: boolean = false;
    private gameState: GameState = GameState.LOADING;
    private maxScore: number = 99999999; // Maximum score limit
    private maxCoins: number = 99;
    private maxLives: number = 99;

    // Player properties
    private score: number = 0;
    private coins: number = 0;
    private lives: number = 5; // Player lives  
    private playerHealth: number = 1; // Player health, 1 for small, 2 for big
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.setFrameRate(59);
    }

    start () {
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");

        this.resetGame();

        this.scheduleOnce(() => {
            this.startGame();
        }, 2); // Start the game after 2 seconds
    }

    update (dt) {
        if (this.getGameState() == GameState.PLAYING) {
            this.setTimer(this.getTimer() - dt);
            if (this.getTimer() <= 100 && !this.warning) {
                this.warning = true;
                this.audioMgr.playHurryUp();
                cc.log("Warning: Time is running out!");
            }
            if (this.getTimer() <= 0) {
                this.setGameState(GameState.GAME_OVER);
                cc.log("Game Over! Time's up!");
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
        gameData.playerHealth = this.getPlayerHealth();
    }

    LoadGameData() {
        this.setScore(gameData.score);
        this.setCoins(gameData.coins);
        this.setLives(gameData.lives);
        this.setPlayerHealth(gameData.playerHealth);
        // this.setPlayerHealth(gameData.playerHealth);
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
        if (value < 1) {
            value = 1; // Prevent health below 1
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

    resetGame(): void {
        this.audioMgr.stopBGM();
        this.setGameState(GameState.LOADING);
        this.setTimer(200);
        this.LoadGameData();
        cc.log("Game Reset!");
    }

    startGame(): void {
        this.setGameState(GameState.PLAYING);
        this.audioMgr.playBGM();
        cc.log("Game Started!");
    }

    addScore(value: number): void {
        this.score += value;
        cc.log("Add Score: " + value + ", Current Score: " + this.score);
    }

    addCoins(value: number): void {
        this.coins += value;
        if (this.coins > this.maxCoins) {
            this.coins -= 100;
            this.addLives(1); // Add a life if coins exceed maxCoins
            this.audioMgr.playOneUp100();
        }
        cc.log("Add Coins: " + value + ", Current Coins: " + this.coins);
    }

    addLives(value: number): void {
        this.lives += value;
        if (this.lives > this.maxLives) {
            this.lives = this.maxLives; // Cap lives at maxLives
        }
        cc.log("Add Lives: " + value + ", Current Lives: " + this.lives);
    }

    playerDied(): void {
        this.setGameState(GameState.GAME_OVER);
        cc.log("Player Died! Game Over!");
    }

    playerWon(): void {
        this.setGameState(GameState.WIN);
        cc.log("Player Won! Congratulations!");
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
        }
        else if (this.getPlayerHealth() == 2) {
            this.audioMgr.playGetItemAgain();
        }
        this.addScore(1000);
    }

    collectMushroom1Up(): void {
        this.addLives(1);
        this.audioMgr.playOneUp();
        cc.log("Collected 1-Up Mushroom!");
    }
}
