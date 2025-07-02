const {ccclass, property} = cc._decorator;

@ccclass
export default class stageSelectBtn extends cc.Component {

    @property({type: cc.SceneAsset, tooltip: "The stage will go to."})
    goStage: cc.SceneAsset = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let btn = new cc.Component.EventHandler();
        btn.target = this.node;
        btn.component = "stageSelectBtn";
        btn.handler = "onClick";
        this.getComponent(cc.Button).clickEvents.push(btn);
    }

    // update (dt) {}

    onClick() {
        if (!this.goStage) {
            cc.error("No stage assigned to go to.");
            return;
        }
        cc.find("Canvas/StageSelectManager").getComponent("stageSelectManager").playStageSE();
        this.scheduleOnce(() => {
            cc.log("Loading stage: " + this.goStage.name);
            cc.director.loadScene(this.goStage.name);
        }, 1.5);
    }
}
