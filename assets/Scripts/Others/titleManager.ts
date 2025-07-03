const {ccclass, property} = cc._decorator;

@ccclass
export default class titleManager extends cc.Component {

    @property(cc.AudioClip)
    BGM: cc.AudioClip = null;

    @property(cc.AudioClip)
    SE: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // Register key down event listener
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start () {
        this.playBGM();
    }

    // update (dt) {}

    playBGM() {
        cc.audioEngine.playMusic(this.BGM, true);
    }

    playSE(): number {
        return cc.audioEngine.playEffect(this.SE, false);
    }

    onKeyDown(event) {
        // Wait for Enter key to be pressed
        if (event.keyCode == cc.macro.KEY.enter) {
            let id = this.playSE();
            cc.audioEngine.setFinishCallback(id, () => {
                // After the sound effect finishes, load the stage select scene
                cc.log("Loading stage select scene");
                cc.director.loadScene("StageSelect");
            });
        }
    }
}
