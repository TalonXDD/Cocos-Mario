import gameManager from "./gameManager ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class audioManager extends cc.Component {

    /**
     * Game audios
     */
    @property(cc.AudioClip) // BGM
    BGM: cc.AudioClip = null;

    @property(cc.AudioClip) // BGM
    BGMfast: cc.AudioClip = null;

    @property(cc.AudioClip) // BGM
    hurryUp: cc.AudioClip = null;

    @property(cc.AudioClip) // BGM
    win: cc.AudioClip = null;

    @property(cc.AudioClip) // BGM
    gameOver: cc.AudioClip = null;

    @property(cc.AudioClip)
    pause: cc.AudioClip = null; 

    @property(cc.AudioClip)
    resume: cc.AudioClip = null;

    /**
     * Player audios
     */
    @property(cc.AudioClip)
    jump: cc.AudioClip = null;

    @property(cc.AudioClip)
    changeBig: cc.AudioClip = null;

    @property(cc.AudioClip)
    changeSmall: cc.AudioClip = null;

    @property(cc.AudioClip) // BGM
    lifeLoss: cc.AudioClip = null;

    /**
     * Enemy audios
     */
    @property(cc.AudioClip)
    enemyHurt: cc.AudioClip = null;

    @property(cc.AudioClip)
    turtleKick: cc.AudioClip = null;

    @property(cc.AudioClip)
    turtleHitWall: cc.AudioClip = null;

    /**
     * Interaction audios
     */
    @property(cc.AudioClip)
    coin: cc.AudioClip = null;

    @property(cc.AudioClip)
    brick: cc.AudioClip = null;

    @property(cc.AudioClip)
    hardBrick: cc.AudioClip = null;

    @property(cc.AudioClip)
    item: cc.AudioClip = null;

    @property(cc.AudioClip)
    starCoin: cc.AudioClip = null;

    @property(cc.AudioClip)
    oneUp: cc.AudioClip = null;

    @property(cc.AudioClip)
    getItemAgain: cc.AudioClip = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    /**
     * Game audios
     */
    playBGM() {
        cc.audioEngine.playMusic(this.BGM, true);
    }

    stopBGM() {
        cc.audioEngine.stopMusic();
    }

    playHurryUp()   {
        const id = cc.audioEngine.playMusic(this.hurryUp, false);
        cc.audioEngine.setFinishCallback(id, () => {
            this.scheduleOnce(() => {
                cc.audioEngine.playMusic(this.BGMfast, true);
            }, 0.5);
        });
    }

    playWin() {
        cc.audioEngine.playMusic(this.win, false);
    }

    playGameOver() {
        cc.audioEngine.playMusic(this.gameOver, false);
    }

    playPause() {
        cc.audioEngine.pauseMusic();
        cc.audioEngine.playEffect(this.pause, false);
    }

    playResume() {
        let id = cc.audioEngine.playEffect(this.resume, false);
        cc.audioEngine.setFinishCallback(id, () => {
            this.scheduleOnce(() => {
                cc.audioEngine.resumeMusic();
            }, 0.5);
        });
    }

    /**
     * Player audios
     */
    playJump() { 
        cc.audioEngine.playEffect(this.jump, false); 
    }

    playChangeBig() { 
        cc.audioEngine.playEffect(this.changeBig, false); 
    }

    playChangeSmall() { 
        cc.audioEngine.playEffect(this.changeSmall, false); 
    }

    playDead() { 
        cc.audioEngine.playMusic(this.lifeLoss, false); 
    }

    /**
     * Enemy audios
     */
    playEnemyHurt() {
        cc.audioEngine.playEffect(this.enemyHurt, false);
    }

    playTurtleKick() {
        cc.audioEngine.playEffect(this.turtleKick, false);
    }

    playTurtleHitWall() {
        cc.audioEngine.playEffect(this.turtleHitWall, false);
    }

    /**
     * Interaction audios
     */
    playCoin() {
        cc.audioEngine.playEffect(this.coin, false);
    }

    playBrick() {
        cc.audioEngine.playEffect(this.brick, false);
    }

    playHardBrick() {
        cc.audioEngine.playEffect(this.hardBrick, false);
    }

    playItem() {
        cc.audioEngine.playEffect(this.item, false);
    }

    playStarCoin() {
        cc.audioEngine.playEffect(this.starCoin, false);
    }

    playOneUp() {
        cc.audioEngine.playEffect(this.oneUp, false);
    }

    playGetItemAgain() {
        cc.audioEngine.playEffect(this.getItemAgain, false);
    }

}
