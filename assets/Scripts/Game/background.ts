const {ccclass, property} = cc._decorator;

@ccclass
export default class background extends cc.Component {

    @property(cc.Node)
    protected cameraNode: cc.Node = null; // Reference to the camera node

    private background1: cc.Node = null; // Background layer 1
    private background2: cc.Node = null; // Background layer 2
    private background3: cc.Node = null; // Background layer 3
    private background4: cc.Node = null; // Background layer 4
    private background5: cc.Node = null; // Background layer 5
    private background6: cc.Node = null; // Background layer 6
    private sky: cc.Node = null; // Sky layer

    private camPosBase: cc.Vec2 = cc.Vec2.ZERO; // Base position of the camera in world space

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.background1 = cc.find("background1", this.node);
        this.background2 = cc.find("background2", this.node);
        this.background3 = cc.find("background3", this.node);
        this.background4 = cc.find("background4", this.node);
        this.background5 = cc.find("background5", this.node);
        this.background6 = cc.find("background6", this.node);
        this.sky = cc.find("sky", this.node);

        if (!this.cameraNode) cc.log("Camera node is not set!");
        if (!this.background1) cc.log("Background layer 1 is not set!");
        if (!this.background2) cc.log("Background layer 2 is not set!");
        if (!this.background3) cc.log("Background layer 3 is not set!");
        if (!this.background4) cc.log("Background layer 4 is not set!");
        if (!this.background5) cc.log("Background layer 5 is not set!");
        if (!this.background6) cc.log("Background layer 6 is not set!");
        if (!this.sky) cc.log("Sky layer is not set!");

        this.camPosBase = this.node.convertToNodeSpaceAR(this.cameraNode.convertToWorldSpaceAR(cc.Vec2.ZERO));
    }

    update (dt) {
        const camPosLocal = this.node.convertToNodeSpaceAR(this.cameraNode.convertToWorldSpaceAR(cc.Vec2.ZERO));
        const camPosDiff = camPosLocal.sub(this.camPosBase);
        const parallaxFactor = 0.5; // Adjust the parallax effect strength

        this.background1.setPosition(this.camPosBase.x + camPosDiff.x * 0.05, this.background1.y);
        this.background2.setPosition(this.camPosBase.x + camPosDiff.x * 0.2, this.background2.y);
        this.background3.setPosition(this.camPosBase.x + camPosDiff.x * 0.4, this.background3.y);
        this.background4.setPosition(this.camPosBase.x + camPosDiff.x * 0.6, this.background4.y);
        this.background5.setPosition(this.camPosBase.x + camPosDiff.x * 0.75, this.background5.y);
        this.background6.setPosition(this.camPosBase.x + camPosDiff.x * 0.9, this.background6.y);
        this.sky.setPosition(this.camPosBase.x + camPosDiff.x, this.sky.y);
    }
}
