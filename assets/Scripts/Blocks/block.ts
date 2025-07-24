import gameManager from "../Game/gameManager";
import audioManager from "../Game/audioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class block extends cc.Component {

    @property()
    remainHit: number = 1;

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    protected gameMgr: gameManager = null;
    protected audioMgr: audioManager = null;
    protected anim: cc.Animation = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.anim = this.getComponent(cc.Animation);
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");
    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        let normalY = contact.getWorldManifold().normal.y;
        if (other.node.group == "Player" && normalY == -1) {
            this.audioMgr.playHardBrick();
            this.remainHit--;
        }
    }

    protected playAnimation(animName: string) {
        if (!this.anim.getAnimationState(animName).isPlaying) {
            this.anim.play(animName);
        }
    }

    protected moveAction() {
        cc.tween(this.node)
            .by(0.1, { y: 12 })
            .by(0.1, { y: -12 })
            .start();
    }

    protected createCoin() {
        let coin = cc.instantiate(this.coinPrefab);
        coin.parent = this.node.parent;
        coin.setPosition(this.node.position);
        cc.tween(coin)
            .by(0.15, {y: 60})
            .delay(0.15)
            .call(() => {
                coin.destroy();
            });
    }

    protected createItem() {
        let item = cc.instantiate(this.itemPrefab);
        item.parent = this.node.parent;
        item.setPosition(this.node.position);
        
    }
}
