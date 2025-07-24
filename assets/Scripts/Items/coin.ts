import item from "./item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class coin extends item {

    @property(cc.Prefab)
    private collectEffectPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        super.onBeginContact(contact, self, other);
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
