import audioManager from "../Game/audioManager";
import gameManager from "../Game/gameManager ";

const {ccclass, property} = cc._decorator;

enum Direction {
    LEFT,
    RIGHT,
}

@ccclass
export default class player extends cc.Component {

    private gameMgr: gameManager = null;
    private audioMgr: audioManager = null;

    private anim: cc.Animation = null;

    // Player properties
    private health: number = 1;
    private speed: number = 2;
    private speedCap: number = 5;
    private jumpSpeed: number = 10;

    // Player state
    private direction: Direction = Direction.RIGHT;
    private onGround: boolean = false;
    private run: boolean = false;
    private jumpable: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    }

    start () {
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");
        this.anim = this.getComponent(cc.Animation);
    }

    update (dt) {

    }

    FixedUpdate (dt) {
        
    }

    onKeyDown(event) {
        if (event.keyCode == cc.macro.KEY.space) {

        }
        else if (event.keyCode == cc.macro.KEY.a) {

        }
        else if (event.keyCode == cc.macro.KEY.d) {

        }
        else if (event.keyCode == cc.macro.KEY.shift) {

        }
    }

    onKeyUp(event) {
        
    }

    onBeginContact(contact, self, other) {
        if (other.node.group == "Floor") {
            this.onGround = true;
            this.jumpable = true;
        }
        else if (other.node.group == "Enemy") {
            if (contact.getWorldManifold().normal.y != -1) {
                this.health--;
                if (this.health <= 0) {
                    this.gameMgr.playerDied();
                }
            }
        }
        else if (other.node.group == "Item") {
            if (other.node.name == "coin") {
                this.gameMgr.addScore(100);
                this.gameMgr.addCoins(1);
                this.audioMgr.playCoin();
                other.node.destroy();
            }
            else if (other.node.name == "mushroom") {

            }
        }
        else if (other.node.group == "Block") {

        }
        else if (other.node.group == "Pole") {
            this.gameMgr.playerWon();
        }
        else if (other.node.group == "Void") {
            this.gameMgr.playerDied();
        }
    }
}
