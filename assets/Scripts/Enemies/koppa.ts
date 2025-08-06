import enemy from "./enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class koppa extends enemy {

    private polygonCollider: cc.PhysicsPolygonCollider = null;
    private polyPoints: cc.Vec2[] = []; // Store polygon points for koppa
    private pendingPoly: 'disablePoly' | 'enablePoly' | '' = ''; 

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
        if (this.polygonCollider) {
            this.polyPoints = this.polygonCollider.points.map(p => cc.v2(p));
        }
        this.isShell = false;
        this.kickable = false;
    }

    update (dt) {
        super.update(dt);
        if (this.pendingPoly === 'disablePoly') {
            if (this.polygonCollider && this.polygonCollider.isValid) {
                this.polygonCollider.destroy(); // Ensure fixture is removed from the world
                this.polygonCollider = null;
            }
            this.pendingPoly = '';
        } else if (this.pendingPoly === 'enablePoly') {
            if (!this.polygonCollider || !this.polygonCollider.isValid) {
                const poly = this.node.addComponent(cc.PhysicsPolygonCollider);
                poly.points = this.polyPoints.map(p => cc.v2(p));
                poly.apply();
                this.polygonCollider = poly;
            }
            this.pendingPoly = '';
        }
        if (this.isShell) {
            if (this.kickable) {
                this.shellTimer += dt;
                if (this.shellTimer >= this.shellTime) {
                    this.exitShell(); // Convert back to koppa
                }
            }
        }
    }

    onBeginContact(contact: any, self: any, other: any): void {
        super.onBeginContact(contact, self, other);

        if (other.node.group == "Player") {
            const n = contact.getWorldManifold().normal;
            if (n.y > 0.6) {
                if (!this.isShell) {
                    this.enterShell(); // Convert to shell
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
                    contact.disabled = true; // Disable contact to prevent further interactions
                }
            }
            else if (Math.abs(n.x) > 0.71) {
                if (this.isShell && this.kickable) {
                    const playerWorldPos = other.node.parent.convertToWorldSpaceAR(other.node.position);
                    const selfWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
                    this.direction = playerWorldPos.x < selfWorldPos.x ? 1 : -1;
                    this.kickable = false; // Reset kickable state
                    this.dangerous = true; // Set dangerous state
                    contact.disabled = true; // Disable contact to prevent further interactions
                }
            }
        }
    }

    onPreSolve(contact: any, self: any, other: any): void {
        super.onPreSolve(contact, self, other);

        if (other.node.group == "Ground" || other.node.group == "Wall") {
            let normalX = contact.getWorldManifold().normal.x;
            if (Math.abs(normalX) > 0.71 && this.isShell) {
                this.audioMgr.playHardBrick();
            }
        }
    }

    private enterShell() {
        this.isShell = true; // Convert to shell
        this.kickable = true; // Set kickable state
        this.shellTimer = 0; // Reset shell timer
        this.pendingPoly = 'disablePoly'; // 延後處理
    }

    private exitShell() {
        this.isShell = false; // Convert back to koppa
        this.kickable = false; // Reset kickable state
        this.shellTimer = 0; // Reset shell timer
        this.pendingPoly = 'enablePoly'; // 延後處理
    }

    protected move(inRange: boolean): void {
        if (inRange) {
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
        else {
            this.rb.linearVelocity = cc.v2(0, this.rb.linearVelocity.y);
        }
    }

    protected playAnim(): void {
        super.playAnim();

        if (this.isShell) {
            const st = this.anim.getAnimationState("KoppaShell");
            if (!st.isPlaying) {
                this.anim.play("KoppaShell");
            }
            else if (this.kickable && !st.isPaused) {
                st.pause();
            }
            else if (!this.kickable && st.isPaused) {
                st.resume();
            }
        }
        else {
            if (!this.anim.getAnimationState("KoppaWalk").isPlaying) {
                this.anim.play("KoppaWalk");
            }
        }
    }
}
