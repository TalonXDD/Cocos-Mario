import enemy from "./enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class goomba extends enemy {

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        super.start();
        
    }

    update (dt) {
        super.update(dt);
    }
}
