import Player, { PlayerStatus, PlayerControlType } from "./Player";
import Random from "../util/Random";
import GameManager, { GameStatus } from "../core/GameManager";
import Vector2 from "../util/Vector2";
import Mathf from "../util/Mathf";
import DataManager from "../core/DataManager";
import GameScene from "../gamescene/GameScene";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

export enum PlayerAILevel
{
    none = 0,
    level1 = 1,
    level2 = 2,
    level3 = 3,
    level4 = 4,
}

@ccclass
export default class PlayerAI extends cc.Component {


    public aiLevel:PlayerAILevel = PlayerAILevel.level1;


    public player:Player = null;
    

    /**
     * 警戒范围
     */
    public alertRange:number = 1250;

    public gameScene:GameScene = null;

    onLoad () {
        
    }

    start () {

        this.gameScene = GameManager.instance.gameScene;

        this.player = this.getComponent(Player);

        if(this.player.controlType != PlayerControlType.ai)
        {
            return;
        }

    }

    public onGameStart()
    {

    }

    update(dt):void
    {

        
    }
    
   
}


