import item from "./item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class coinInvisible extends item {

    @property()
    changeTime: number = 0.5;

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        super.onBeginContact(contact, self, other);

        if (other.node.group == "Player") {
            this.node.opacity = 0;
            this.scheduleOnce(() => {
                if (this.coinPrefab) {
                    let coin = cc.instantiate(this.coinPrefab);
                    coin.parent = this.node.parent;
                    coin.setPosition(this.node.position);
                }
                this.node.destroy();
            }, this.changeTime)
        }
    }
}
