const {ccclass, property} = cc._decorator;

@ccclass
export default class gameData extends cc.Component {

    static score: number = 0;
    static coins: number = 0;
    static lives: number = 5;
    static playerHealth: number = 1;
    static ggCount: number = 0; // Game Over Count
    static stage1Cleared: boolean = false;
    static stage2Cleared: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    static resetData() {
        this.lives = 5;
        this.playerHealth = 1;
        this.ggCount++;
    }
}
