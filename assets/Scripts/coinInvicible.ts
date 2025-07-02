const {ccclass, property} = cc._decorator;

@ccclass
export default class coinInvicible extends cc.Component {

    @property()
    changeTime: number = 1.0;

    private isInvicible: boolean = true;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
