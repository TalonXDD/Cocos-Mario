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
            cc.find("GameManager").getComponent("gameManager").addScore(100);
            self.node.destroy();
        }
    }
}
