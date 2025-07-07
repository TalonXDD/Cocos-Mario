import item from "./item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class starCoin extends item {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        super.onBeginContact(contact, self, other);
    }
}
