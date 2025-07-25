import audioManager from "../Game/audioManager";
import gameManager, {GameState} from "../Game/gameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class enemy extends cc.Component {

    protected gameMgr: gameManager = null;
    protected audioMgr: audioManager = null;

    protected anim: cc.Animation = null;
    protected rb: cc.RigidBody = null;

    protected player: cc.Node = null;

    @property()
    protected speed: number = 100; // Speed of the enemy movement

    protected direction: number = -1; // 1 for right, -1 for left

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");

        this.anim = this.getComponent(cc.Animation);
        this.rb = this.getComponent(cc.RigidBody);

        let characterNode = this.node.parent.parent.parent; // Get the parent node (Enemy)
        this.player = cc.find("Player/mario", characterNode); // Find Player/mario
    }

    update (dt) {
        if (this.gameMgr.getGameState() == GameState.PLAYING) {
            const playerX = this.player.x;
            const screenHalfWidth = cc.winSize.width / 2;
            let inRange = Math.abs(this.node.x - playerX) <= screenHalfWidth + 100;
            if (inRange) {
                this.move(dt);
                this.playAnim();
            }
        }
    }

    onBeginContact(contact, self, other) {
        if (other.node.group == "Void") {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.5);
        } 
        else if (other.node.group == "Enemy" || other.node.group == "Wall") {
            let normalX = contact.getWorldManifold().normal.x;
            if (normalX == 1 || normalX == -1) {
                this.changeDirection(normalX);
            }
        }
        else if (other.node.group == "Player") {
            let normalX = contact.getWorldManifold().normal.x;
            let normalY = contact.getWorldManifold().normal.y;
            if (normalX == 1 || normalX == -1) {
                this.changeDirection(normalX);
            }
            else if (normalY == 1) {
                this.anim.play("goombaDead");
                this.scheduleOnce(() => {
                    this.node.destroy();
                }, 0.5);
            }
        }
    }
    
    onPreSolve(contact, self, other)  {
        if (other.node.group == "Ground" || other.node.group == "Block") {
            let normalX = contact.getWorldManifold().normal.x;
            if (normalX == 1 || normalX == -1) {
                this.changeDirection(normalX);
            }
        }
    }

    protected move(dt) {
        this.rb.linearVelocity = cc.v2(this.speed * this.direction, this.rb.linearVelocity.y);
        this.rb.gravityScale = 3; // Restore gravity
    }

    protected changeDirection(normalX: number) {
        this.direction = normalX * -1; 
    }

    protected playAnim() {
        if (this.direction == 1) {
            this.node.scaleX = -Math.abs(this.node.scaleX); // Ensure facing right
        } 
        else if (this.direction == -1) {
            this.node.scaleX = Math.abs(this.node.scaleX); // Ensure facing left
        }
    }
}
