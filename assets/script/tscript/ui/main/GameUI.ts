import BaseUI from "../base/BaseUI";
import GameScene from "../../gamescene/GameScene";
import GameManager, { GameMode } from "../../core/GameManager";
import UIManager, { ViewName } from "../UIManager";
import DataManager from "../../core/DataManager";
import LevelConfigData from "../../configdata/LevelConfigData";
import PlayerData from "../../data/PlayerData";
import Loading from "../../Loading";


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

@ccclass
export default class GameUI extends BaseUI {

    @property(cc.Button)
    homeBtn: cc.Button = null;

    @property(cc.Button)
    replayBtn: cc.Button = null;

    @property(cc.Button)
    passBtn: cc.Button = null;

    @property(cc.Node)
    weapons: cc.Node = null;

    @property(cc.Node)
    topBar: cc.Node = null;



    public totalWeaponCount:number = 5;

    private _weaponCount: number = 0;
    public get weaponCount(): number {
        return this._weaponCount;
    }
    public set weaponCount(value: number) {

        this._weaponCount = value;

        var len:number = this.weapons.childrenCount;

        for(var i = 0 ; i < len; i++)
        {
            if(i < this.totalWeaponCount)
            {
                if(i < value)
                {
                    this.weapons.getChildByName("Weapon" + (i + 1)).active = true;

                    if(this.levelConfigData)
                    {
                        this.levelConfigData.tripleStar;

                        if(i < this.totalWeaponCount - this.levelConfigData.tripleStar)
                        {
                            this.weapons.getChildByName("Weapon" + (i + 1)).getChildByName("Weapon").active = false;
                        }else
                        {
                            this.weapons.getChildByName("Weapon" + (i + 1)).getChildByName("Weapon").active = true;
                        }
                    }
                }else
                {
                    this.weapons.getChildByName("Weapon" + (i + 1)).active = false;
                }

            }else
            {
                this.weapons.getChildByName("Weapon" + (i + 1)).active = false;
            }
        }

    }
    
    private levelConfigData:LevelConfigData = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {


        var gameScene:GameScene = GameManager.instance.gameScene;

        this.homeBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            Loading.loadScene("main");
        }, this);

        this.replayBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            gameScene.loadLevel(this.levelConfigData.level_max,this.levelConfigData.level_min);
        }, this);

        this.passBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            UIManager.instance.OpenView(ViewName.PassView);
        }, this);
    }

    public init(levelcnfData:LevelConfigData)
    {

        var gameScene:GameScene = GameManager.instance.gameScene;
        var playerData:PlayerData = DataManager.instance.getPlayerData();

        this.levelConfigData = levelcnfData;

        this.totalWeaponCount = this.levelConfigData.ammoCount;
        this.weaponCount = this.totalWeaponCount;
        this.weapons.x = -((this.totalWeaponCount - 1) * 25);


        var mode1_levelId:number = playerData.getLevelConfigData(GameMode.mode1).id;

        if(mode1_levelId == gameScene.levelConfigData.id && mode1_levelId % 10 == 0)
        {
            if(mode1_levelId <= 60)
            {
                var prompt:cc.Node = this.homeBtn.node.getChildByName("Prompt");
            
                if(mode1_levelId == 60)
                {
                    prompt.getChildByName("MsgTxt").getComponent(cc.Label).string = "人质模式解锁";
                }else
                {
                    prompt.getChildByName("MsgTxt").getComponent(cc.Label).string = `还剩${60 - playerData.getLevelConfigData(GameMode.mode1).id}关解锁人质模式`;
                }

                prompt.active = true;
                prompt.stopAllActions();
                prompt.getComponent(cc.Sprite).unscheduleAllCallbacks();
                prompt.scale = 0;
                prompt.runAction(cc.sequence(cc.scaleTo(0.15,1),cc.callFunc(()=>{

                    prompt.getComponent(cc.Sprite).scheduleOnce(()=>{
                        prompt.active = false;
                    },2);
                })));
            }else if(mode1_levelId <= 120)
            {
                var prompt:cc.Node = this.homeBtn.node.getChildByName("Prompt");
            
                if(mode1_levelId == 120)
                {
                    prompt.getChildByName("MsgTxt").getComponent(cc.Label).string = "投石器模式解锁";
                }else
                {
                    prompt.getChildByName("MsgTxt").getComponent(cc.Label).string = `还剩${60 - playerData.getLevelConfigData(GameMode.mode1).id}关解锁投石器模式`;
                }

                prompt.active = true;
                prompt.stopAllActions();
                prompt.getComponent(cc.Sprite).unscheduleAllCallbacks();
                prompt.scale = 0;
                prompt.runAction(cc.sequence(cc.scaleTo(0.15,1),cc.callFunc(()=>{

                    prompt.getComponent(cc.Sprite).scheduleOnce(()=>{
                        prompt.active = false;
                    },2);
                })));
            }
        }else
        {
            this.homeBtn.node.getChildByName("Prompt").active = false;
        }

        


    }

    update(dt)
    {
       
    }


    public onGameOver(callback:Function)
    {
          
    }


}
