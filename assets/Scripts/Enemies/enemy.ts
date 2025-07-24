import audioManager from "../Game/audioManager";
import gameManager, {GameState} from "../Game/gameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class enemy extends cc.Component {

    protected direction: number = 1; // 1 for right, -1 for left

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
