const {ccclass, property} = cc._decorator;

enum brickType {
    EMPTY = 0,
    COIN = 1,
    POWERUP = 2,
}

@ccclass
export default class brick extends cc.Component {

    @property({type: cc.Enum(brickType)})
    blockType: brickType = brickType.EMPTY;

    @property()
    hitCount: number = 1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
