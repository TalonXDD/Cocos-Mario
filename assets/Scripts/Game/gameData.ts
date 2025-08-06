const {ccclass, property} = cc._decorator;

@ccclass
export default class gameData extends cc.Component {

    static score: number = 0;
    static coins: number = 0;
    static lives: number = 5;
    static playerHealth: number = 1;
    static stage1Cleared: boolean = false;
    static stage2Cleared: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    static resetData() {
        this.score = 0;
        this.coins = 0;
        this.lives = 5;
        this.playerHealth = 1;
    }
}
