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
        if (this.BGM) {
            cc.audioEngine.playMusic(this.BGM, true);
        } else {
            cc.error("Title BGM audio source is not set.");
        }
    }

    playSE() {
        if (this.SE) {
            cc.audioEngine.playEffect(this.SE, false);
        } else {
            cc.error("Title SE audio source is not set.");
        }
    }

    onKeyDown(event) {
        // Wait for Enter key to be pressed
        if (event.keyCode == cc.macro.KEY.enter) {
            this.playSE();
            this.scheduleOnce(() => {
                cc.log("Loading stage select scene")
                cc.director.loadScene("StageSelect");
            }, 1.5);
        }
    }
}
