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

    @property(cc.AudioClip)
    goalFlag: cc.AudioClip = null;

    @property(cc.AudioClip)
    time2Score: cc.AudioClip = null; 

    @property(cc.AudioClip)
    time2ScoreDone: cc.AudioClip = null;

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

    @property(cc.AudioClip)
    livesLoss: cc.AudioClip = null;

    /**
     * Enemy audios
     */
    @property(cc.AudioClip)
    enemyHurt: cc.AudioClip = null;

    @property(cc.AudioClip)
    shellKick: cc.AudioClip = null;

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
    itemAppear: cc.AudioClip = null;

    @property(cc.AudioClip)
    starCoin: cc.AudioClip = null;

    @property(cc.AudioClip)
    oneUp: cc.AudioClip = null;

    @property(cc.AudioClip)
    oneUp100: cc.AudioClip = null;

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

    stopEffect() {
        cc.audioEngine.stopAllEffects();
    }

    playHurryUp()   {
        const id = cc.audioEngine.playMusic(this.hurryUp, false);
        cc.audioEngine.setFinishCallback(id, () => {
            this.scheduleOnce(() => {
                cc.audioEngine.playMusic(this.BGMfast, true);
            }, 0.5);
        });
    }

    playGoalFlag(): number {
        return cc.audioEngine.playEffect(this.goalFlag, false);
    }

    playWin() {
        cc.audioEngine.playMusic(this.win, false);
    }

    playTime2Score() {
        cc.audioEngine.playEffect(this.time2Score, true);
    }

    playTime2ScoreDone() {
        cc.audioEngine.playEffect(this.time2ScoreDone, false);
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
        cc.audioEngine.playEffect(this.livesLoss, false); 
    }

    /**
     * Enemy audios
     */
    playEnemyHurt() {
        cc.audioEngine.playEffect(this.enemyHurt, false);
    }

    playShellKick() {
        cc.audioEngine.playEffect(this.shellKick, false);
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

    playItemAppear() {
        cc.audioEngine.playEffect(this.itemAppear, false);
    }

    playStarCoin() {
        cc.audioEngine.playEffect(this.starCoin, false);
    }

    playOneUp() {
        cc.audioEngine.playEffect(this.oneUp, false);
    }

    playOneUp100() {
        cc.audioEngine.playEffect(this.oneUp100, false);
    }

    playGetItemAgain() {
        cc.audioEngine.playEffect(this.getItemAgain, false);
    }

}
