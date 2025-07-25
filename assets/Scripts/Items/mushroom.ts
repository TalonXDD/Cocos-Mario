import item from "./item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class mushroom extends item {

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

    onPreSolve(contact: any, self: any, other: any): void {
        super.onPreSolve(contact, self, other);
    }
}
