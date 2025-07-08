import audioManager from "../Game/audioManager";
import gameManager, {GameState} from "../Game/gameManager ";


const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property(gameManager)
    gameMgr: gameManager = null;

    @property(audioManager)
    audioMgr: audioManager = null;

    private anim: cc.Animation = null;

    // Player properties
    private health: number = 1;
    private acceleration:number = 500;
    private speedCap: number = 150;
    private runSpeedCap: number = 250; // Speed cap when running

    private jumpSpeed: number = 290;
    private jumpLength: number = 0.5; // How long the player can hold the jump key to jump higher
    private jumpTime: number = 0; // How long the player has held the jump key

    // Player state
    private direction: number = 1; // 1 for right, -1 for left
    private run: boolean = false;
    private onGround: boolean = false;
    private isHoldingJump: boolean = false;

    // Other control variables
    private isSpaceDown: boolean = false;
    private isLeftDown: boolean = false;
    private isRightDown: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    }

    start () {
        if (!this.gameMgr) {
            cc.error("GameManager component not found!");
            return;
        }
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");
        this.anim = this.getComponent(cc.Animation);

        this.direction = 1;
        this.onGround = false;
        this.run = false;
    }

    update (dt) {
        if (this.gameMgr.getGameState() == GameState.PLAYING) {
            this.updateMovement(dt);
            this.playAnimation();
        }
    }

    onKeyDown(event) {
        if (event.keyCode == cc.macro.KEY.space) {
            this.isSpaceDown = true;
            if (this.onGround) {
                this.isHoldingJump = true;
            }
        }
        else if (event.keyCode == cc.macro.KEY.a || event.keyCode == cc.macro.KEY.left) {
            this.isLeftDown = true;
            this.direction = -1;
        }
        else if (event.keyCode == cc.macro.KEY.d || event.keyCode == cc.macro.KEY.right) {
            this.isRightDown = true;
            this.direction = 1;
        }
        else if (event.keyCode == cc.macro.KEY.shift) {
            this.run = true;
        }
    }

    onKeyUp(event) {
        if (event.keyCode == cc.macro.KEY.space) {
            this.isSpaceDown = false;
            this.isHoldingJump = false;
        }
        else if (event.keyCode == cc.macro.KEY.a || event.keyCode == cc.macro.KEY.left) {
            this.isLeftDown = false;
            if (this.isRightDown) {
                this.direction = 1;
            }
        }
        else if (event.keyCode == cc.macro.KEY.d || event.keyCode == cc.macro.KEY.right) {
            this.isRightDown = false;
            if (this.isLeftDown) {
                this.direction = -1;
            }
        }
        else if (event.keyCode == cc.macro.KEY.shift) {
            this.run = false;
        }
    }

    onBeginContact(contact, self, other) {
        if (other.node.group == "Floor") {
            if (contact.getWorldManifold().normal.y <= -0.4) {
                this.resetJump();
            }
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
            else if (other.node.name == "starCoin") {
                this.gameMgr.addScore(4000);
                this.audioMgr.playStarCoin();
                other.node.destroy();
            }
        }
        else if (other.node.group == "Block") {
            if (contact.getWorldManifold().normal.y < -0.4) {
                this.resetJump();
            }
        }
        else if (other.node.group == "Pole") {
            this.gameMgr.playerWon();
        }
        else if (other.node.group == "Void") {
            this.gameMgr.playerDied();
        }
    }

    onEndContact(contact, self, other) {
        if (other.node.group == "Floor" || other.node.group == "Block") {
            if (contact.getWorldManifold().normal.y <= -0.4) {
                this.onGround = false;
            }
        }
    }

    updateMovement(dt) {
        let xspeed = this.getComponent(cc.RigidBody).linearVelocity.x;
        let yspeed = this.getComponent(cc.RigidBody).linearVelocity.y;

        // Jump logic
        if (this.isHoldingJump) {
            this.jumpTime += dt;
            if (this.jumpTime < this.jumpLength) {
                yspeed = this.jumpSpeed - 0.4 * this.jumpSpeed * (this.jumpTime / this.jumpLength); // Adjust jump speed based on hold time
                this.getComponent(cc.RigidBody).gravityScale = 0;
            }
            else {
                this.getComponent(cc.RigidBody).gravityScale = 4; 
            }
        }
        else {
            this.getComponent(cc.RigidBody).gravityScale = 4; // Reset gravity scale when not holding jump
        }

        // Movement logic
        let isMoving = this.isLeftDown || this.isRightDown;
        if (this.direction == 1) {
            if (this.isRightDown) {
                let nextx = xspeed + this.acceleration * dt; // Calculate next x speed
                if (this.run && nextx > this.runSpeedCap) { // Cap speed when running
                    xspeed = this.runSpeedCap;
                }
                else if (!this.run && nextx > this.speedCap) {
                    xspeed = this.speedCap + 0.75 * (xspeed - this.speedCap); // Allow some overshoot when walking
                }
                else {
                    xspeed += this.acceleration * dt;
                }
            }
        }
        else if (this.direction == -1) {
            if (this.isLeftDown) {
                let nextx = xspeed - this.acceleration * dt; // Calculate next x speed
                if (this.run && nextx < -this.runSpeedCap) {
                    xspeed = -this.runSpeedCap;
                }
                else if (!this.run && nextx < -this.speedCap) {
                    xspeed = -this.speedCap + 0.75 * (xspeed + this.speedCap); // Allow some overshoot when walking
                }
                else {
                    xspeed -= this.acceleration * dt;
                }
            }
        }
        if (!isMoving) {
            if (xspeed > 0) {
                xspeed -= this.acceleration * dt;
                if (xspeed < 0) xspeed = 0;
            } else if (xspeed < 0) {
                xspeed += this.acceleration * dt;
                if (xspeed > 0) xspeed = 0;
            }
        }
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(xspeed, yspeed);
        cc.log("Player Velocity: " + this.getComponent(cc.RigidBody).linearVelocity);
    }

    resetJump() {
        this.onGround = true;
        this.isHoldingJump = false;
        this.jumpTime = 0; // Reset jump time
    }

    playAnimation() {
        if (this.direction == 1) {
            this.node.scaleX = Math.abs(this.node.scaleX);
        }
        else if (this.direction == -1) {
            this.node.scaleX = -Math.abs(this.node.scaleX);
        }
    }
}
