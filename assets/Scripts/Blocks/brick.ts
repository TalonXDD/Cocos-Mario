import block from "./block";

const {ccclass, property} = cc._decorator;

enum brickType {
    EMPTY = 0,
    COIN = 1,
    POWERUP = 2,
}

@ccclass
export default class brick extends block {

    @property({type: cc.Enum(brickType)})
    brickType: brickType = brickType.EMPTY;

    @property(cc.Prefab)
    breakPrefab: cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");

        this.remainHit = 1; // Reset hit count for brick
    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        let normalY = contact.getWorldManifold().normal.y;
        if ((other.node.group == "Player" && normalY == -1) || false) {
            this.audioMgr.playHardBrick();
            if (this.remainHit > 0) {
                switch (this.brickType) {
                    case brickType.EMPTY:
                        let breakEffect = cc.instantiate(this.breakPrefab);
                        breakEffect.parent = this.node.parent;
                        breakEffect.setPosition(this.node.position);
                        cc.tween(breakEffect)
                            .delay(3)
                            .call(() => breakEffect.destroy())
                            .start();
                        this.audioMgr.playBrick();
                        this.node.destroy();
                        break;
                    case brickType.COIN:
                        this.moveAction();
                        this.gameMgr.collectCoin();
                        break;
                    case brickType.POWERUP:
                        this.moveAction();
                        this.audioMgr.playItemAppear();
                        break;
                }
            }
            this.remainHit--;
            if (this.remainHit <= 0) {
                this.playAnimation("HitBlock");
            }
        }
    }
}
