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

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
    }

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

    // Create coin when block is hit
    protected createCoin() {
        if (!this.coinPrefab) {
            cc.warn("Coin prefab is not set!");
            return;
        }
        let coin = cc.instantiate(this.coinPrefab);
        coin.parent = this.node.parent;
        coin.setPosition(this.node.position);
        coin.setSiblingIndex(this.node.getSiblingIndex()); // Place coin before the block
        coin.getComponent(cc.Animation).play("CoinShowUp");
        coin.getComponent(cc.PhysicsCircleCollider).enabled = false; // Disable collider temporarily
        cc.tween(coin)
            .by(0.2, {y: 48})
            .delay(0.3)
            .call(() => {
                coin.destroy();
            })
            .start();
    }

    // Create item when block is hit
    protected createItem(self, other) {
        if (!this.itemPrefab) {
            cc.warn("Item prefab is not set!");
            return;
        }
        const playerWorldPos = other.node.parent.convertToWorldSpaceAR(other.node.position);
        const selfWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        const direction = playerWorldPos.x < selfWorldPos.x ? 1 : -1;
        this.scheduleOnce(() => {
            let item = cc.instantiate(this.itemPrefab);
            item.parent = this.node.parent;
            item.setPosition(this.node.position);
            item.setSiblingIndex(this.node.getSiblingIndex()); // Place item before the block
            item.getComponent(item.name).showUp(direction);
        }, 0.2);
    }
}
