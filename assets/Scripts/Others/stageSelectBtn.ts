import gameData from "../Game/gameData";
import stageSelectManager from "./stageSelectManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class stageSelectBtn extends cc.Component {

    @property(cc.SceneAsset)
    goStage: cc.SceneAsset = null;

    private stageSelectMgr: stageSelectManager = null;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.stageSelectMgr = cc.find("StageSelectManager").getComponent(stageSelectManager);
    }

    start () {
        let btn = new cc.Component.EventHandler();
        btn.target = this.node;
        btn.component = "stageSelectBtn";
        btn.handler = "onClick";
        this.getComponent(cc.Button).clickEvents.push(btn);
        if (this.goStage.name == "Stage2" && !gameData.stage1Cleared) {
            this.getComponent(cc.Button).interactable = false; // Disable button if Stage 1 is not cleared
        }
    }

    // update (dt) {}

    onClick() {
        if (!this.goStage) {
            cc.error("No stage assigned to go to.");
            return;
        }
        let id = this.stageSelectMgr.playStageSE();
        cc.audioEngine.setFinishCallback(id, () => {
            this.scheduleOnce(() => {
                cc.log("Loading stage: " + this.goStage.name);
                cc.director.loadScene(this.goStage.name);
            }, 1.0);
        });
    }
}
