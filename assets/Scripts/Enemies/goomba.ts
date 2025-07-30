import enemy from "./enemy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class goomba extends enemy {

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        super.start();
        
    }

    update (dt) {
        super.update(dt);
    }

    onBeginContact(contact, self, other) {
        super.onBeginContact(contact, self, other);

        if (other.node.group == "Player") {
            let normalY = contact.getWorldManifold().normal.y;
            if (normalY > 0.71) {
                this.anim.play("goombaDead");
                this.direction = 0; // Stop moving
                this.scheduleOnce(() => {
                    this.node.destroy();
                }, 0.3);
            }
        }
    }

    onPreSolve(contact: any, self: any, other: any): void {
        super.onPreSolve(contact, self, other);
    }
}
