import item from "./item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class mushroom1Up extends item {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        super.start();
    }

    update (dt) {
        super.update(dt);
    }

    onBeginContact(contact, self, other) {
        super.onBeginContact(contact, self, other);
    }
}
