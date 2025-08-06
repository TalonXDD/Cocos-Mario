import gameData from "../Game/gameData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class stageSelectManager extends cc.Component {

    @property(cc.AudioClip)
    BGM: cc.AudioClip = null;

    @property(cc.AudioClip)
    stageSE0: cc.AudioClip = null;

    @property(cc.AudioClip)
    stageSE1: cc.AudioClip = null;

    @property(cc.AudioClip)
    stageSE2: cc.AudioClip = null;

    @property(cc.AudioClip)
    quitSE: cc.AudioClip = null;

    private livesLabel: cc.Label = null;
    private coinsLabel: cc.Label = null;
    private scoreLabel: cc.Label = null;
    private ggLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        cc.audioEngine.playMusic(this.BGM, true);
        this.livesLabel = cc.find("Canvas/UI/Lives/Label").getComponent(cc.Label);
        this.coinsLabel = cc.find("Canvas/UI/Coin/Label").getComponent(cc.Label);
        this.scoreLabel = cc.find("Canvas/UI/Score/Label").getComponent(cc.Label);
        this.ggLabel = cc.find("Canvas/UI/GG/Label").getComponent(cc.Label);
        this.updateUI();
        cc.game.canvas.style.cursor = "default"; // Reset cursor style
    }

    // update (dt) {}

    playStageSE(): number {
        if (this.stageSE1 == null || this.stageSE2 == null) {
            // Only one SE available
            return cc.audioEngine.playEffect(this.stageSE0, false);
        }
        else {
            // Have multiple SEs
            const randomIdx = Math.floor(Math.random() * 3);
            let selectedSE = null;
            switch (randomIdx) {
                case 0:
                    selectedSE = this.stageSE0;
                    break;
                case 1:
                    selectedSE = this.stageSE1;
                    break;
                case 2:
                    selectedSE = this.stageSE2;
                    break;
                default:
                    selectedSE = this.stageSE0;
            }
            return cc.audioEngine.playEffect(selectedSE, false);
        }
    }

    playQuitSE() {
        cc.audioEngine.playEffect(this.quitSE, false);
    }

    updateUI() {
        this.livesLabel.string = "x" + gameData.lives.toString().padStart(2, '0');
        this.coinsLabel.string = gameData.coins.toString().padStart(2, '0');
        this.scoreLabel.string = gameData.score.toString().padStart(8, '0');
        this.ggLabel.string = gameData.ggCount.toString().padStart(2, '0');
    }
}
