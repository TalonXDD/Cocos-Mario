import gameManager from "./gameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class uiManager extends cc.Component {

    private gameMgr: gameManager = null;

    private timerLabel: cc.Label = null;
    private livesLabel: cc.Label = null;
    private coinsLabel: cc.Label = null;
    private scoreLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");

        this.timerLabel = cc.find("Canvas/UI/GameStates/Timer/Label").getComponent(cc.Label);
        this.livesLabel = cc.find("Canvas/UI/GameStates/Lives/Label").getComponent(cc.Label);
        this.coinsLabel = cc.find("Canvas/UI/GameStates/Coin/Label").getComponent(cc.Label);
        this.scoreLabel = cc.find("Canvas/UI/GameStates/Score/Label").getComponent(cc.Label);
    }

    update (dt) {
        this.updateUI();
    }

    updateUI() {
        this.timerLabel.string = Math.ceil(this.gameMgr.getTimer()).toString();
        this.livesLabel.string = "x" + this.gameMgr.getLives().toString().padStart(2, '0');
        this.coinsLabel.string = this.gameMgr.getCoins().toString().padStart(2, '0');
        this.scoreLabel.string = this.gameMgr.getScore().toString().padStart(8, '0');
    }
}
