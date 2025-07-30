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
        super.onLoad();
    }

    start () {
        super.start();

        this.remainHit = 1; // Reset hit count for brick
    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        let normalX = contact.getWorldManifold().normal.x;
        let normalY = contact.getWorldManifold().normal.y;
        if ((other.node.group == "Player" && normalY == -1) || 
            (other.node.group == "Enemy" && Math.abs(normalX) > 0.71 && other.getComponent(other.node.name).dangerous)) {
            this.audioMgr.playHardBrick();
            if (this.remainHit > 0) {
                switch (this.brickType) {
                    case brickType.EMPTY:
                        this.createBreakEffect();
                        this.audioMgr.playBrick();
                        this.node.destroy();
                        break;
                    case brickType.COIN:
                        this.createCoin();
                        this.gameMgr.collectCoin();
                        break;
                    case brickType.POWERUP:
                        this.createItem(self, other);
                        this.audioMgr.playItemAppear();
                        break;
                }
                this.moveAction();
            }
            this.remainHit--;
            if (this.remainHit <= 0) {
                this.playAnimation("HitBlock");
            }
        }
    }

    createBreakEffect() {
        let breakEffect = cc.instantiate(this.breakPrefab);
        breakEffect.parent = this.node.parent;
        breakEffect.setPosition(this.node.position);
        cc.tween(breakEffect)
            .delay(3)
            .call(() => breakEffect.destroy())
            .start();
    }
}
