import audioManager from "../Game/audioManager";
import gameManager, {GameState} from "../Game/gameManager ";


const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    @property(gameManager)
    gameMgr: gameManager = null;

    @property(audioManager)
    audioMgr: audioManager = null;

    // Player components
    private rb: cc.RigidBody = null;
    private anim: cc.Animation = null;

    // Player properties
    private health: number = 1;
    private acceleration:number = 800;
    private speedCap: number = 120;
    private runSpeedCap: number = 220; // Speed cap when running

    private jumpSpeed: number = 330;
    private jumpLength: number = 0.3; // How long the player can hold the jump key to jump higher
    private jumpTime: number = 0; // How long the player has held the jump key

    // Player state
    private direction: number = 1; // 1 for right, -1 for left
    private onGround: boolean = false;
    private run: boolean = false;
    private isJumping: boolean = false;
    private isHoldingJump: boolean = false;

    // Animation properties
    private jumpID: number = 1; // 1 for jump1_s, -1 for jump2_s

    // Other control variables
    private isSpaceDown: boolean = false;
    private isLeftDown: boolean = false;
    private isRightDown: boolean = false;
    private isShiftDown: boolean = false;

    // Testing variables
    private contact: any = null; // Placeholder for contact object

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        if (!this.gameMgr) {
            cc.error("GameManager component not found!");
            return;
        }
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");
        this.rb = this.getComponent(cc.RigidBody);
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
            if (this.onGround && !this.isJumping) {
                this.isJumping = true;
                this.isHoldingJump = true;
                this.jumpID *= -1;
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
            this.isShiftDown = true;
        }
        else if (event.keyCode == cc.macro.KEY.p) {
            cc.log("Contact: ", this.contact);
            cc.log("GetWorldManifold", this.contact.getWorldManifold());
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
            this.isShiftDown = false;
        }
    }

    onBeginContact(contact, self, other) {
        if (other.node.group == "Ground") {
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
        
        this.contact = contact; // Store contact for later use
    }

    // onPreSolve(contact, self, other) {
    //     if (other.node.group == "Ground" || other.node.group == "Block") {
    //         if (contact.getWorldManifold().normal.y < -0.4) {
    //             this.onGround = true;
    //         }
    //     }
    // }

    onEndContact(contact, self, other) {
        if (other.node.group == "Ground" || other.node.group == "Block") {
            if (contact.getWorldManifold().normal.y <= -0.4) {
                this.onGround = false;
            }
        }
    }

    updateMovement(dt) {
        let xspeed = this.rb.linearVelocity.x;
        let yspeed = this.rb.linearVelocity.y;

        // Jump logic
        if (this.isHoldingJump) {
            this.jumpTime += dt;
            if (this.jumpTime < this.jumpLength) {
                yspeed = this.jumpSpeed
            }
        }

        // Movement logic
        let isMoving = this.isLeftDown || this.isRightDown; 
        let inAir = this.onGround ? 1 : 0.5; // Apply less acceleration when in air
        this.run = this.onGround ? this.isShiftDown : this.run; // Only change run state when on ground
        if (this.direction == 1) {
            if (this.isRightDown) {
                let nextx = xspeed + inAir * this.acceleration * dt; // Calculate next x speed
                if (this.run && nextx > this.runSpeedCap) {
                    xspeed = this.runSpeedCap; // Cap speed when running
                }
                else if (!this.run && nextx > this.speedCap) {
                    xspeed = this.speedCap + 0.75 * (xspeed - this.speedCap); // Gradually reduce speed to walking speed
                }
                else {
                    xspeed += inAir * this.acceleration * dt;
                }
            }
        }
        else if (this.direction == -1) {
            if (this.isLeftDown) {
                let nextx = xspeed - inAir * this.acceleration * dt; // Calculate next x speed
                if (this.run && nextx < -this.runSpeedCap) {
                    xspeed = -this.runSpeedCap; // Cap speed when running
                }
                else if (!this.run && nextx < -this.speedCap) {
                    xspeed = -this.speedCap + 0.75 * (xspeed + this.speedCap); // Gradually reduce speed to walking speed
                }
                else {
                    xspeed -= inAir * this.acceleration * dt;
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
        this.rb.linearVelocity = cc.v2(xspeed, yspeed);
        cc.log("Player Velocity: " + this.rb.linearVelocity);
    }

    resetJump() {
        this.onGround = true;
        this.isJumping = false;
        this.isHoldingJump = false;
        this.jumpTime = 0; // Reset jump time
        this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, 0); // Reset vertical velocity
    }

    playAnimation() {
        if (this.direction == 1) {
            this.node.scaleX = Math.abs(this.node.scaleX);
        }
        else if (this.direction == -1) {
            this.node.scaleX = -Math.abs(this.node.scaleX);
        }

        let isMoving = this.isLeftDown || this.isRightDown
        let animName = null;
        if (this.isJumping) {
            if (this.run) {
                animName = "jumpRun_s";
            }
            else {
                if (this.jumpID > 0) {
                    animName = "jump1_s";
                }
                else {
                    animName = "jump2_s";
                }
            }
        }
        else if (isMoving) {
            if (this.run) {
                if (this.rb.linearVelocity.x * this.direction < 0) {
                    animName = "changeDir_s";
                }
                else {
                    animName = "run_s";
                }
            }
            else {
                animName = "walk_s";
            }
        }
        else {
            animName = "idle_s";
        }

        if (!this.anim.getAnimationState(animName).isPlaying) {
            this.anim.play(animName);
        }
    }
}
