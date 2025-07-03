const {ccclass, property} = cc._decorator;

enum GameState {
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
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.setGameState(GameState.LOADING);
    }

    start () {
        
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
        cc.log("Set Timer: " + this.timer);
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
}
