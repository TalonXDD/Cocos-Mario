import item from "./item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class coin extends item {

    @property(cc.Prefab)
    private collectEffectPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        super.start();
    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        if (other.node.group == "Void") {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.5);
        }
        else if (other.node.group == "Player" && this.collectable) {
            this.gameMgr.collectCoin();
            this.createCollectEffect();
        }
    }

    createCollectEffect() {
        if (this.collectEffectPrefab) {
            let effect = cc.instantiate(this.collectEffectPrefab);
            effect.parent = this.node.parent;
            effect.setPosition(this.node.position);
        }
        this.node.destroy();
    }
}
