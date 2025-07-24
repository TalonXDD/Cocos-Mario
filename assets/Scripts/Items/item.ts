import audioManager from "../Game/audioManager";
import gameManager from "../Game/gameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class item extends cc.Component {

    protected gameMgr: gameManager = null;
    protected audioMgr: audioManager = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        if (other.node.group == "Void") {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 1.0);
        }
    }
}
