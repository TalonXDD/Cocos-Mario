const {ccclass, property} = cc._decorator;

@ccclass
export default class item extends cc.Component {

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
