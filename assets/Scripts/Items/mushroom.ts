import item from "./item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class mushroom extends item {

    @property()
    speed: number = 100;

    private direction: number = 1; // 1 for right, -1 for left

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        super.onBeginContact(contact, self, other);
    }

    setDirection(direction: number) {
        this.direction = direction;
    }
}
