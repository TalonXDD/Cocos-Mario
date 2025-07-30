# Cocos Creator Mario Assignment

### Scoring

|**Basic Component**|**Score**|**Check**|
|:-:|:-:|:-:|
|Complete Game Process|5%|N|
|Basic Rules|45%|N|
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
1. World map : [xxxx]
2. Player : 
    * Control
        * W / Space / ↑ : Jump (Height depends on the length player holds the key)
        * A / ← : Left
        * D / → : Right
        * Shift (Hold) : Run
    * If player touched the enemies, it will get hurt or die if it is in small size.
    * If player fell into the void or ran out of time, it will be instant killed.
    * Find the way to the goal!
3. Enemies : 
    * Goomba (栗寶寶)
        * Slow, easy to kill.
    * Koppa (慢慢龜)
        * Slow as Goomba if it doesn't hide into the shell.
        * Shell is very fast and dangerous if kicked. Need to be careful.
4. Question Blocks : I have 2 kinds of block. Player can hit the blocks or stand on them.
    * Brick
        * Empty (Breakable)
        * Coin
        * Item, e.g. 1up mushroom (pretty rare)
    * "?" Block
        * Coin
        * Item, e.g. red mushroom
5. Animations : 
    * Player: 
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
        * Player dead (我認為用成BGM比較合理)
        * Win
        * Gameover
    * SE: 
        * Title scene start
        * Stage select buttons
        * Player jump
        * Block & item interactions
        * Enemy interactions
7. UI : 
    * Lives
    * Coins
    * Timer
    * Also have the loading screen

## Advanced Component Description : 

Describe your advanced function and how to use it.