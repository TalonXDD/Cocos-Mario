const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    private playerX: number = 0;
    private leftBound: number = -2454;
    private rightBound: number = 2454;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        if (this.player) {
            if (this.player.x < this.leftBound) {
                this.node.x = this.leftBound;
            }
            else if (this.player.x > this.rightBound) {
                this.node.x = this.rightBound;
            } else {
                this.node.x = this.player.x;
            }
        }
    }
}
