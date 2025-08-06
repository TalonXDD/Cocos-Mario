import gameManager, { GameState } from "./gameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class uiManager extends cc.Component {

    private gameMgr: gameManager = null;

    private loadingScreen: cc.Node = null;
    private loadingStage: cc.Label = null;
    private loadingLives: cc.Label = null;
    private timerLabel: cc.Label = null;
    private livesLabel: cc.Label = null;
    private coinsLabel: cc.Label = null;
    private scoreLabel: cc.Label = null;

    private gameOverScreen: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");

        this.loadingScreen = cc.find("GameUI/UI/LoadingScreen");
        this.loadingStage = cc.find("GameUI/UI/LoadingScreen/StageLabel").getComponent(cc.Label);
        this.loadingLives = cc.find("GameUI/UI/LoadingScreen/Lives/Label").getComponent(cc.Label);
        this.timerLabel = cc.find("GameUI/UI/GameStates/Timer/Label").getComponent(cc.Label);
        this.livesLabel = cc.find("GameUI/UI/GameStates/Lives/Label").getComponent(cc.Label);
        this.coinsLabel = cc.find("GameUI/UI/GameStates/Coin/Label").getComponent(cc.Label);
        this.scoreLabel = cc.find("GameUI/UI/GameStates/Score/Label").getComponent(cc.Label);

        this.gameOverScreen = cc.find("GameUI/UI/GameOverScreen");
    }

    update (dt) {
        if (this.gameMgr.getGameState() == GameState.LOADING) {
            this.loadingScreen.active = true;
            this.gameOverScreen.active = false;
            // 取得當前場景名稱
            const sceneName = cc.director.getScene().name; // 例如 "Stage1"
            // 將 "Stage1" 轉換為 "Stage 1"
            const formattedStage = sceneName.replace(/([a-zA-Z]+)(\d+)/, '$1 $2');
            this.loadingStage.string = formattedStage;
            this.loadingLives.string = "x" + this.gameMgr.getLives().toString().padStart(2, '0');
        } 
        else if (this.gameMgr.getGameState() == GameState.GAMEOVER) {
            this.loadingScreen.active = false;
            this.gameOverScreen.active = true;
        }
        else {
            this.loadingScreen.active = false;
            this.gameOverScreen.active = false;
        }
        this.updateUI();
    }

    updateUI() {
        this.timerLabel.string = Math.ceil(this.gameMgr.getTimer()).toString().padStart(3, '0');
        this.livesLabel.string = "x" + this.gameMgr.getLives().toString().padStart(2, '0');
        this.coinsLabel.string = this.gameMgr.getCoins().toString().padStart(2, '0');
        this.scoreLabel.string = this.gameMgr.getScore().toString().padStart(8, '0');
    }
}
