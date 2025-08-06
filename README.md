# Cocos Creator Mario Assignment

### Scoring

|**Basic Component**|**Score**|**Check**|
|:-:|:-:|:-:|
|Complete Game Process|5%|Y|
|Basic Rules|45%|Y|
|Animations|10%|Y|
|Sound Effects|10%|Y|
|UI|10%|Y|
|Appearence|5%|Y|

|**Advanced Component**|**Score**|**Check**|
|:-:|:-:|:-:|
|Leaderboard|5%|N|
|Offline multi-player game|5%|N|
|Online multi-player game|15%|N|
|Others [name of functions]|1-15%|N|

---

## Basic Components Description : 
1. World map : 
    * Stage 1
    * Stage 2

2. Player : 
    * Control
        * W / Space / ↑ : Jump (Height depends on the length player holds the key)
        * A / ← : Left
        * D / → : Right
        * Shift (Hold) : Run
    * If the player touches an enemy, they will get hurt or die if they are in small size.
    * If the player falls into the void or runs out of time, they will be instantly killed.
    * If the player runs out of lives, it's GAME OVER!!!
    * Find your way to the goal!
3. Enemies : 
    * Goomba (栗寶寶)
        * Slow, easy to kill.
    * Koppa (慢慢龜)
        * As slow as Goomba if it hasn't hidden in its shell.
        * The shell is very fast and dangerous when kicked. Be careful!
4. Question Blocks : There are two kinds of blocks. The player can hit or stand on them.
    * Brick
        * Empty (Breakable)
        * Coin
        * Item, e.g. 1up mushroom (pretty rare)
    * "?" Block
        * Coin
        * Item, e.g. red mushroom
5. Animations : 
    * Player: Both small and big forms have animations.
        * Walk
        * Run
        * Jump
        * Dead
        * Win
        * Change direction
    * Goomba : 
        * Walk
    * Koppa : 
        * Walk
        * Shell spin
6. Sound effects : 
    * BGM: 
        * Title scene
        * Stage select scene
        * Stages
        * Win
        * Gameover
    * SE: 
        * Title scene start
        * Stage select buttons
        * Player jump
        * Player dead
        * Block & item interactions
        * Enemy interactions
        * Time converted to score
7. UI : 
    * Lives
    * Coins
    * Timer
    * Loading screen 
    * Game Over screen

## Advanced Component Description : 
1. Invisible coins. The player needs to touch them once, or they can't be collected.
2. After the player reaches the goal pole, the remaining time will be converted into score.
