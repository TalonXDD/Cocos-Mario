import block from "./block";

const {ccclass, property} = cc._decorator;

enum qBlockType {
    COIN = 0,
    POWERUP = 1,
}

@ccclass
export default class qBlock extends block {

    @property({type: cc.Enum(qBlockType)})
    qBlockType: qBlockType = qBlockType.COIN;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
    }

    start () {
        super.start();

        this.remainHit = 1; // Reset hit count for qBlock
    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        let normalX = contact.getWorldManifold().normal.x;
        let normalY = contact.getWorldManifold().normal.y;
        if ((other.node.group == "Player" && normalY == -1) || 
            (other.node.group == "Enemy" && Math.abs(normalX) > 0.71 && other.getComponent(other.node.name).dangerous)) {
            this.audioMgr.playHardBrick();
            if (this.remainHit > 0) {
                switch (this.qBlockType) {
                    case qBlockType.COIN:
                        this.createCoin();
                        this.gameMgr.collectCoin();
                        break;
                    case qBlockType.POWERUP:
                        this.createItem(self, other);
                        this.audioMgr.playItemAppear();
                        break;
                }
                this.moveAction();
            }
            this.remainHit--;
            this.playAnimation("HitBlock");
        }
    }
}
