import block from "./block";

const {ccclass, property} = cc._decorator;

enum qBlockType {
    COIN = 0,
    POWERUP = 1,
}

@ccclass
export default class qBlock extends block {

    @property({type: cc.Enum(qBlockType)})
    blockType: qBlockType = qBlockType.COIN;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");

        this.remainHit = 1; // Reset hit count for qBlock
    }

    // update (dt) {}

    onBeginContact(contact, self, other) {
        let normalY = contact.getWorldManifold().normal.y;
        if ((other.node.group == "Player" && normalY == -1) || false) {
            this.audioMgr.playHardBrick();
            if (this.remainHit > 0) {
                switch (this.blockType) {
                    case qBlockType.COIN:
                        this.audioMgr.playCoin();
                        break;
                    case qBlockType.POWERUP:
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
