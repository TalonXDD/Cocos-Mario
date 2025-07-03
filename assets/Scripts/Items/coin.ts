const {ccclass, property} = cc._decorator;

@ccclass
export default class coin extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        if (other.node.group == "Player") {
            cc.find("StageManager").getComponent("stageManager").addScore(100);
            self.node.destroy();
        }
    }
}
