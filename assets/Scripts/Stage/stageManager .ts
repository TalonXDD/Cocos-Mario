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
export default class stageManager extends cc.Component {

    private timer: number = 300;
    private score: number = 0;
    private gameState: GameState = GameState.LOADING;
    
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

    getScore(): number {
        return this.score;
    }

    setScore(value: number): void {
        this.score = value;
        cc.log("Set Score: " + this.score);
    }

    getGameState(): GameState {
        return this.gameState;
    }

    setGameState(state: GameState): void {
        this.gameState = state;
        cc.log("Set Game State: " + GameState[this.gameState]);
    }

    /**
     * Game control functions
     */

    addScore(value: number): void {
        this.score += value;
        cc.log("Add Score: " + value + ", Current Score: " + this.score);
    }

    
}
