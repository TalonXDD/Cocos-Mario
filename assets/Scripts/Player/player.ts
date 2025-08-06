import audioManager from "../Game/audioManager";
import gameManager, {GameState} from "../Game/gameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class player extends cc.Component {

    // Game manager and audio manager references
    private gameMgr: gameManager = null;
    private audioMgr: audioManager = null;

    // Player components
    private rb: cc.RigidBody = null;
    private anim: cc.Animation = null;

    // Player properties
    private direction: number = 1; // 1 for right, -1 for left

    private acceleration:number = 550;
    private speedCap: number = 125;
    private runSpeedCap: number = 250; // Speed cap when running

    private jumpSpeed: number = 330;
    private jumpLength: number = 0.3; // How long the player can hold the jump key to jump higher
    private jumpTime: number = 0; // How long the player has held the jump key

    // Player state
    private onGround: boolean = false;
    private run: boolean = false;
    private isJumping: boolean = false;
    private isHoldingJump: boolean = false;
    public invisible: boolean = false; // Player is invisible
    private isDead: boolean = false; // Player is dead

    // Animation properties
    private jumpID: number = 1; // 1 for jump1, -1 for jump2
    private playOnce: boolean = false; 

    // Other control variables
    private isSpaceDown: boolean = false;
    private isLeftDown: boolean = false;
    private isRightDown: boolean = false;
    private isShiftDown: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.director.getPhysicsManager().enabled = true; // Enable physics manager
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.anim = this.getComponent(cc.Animation);
        this.rb = this.getComponent(cc.RigidBody);
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        this.gameMgr = cc.find("GameManager").getComponent("gameManager");
        this.audioMgr = cc.find("AudioManager").getComponent("audioManager");
        this.direction = 1;
        this.onGround = false;
        this.run = false;
    }

    update (dt) {
        const gs = this.gameMgr.getGameState();
        if (gs == GameState.PLAYING) {
            this.updateMovement(dt);
        }
        this.playAnimation(this.playOnce);
    }

    onKeyDown(event) {
        if (event.keyCode == cc.macro.KEY.space || event.keyCode == cc.macro.KEY.w || event.keyCode == cc.macro.KEY.up) {
            this.isSpaceDown = true;
            if (this.onGround && !this.isJumping) {
                this.audioMgr.playJump();
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
        // Debugging controls
        else if (event.keyCode == cc.macro.KEY.i) {
            this.node.setPosition(2200, 92);
        }
        else if (event.keyCode == cc.macro.KEY.o) {
            if (this.gameMgr.getPlayerHealth() == 1) {
                this.changeBig(); // Change player size to big
            }
            this.gameMgr.collectMushroom();
        }
        else if (event.keyCode == cc.macro.KEY.p) {
            this.gameMgr.setTimer(this.gameMgr.getTimer() - 10);
        }
        else if (event.keyCode == cc.macro.KEY["["]) {
            cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_shapeBit;
        }
        else if (event.keyCode == cc.macro.KEY["]"]) {
            cc.director.getPhysicsManager().debugDrawFlags = 0; // Disable debug draw
        }
    }

    onKeyUp(event) {
        if (event.keyCode == cc.macro.KEY.space || event.keyCode == cc.macro.KEY.w || event.keyCode == cc.macro.KEY.up) {
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
        let normalX = contact.getWorldManifold().normal.x;
        let normalY = contact.getWorldManifold().normal.y;
        // cc.log("Normal:" + contact.getWorldManifold().normal + ", Other:", other.node.name);

        if (other.node.group == "Ground") { // Player is on the ground
            if (other.node.name == "Orange" && normalY != -1) { // One-Way platform
                contact.disabled = true; // Disable contact to prevent further collisions
            }
            else if (normalY < -0.6) {
                // this.node.setPosition(this.node.x, (this.node.y + 1000));
                this.resetJump();
            }
            else if (normalY == 1) { // Player hit head
                this.isHoldingJump = false; // Reset jump hold when hitting the ground from above
                this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, 0); // Reset vertical velocity
            }
        }
        else if (other.node.group == "Enemy") {
            let enemyDead = other.getComponent(other.node.name).isDead;
            if (other.node.name == "goomba") {
                if (normalY < -0.6 || (normalY < -0.3 && this.rb.linearVelocity.y < 0)) {
                    if (enemyDead == false) {
                        this.gameMgr.enemyHurt(); // Player hurt the enemy
                        other.getComponent("goomba").isDead = true; // Mark enemy as dead
                        this.isJumping = true;
                        this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpSpeed); // Apply jump speed
                    }
                }
                else if (this.invisible == false) {
                    this.gameMgr.PlayerHurt(); // Player hurt by enemy
                    if (this.gameMgr.getPlayerHealth() <= 0) {
                        this.isDead = true; // Player is dead
                        this.deadMovingAnim();
                        this.tempInvisible(3, false);
                        return; // Player is dead, no further actions
                    }
                    this.tempInvisible(2, true);
                    this.changeSmall();
                }
                else if (this.invisible) {
                    contact.disabled = true;
                }
            }
            else if (other.node.name == "koppa") {
                let isShell = other.getComponent("koppa").isShell;
                let kickable = other.getComponent("koppa").kickable;
                if (normalY < -0.6 || (normalY < -0.3 && this.rb.linearVelocity.y < 0)) {
                    this.isJumping = true;
                    this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, this.jumpSpeed); // Apply jump speed
                    if (!isShell || (isShell && !kickable)) {
                        this.gameMgr.enemyHurt(); // Player hurt the enemy
                    }
                    else {
                        this.gameMgr.shellKick(); // Player kicked the shell
                    }
                    this.tempInvisible(0.2, false);
                }
                else if (Math.abs(normalX) > 0.71 && isShell && kickable) {
                    this.audioMgr.playShellKick();
                    this.tempInvisible(0.2, false);
                }
                else if (this.invisible == false) {
                    contact.disabled = true; // Disable contact to prevent further collisions
                    this.gameMgr.PlayerHurt(); // Player hurt by enemy
                    if (this.gameMgr.getPlayerHealth() <= 0) {
                        this.isDead = true; // Player is dead
                        this.deadMovingAnim();
                        this.tempInvisible(3, false);
                        return; // Player is dead, no further actions
                    }
                    this.tempInvisible(2, true);
                    this.changeSmall();
                }
                else if (this.invisible) {
                    contact.disabled = true;
                }
            }
        }
        else if (other.node.group == "Item") {
            if (other.node.name == "coin") {
                this.gameMgr.collectCoin();
                other.getComponent("coin").createCollectEffect();
            }
            else if (other.node.name == "mushroom") {
                if (this.gameMgr.getPlayerHealth() == 1) {
                    this.changeBig(); // Change player size to big
                }
                this.gameMgr.collectMushroom();
            }
            else if (other.node.name == "mushroom1Up") {
                this.gameMgr.collectMushroom1Up();
                cc.log(cc.director.getTotalTime());
            }
            else if (other.node.name == "starCoin") {
                this.gameMgr.addScore(4000);
                this.audioMgr.playStarCoin();
                other.node.destroy();
            }
        }
        else if (other.node.group == "Block") { // Player is standing on a block
            if (normalY == -1) {
                this.resetJump();
            }
            else if (normalY == 1) { // Player hit head
                this.isHoldingJump = false; // Reset jump hold when hitting the block from above
                this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, 0); // Reset vertical velocity
            }
        }
        else if (other.node.group == "Pole") {
            if (other.tag == "0") {
                if (normalY == -1) {
                    this.resetJump();
                }
            }
            else if (other.tag == "1") {
                this.rb.gravityScale = 0; 
                this.rb.linearVelocity = cc.v2(0, -200);
                this.gameMgr.playerWon();
            }
        }
        else if (other.node.group == "VoidPlayer") {
            this.gameMgr.playerDied();
            this.isDead = true; // Player is dead
            this.deadMovingAnim();
            this.tempInvisible(3, false);
        }
    }

    onPreSolve(contact, self, other) {
        let normalY = contact.getWorldManifold().normal.y;
        if (other.node.group == "Ground" || other.node.group == "Block") {
            if (normalY < -0.6) {
                this.onGround = true;
            }
        }
    }

    onEndContact(contact, self, other) {
        let normalY = contact.getWorldManifold().normal.y;
        if (other.node.group == "Ground" || other.node.group == "Block") {
            if (normalY < -0.6) {
                this.onGround = false;
            }
        }
    }

    updateMovement(dt) {
        // Direction handling
        if (this.direction == 1) {
            this.node.scaleX = Math.abs(this.node.scaleX);
        }
        else if (this.direction == -1) {
            this.node.scaleX = -Math.abs(this.node.scaleX);
        }

        
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
    }

    resetJump() {
        this.onGround = true;
        this.isJumping = false;
        this.isHoldingJump = false;
        this.jumpTime = 0; // Reset jump time
        this.rb.linearVelocity = cc.v2(this.rb.linearVelocity.x, 0); // Reset vertical velocity
    }

    playAnimation(playOnce: boolean) {
        if (playOnce) {
            return;
        }

        let animName = null;
        if (this.gameMgr.startPlayerWinAnim) {
            animName = "win_";
            this.playOnce = true; // Prevent further animations after winning
        }
        else if (this.isDead) {
            animName = "die_";
        }
        else {
            let isMoving = this.isLeftDown || this.isRightDown
            if (this.isJumping) {
                if (this.run) {
                    animName = "jumpRun_";
                }
                else {
                    if (this.jumpID > 0) {
                        animName = "jump1_";
                    }
                    else {
                        animName = "jump2_";
                    }
                }
            }
            else if (isMoving) {
                if (this.run) {
                    if (this.rb.linearVelocity.x * this.direction < 0) {
                        animName = "changeDir_";
                    }
                    else {
                        animName = "run_";
                    }
                }
                else {
                    animName = "walk_";
                }
            }
            else {
                animName = "idle_";
            }
        }
        let size = this.gameMgr.getPlayerHealth();
        if (size <= 1) {
            animName += "s";
        }
        else if (size == 2) {
            animName += "b";
        }

        if (!this.anim.getAnimationState(animName).isPlaying) {
            this.anim.play(animName);
        }
    }

    private tempInvisible(t: number, blink: boolean) {
        this.invisible = true; // Make player invisible
        this.scheduleOnce(() => {
            this.invisible = false; // Reset invisibility after t seconds
        }, t);
        if (blink) {
            cc.tween(this.node)
                .blink(t, t * 5) // Blink effect to indicate player hurt
                .start();
        }
    }

    changeSmall() {
        this.node.anchorY = 0.5;
        this.getComponent(cc.PhysicsBoxCollider).size = cc.size(12, 14);
        this.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(0, -1);
    }

    changeBig() {
        this.node.anchorY = 0.25;
        this.getComponent(cc.PhysicsBoxCollider).size = cc.size(12, 24);
        this.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(0, 4);
        this.tempInvisible(1, true);
    }

    deadMovingAnim() {
        this.rb.linearVelocity = cc.v2(0, 0); // Stop player movement
        this.rb.gravityScale = 0; // Disable gravity
        this.scheduleOnce(() => {
            this.getComponent(cc.PhysicsBoxCollider).enabled = false; 
            this.rb.gravityScale = 3;
            this.rb.linearVelocity = cc.v2(0, this.jumpSpeed);
        }, 0.5);
    }
}
