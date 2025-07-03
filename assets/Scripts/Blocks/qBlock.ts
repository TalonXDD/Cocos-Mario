const {ccclass, property} = cc._decorator;

enum qBlockType {
    COIN = 0,
    POWERUP = 1,
}

@ccclass
export default class qBlock extends cc.Component {

    @property({type: cc.Enum(qBlockType)})
    blockType: qBlockType = qBlockType.COIN;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
