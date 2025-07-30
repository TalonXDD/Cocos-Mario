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
    protected speed: number = 30; // Speed of the enemy movement

    protected direction: number = -1; // 1 for right, -1 for left

    public isDead: boolean = false; // Flag to check if the enemy is dead
    public dangerous: boolean = false; // Flag to check if the enemy is dangerous to other enemies

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
            let inRange = Math.abs((this.node.x - playerX) * 1.125) <= screenHalfWidth + 50;
            if (inRange) {
                this.move(dt);
                this.playAnim();
            }
        }
    }

    onBeginContact(contact, self, other) {
        let normalX = contact.getWorldManifold().normal.x;
        if (other.node.group == "Void") {
            this.scheduleOnce(() => {
                this.node.destroy();
            }, 0.5);
        } 
        else if (other.node.group == "Wall") {
            if (Math.abs(normalX) > 0.71) {
                this.changeDirection(normalX);
            }
        }
        else if (other.node.group == "Enemy") {
            if (Math.abs(normalX) > 0.71) {
                if (!this.dangerous) {
                    this.changeDirection(normalX);
                }
                else {
                    contact.disabled = true;
                    this.gameMgr.shellKick();
                    other.node.destroy();
                }
            }
        }
        else if (other.node.group == "Player") {
            if (Math.abs(normalX) > 0.71) {
                if (!this.dangerous) {
                    this.changeDirection(normalX);
                }
                else {
                    contact.disabled = true;
                }
            }
        }
    }
    
    onPreSolve(contact, self, other)  {
        if (other.node.group == "Ground" || other.node.group == "Block") {
            let normalX = contact.getWorldManifold().normal.x;
            if (Math.abs(normalX) > 0.71) {
                this.changeDirection(normalX);
            }
        }
    }

    protected move(dt) {
        this.rb.linearVelocity = cc.v2(this.speed * this.direction, this.rb.linearVelocity.y);
    }

    protected changeDirection(normalX: number) {
        if (normalX > 0) {
            this.direction = -1; // Change direction to left
        }
        else if (normalX < 0) {
            this.direction = 1; // Change direction to right
        }
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
