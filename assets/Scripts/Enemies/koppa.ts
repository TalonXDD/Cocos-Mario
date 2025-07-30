import enemy from "./enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class koppa extends enemy {

    private polygonCollider: cc.PhysicsPolygonCollider = null;

    @property()
    protected shellSpeed: number = 120; // Speed of the shell movement

    public isShell: boolean = false; // Flag to check if the enemy is a shell
    public kickable: boolean = false; // Flag to check if the shell can be kicked

    @property()
    protected shellTime: number = 15;
    private shellTimer: number = 0; // Timer for shell state

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        super.start();
        this.polygonCollider = this.getComponent(cc.PhysicsPolygonCollider);
    }

    update (dt) {
        super.update(dt);
        if (this.isShell) {
            this.polygonCollider.enabled = false; // Disable collider while in shell state
        }
        if (this.isShell && this.kickable) {
            this.shellTimer += dt;
            if (this.shellTimer >= this.shellTime) {
                this.isShell = false; // Convert back to koppa
                this.kickable = false; // Reset kickable state
                this.shellTimer = 0; // Reset shell timer
                this.polygonCollider.enabled = true; // Enable collider
            }
        }
    }

    onBeginContact(contact: any, self: any, other: any): void {
        super.onBeginContact(contact, self, other);

        if (other.node.group == "Player") {
            let normalX = contact.getWorldManifold().normal.x;
            let normalY = contact.getWorldManifold().normal.y;
            if (normalY > 0.71) {
                if (!this.isShell) {
                    this.isShell = true; // Convert to shell
                    this.kickable = true; // Set kickable state
                    this.shellTimer = 0; // Reset shell timer
                    this.polygonCollider.enabled = false; // Disable collider
                }
                else {
                    if (this.kickable) {
                        const playerWorldPos = other.node.parent.convertToWorldSpaceAR(other.node.position);
                        const selfWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
                        this.direction = playerWorldPos.x < selfWorldPos.x ? 1 : -1;
                        this.kickable = false; // Reset kickable state
                        this.dangerous = true; // Set dangerous state
                    }
                    else {
                        this.kickable = true; // Set kickable state
                        this.shellTimer = 0; // Reset shell timer
                        this.dangerous = false; // Reset dangerous state
                    }
                }
            }
            else if (Math.abs(normalX) > 0.71) {
                if (this.isShell && this.kickable) {
                    const playerWorldPos = other.node.parent.convertToWorldSpaceAR(other.node.position);
                    const selfWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
                    this.direction = playerWorldPos.x < selfWorldPos.x ? 1 : -1;
                    this.kickable = false; // Reset kickable state
                    this.dangerous = true; // Set dangerous state
                }
            }
        }
    }

    onPreSolve(contact: any, self: any, other: any): void {
        super.onPreSolve(contact, self, other);

        if (other.node.group == "Ground" || other.node.group == "Wall") {
            let normalX = contact.getWorldManifold().normal.x;
            if (Math.abs(normalX) > 0.71) {
                this.audioMgr.playHardBrick();
            }
        }
    }

    protected move(dt: any): void {
        if (this.isShell && this.kickable) {
            this.rb.linearVelocity = cc.v2(0, this.rb.linearVelocity.y);
        }
        else if (this.isShell && !this.kickable) {
            this.rb.linearVelocity = cc.v2(this.shellSpeed * this.direction, this.rb.linearVelocity.y);
        }
        else {
            this.rb.linearVelocity = cc.v2(this.speed * this.direction, this.rb.linearVelocity.y);
        }
    }

    protected playAnim(): void {
        super.playAnim();

        if (this.isShell && this.kickable) {
            if (!this.anim.getAnimationState("KoppaShell").isPlaying) {
                this.anim.play("KoppaShell");
            }
            else {
                this.anim.pause("KoppaShell");
            }
        }
        else if (this.isShell && !this.kickable) {
            if (!this.anim.getAnimationState("KoppaShell").isPlaying) {
                this.anim.play("KoppaShell");
            }
            else if (this.anim.getAnimationState("KoppaShell").isPaused) {
                this.anim.resume("KoppaShell");
            }
        }
        else {
            if (!this.anim.getAnimationState("KoppaWalk").isPlaying) {
                this.anim.play("KoppaWalk");
            }
        }
    }
}
