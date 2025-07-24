import audioManager from "./audioManager";

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
    
    // Game properties
    private timer: number = 300;
    private gameState: GameState = GameState.LOADING;

    // Player properties
    private score: number = 0;
    private coins: number = 0;
    private lives: number = 5;

    // Audio manager reference
    private audioMgr: audioManager
    
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
            if (this.getTimer() <= 0) {
                this.setGameState(GameState.GAME_OVER);
                cc.log("Game Over! Time's up!");
            }
        }
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
        this.score = value;
        cc.log("Set Score: " + this.score);
    }

    getCoins(): number {
        return this.coins;
    }

    setCoins(value: number): void {
        this.coins = value;
        cc.log("Set Coins: " + this.coins);
    }

    getLives(): number {
        return this.lives;
    }

    setLives(value: number): void {
        this.lives = value;
        cc.log("Set Lives: " + this.lives);
    }

    /**
     * Game control functions
     */

    resetGame(): void {
        this.audioMgr.stopBGM();
        this.setGameState(GameState.LOADING);
        this.setTimer(300);
        this.setScore(0);
        this.setCoins(0);
        this.setLives(5);
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
        cc.log("Add Coins: " + value + ", Current Coins: " + this.coins);
    }

    addLives(value: number): void {
        this.lives += value;
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
        this.addScore(200);
        this.audioMgr.playCoin();
    }
}
