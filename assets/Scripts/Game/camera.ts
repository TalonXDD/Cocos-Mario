import gameManager, { GameState } from "./gameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    private gameMgr: gameManager = null;

    private cam: cc.Camera = null;

    @property(cc.Node)
    player: cc.Node = null;

    private playerX: number = 0;
    private leftBound: number = -2454;
    private rightBound: number = 2454;

    private zoomRatio: number = 5;
    
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cam = this.getComponent(cc.Camera);
    }

    start () {
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");
    }

    update (dt) {
        const gs = this.gameMgr.getGameState();
        if (gs == GameState.PLAYING || gs == GameState.DIED) {
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
        else if (gs == GameState.WIN) {
            
        }
    }
}
