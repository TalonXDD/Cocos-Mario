const {ccclass, property} = cc._decorator;

@ccclass
export default class background extends cc.Component {

    @property(cc.Node)
    protected cameraNode: cc.Node = null; // Reference to the camera node

    private bg1: cc.Node = null; // Background layer 1
    private bg2: cc.Node = null; // Background layer 2
    private bg3: cc.Node = null; // Background layer 3
    private bg4: cc.Node = null; // Background layer 4
    private bg5: cc.Node = null; // Background layer 5
    private bg6: cc.Node = null; // Background layer 6
    private sky: cc.Node = null; // Sky layer

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if (!this.cameraNode) {
            cc.error("Camera node is not assigned in the background script.");
            return;
        }
        this.bg1 = cc.find("bg1", this.node);
        this.bg2 = cc.find("bg2", this.node);
        this.bg3 = cc.find("bg3", this.node);
        this.bg4 = cc.find("bg4", this.node);
        this.bg5 = cc.find("bg5", this.node);
        this.bg6 = cc.find("bg6", this.node);
        this.sky = cc.find("sky", this.node);
    }

    update (dt) {
        const camPosWorld = this.cameraNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        const camPosLocal = this.node.convertToNodeSpaceAR(camPosWorld);
        

        this.sky.setPosition(camPosLocal.x, this.sky.y);
    }
}
