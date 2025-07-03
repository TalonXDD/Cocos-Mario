const {ccclass, property} = cc._decorator;

@ccclass
export default class coinInvicible extends cc.Component {

    @property()
    changeTime: number = 0.5;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        if (other.node.group == "Player") {
            this.node.opacity = 0;
            this.scheduleOnce(() => {
                let coinPrefab = cc.resources.get('Prefabs/Items/coin', cc.Prefab);
                if (coinPrefab) {
                    let coin = cc.instantiate(coinPrefab);
                    coin.parent = this.node.parent;
                    coin.setPosition(this.node.position);
                }
                this.node.destroy();
            }, this.changeTime)
        }
    }
}
