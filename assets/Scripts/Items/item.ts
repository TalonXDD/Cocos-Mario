import audioManager from "../Game/audioManager";
import gameManager, { GameState } from "../Game/gameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class item extends cc.Component {

    protected gameMgr: gameManager = null;
    protected audioMgr: audioManager = null;

    protected anim: cc.Animation = null;
    protected rb: cc.RigidBody = null;
    protected boxCollider: cc.PhysicsBoxCollider = null;
    protected circleCollider: cc.PhysicsCircleCollider = null;

    @property()
    protected speed: number = 100;

    protected collectable: boolean = false; // 是否可以被收集
    protected moveable: boolean = false; // 是否可以移動
    protected direction: number = 1; // 1 for right, -1 for left

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");
        this.anim = this.getComponent(cc.Animation);
        this.rb = this.getComponent(cc.RigidBody);
        this.boxCollider = this.getComponent(cc.PhysicsBoxCollider);
        this.circleCollider = this.getComponent(cc.PhysicsCircleCollider);
    }

    update (dt) {
        if (!this.collectable) {
            return; 
        }
        else {
            if (this.gameMgr.getGameState() == GameState.PLAYING || this.gameMgr.getGameState() == GameState.DIED) {
                if (this.moveable) {
                    this.rb.linearVelocity = cc.v2(this.speed * this.direction, this.rb.linearVelocity.y);
                    this.rb.gravityScale = 3; // 恢復重力
                }
                else {
                    this.rb.linearVelocity = cc.v2(0, 0);
                    this.rb.gravityScale = 0; // 停止重力
                }
            }
        }
        
    }

    onBeginContact(contact, self, other) {
        if (other.node.group == "Void") {
            this.node.destroy();
        }
        else if (other.node.group == "Wall") {
            let normalX = contact.getWorldManifold().normal.x;
            if (normalX == 1 || normalX == -1) {
                this.changeDirection(normalX);
            }
        }
        else if (other.node.group == "Player" && this.collectable) {
            contact.disabled = true; // 禁用碰撞檢測，避免重複觸發
            this.node.destroy();
        }
    }

    onPreSolve(contact, self, other) {
        if (other.node.group == "Ground" || other.node.group == "Block") {
            let normalX = contact.getWorldManifold().normal.x;
            if (normalX == 1 || normalX == -1) {
                this.changeDirection(normalX);
            }
        }
    }

    showUp(direction: number) {
        cc.tween(this.node)
            .by(0.5, { y: 24 })
            .call(() => {
                this.setDirection(direction);
                this.boxCollider.enabled = true; // 啟用碰撞檢測
                this.circleCollider.enabled = true; // 啟用圓形碰撞檢測
                this.collectable = true; // 標記為可被收集
                this.moveable = true; // 開始可以移動
            })
            .start();
    }

    setDirection(direction: number) {
        this.direction = direction;
    }

    changeDirection(normalX: number) {
        this.direction = normalX * -1; // 反轉方向
    }
}
