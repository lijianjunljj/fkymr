import View from "../base/View";
import DataManager from "../../core/DataManager";
import GameScene from "../../gamescene/GameScene";
import GameManager from "../../core/GameManager";
import Loading from "../../Loading";
import UIManager, { ViewName } from "../UIManager";
import EconomicManager from "../../core/EconomicManager";
import CommonUils from "../../util/CommonUils";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class AccountView extends View {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    content2: cc.Node = null;

    @property(cc.Node)
    bgMask: cc.Node = null;

    @property(cc.Node)
    Stars: cc.Node = null;

    @property(dragonBones.ArmatureDisplay)
    star_ani: dragonBones.ArmatureDisplay = null;
    
    @property(cc.Button)
    turnbackBtn: cc.Button = null;

    @property(cc.Button)
    shareVideoBtn: cc.Button = null;

    @property(cc.Button)
    replayBtn: cc.Button = null;

    @property(cc.Button)
    replayBtn2: cc.Button = null;

    @property(cc.Button)
    passBtn: cc.Button = null;

    @property(cc.Button)
    guideBtn: cc.Button = null;

    @property(cc.Button)
    nextBtn: cc.Button = null;

    @property(cc.Button)
    JsBtn: cc.Button = null;

    private isAniPlay: boolean = false;
   
    private curCoinAward:number = 0

    private isclickcoin:boolean = true

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

        var gameScene: GameScene = GameManager.instance.gameScene;


        this.turnbackBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            if (this.isAniPlay) {
                return;
            }

            this.closeSelf();
            Loading.loadScene("main");

        }, this);

        this.replayBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            if (this.isAniPlay) {
                return;
            }

            this.closeSelf();
            GameManager.instance.gameScene.loadLevel(gameScene.levelConfigData.level_max, gameScene.levelConfigData.level_min);

        }, this);

        this.replayBtn2.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            if (this.isAniPlay) {
                return;
            }

            this.closeSelf();
            GameManager.instance.gameScene.loadLevel(gameScene.levelConfigData.level_max, gameScene.levelConfigData.level_min);

        }, this);

        this.nextBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            if (this.isAniPlay) {
                return;
            }

            this.closeSelf();
            gameScene.gotoNextLevel();

        }, this);

        this.shareVideoBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            DataManager.instance.getPlayerData().addEnergy(3);
            DataManager.instance.savePlayerData();
        }, this);

        this.JsBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
 
            if(this.isclickcoin){
                this.isclickcoin = false
                this.JsBtn.interactable = false
                UIManager.instance.economicBar.playCoinAni(this.curCoinAward,CommonUils.getNodeWorldPos(this.JsBtn.node));
            }
            
        });

        this.passBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            if (this.isAniPlay) {
                return;
            }

            this.closeSelf();
            GameManager.instance.gameScene.gotoNextLevel();
        });

        this.guideBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

           
        }, this);

    }

    public closeSelf() {
        super.closeSelf(!this.persistent);
    }

    // update (dt) {}

    public init(isPass: boolean) {

        var gameScene: GameScene = GameManager.instance.gameScene;

        if(isPass)
        {
            var starNum:number = 1;

            //花费的武器数
            var costWeaponCount:number = UIManager.instance.gameUI.totalWeaponCount - UIManager.instance.gameUI.weaponCount;

            if(costWeaponCount <= gameScene.levelConfigData.tripleStar)
            {
                starNum = 3;
                // this.JsBtn.node.active = false;
            }else if(costWeaponCount <= gameScene.levelConfigData.doubleStar)
            {
                starNum = 2;
                this.JsBtn.node.active = true;
            }else
            {
                starNum = 1;
                this.JsBtn.node.active = true;
            }

            this.star_ani.armatureName = "xinxin" + starNum;
            this.star_ani.playAnimation("newAnimation", 1);

            this.setStar(starNum);
    
            DataManager.instance.getPlayerData().setLevelState(gameScene.mode,gameScene.levelConfigData.id,starNum);
    
            DataManager.instance.getPlayerData().addEnergy(-1);
    
            DataManager.instance.savePlayerData();

            this.content.active = true;
            this.content2.active = false;
            //this.bgMask.active = true;

            var coinNum:number = 5;

            this.content.getChildByName("Detail").getChildByName("CoinTxt").getComponent(cc.Label).string = "" + coinNum;
            this.curCoinAward = coinNum * 10
            EconomicManager.instance.coin += coinNum;

            this.isAniPlay = true;

            this.scheduleOnce(() => {
                this.isAniPlay = false;
            }, starNum * 0.4);

        }else
        {
            this.content.active = false;
            this.content2.active = true;
            //this.bgMask.active = false;
        
        }

    }


    private setStar(value:number)
    {
        for(var i = 0 ; i < 3 ; i++)
        {
            if(i < value)
            {
                this.Stars.getChildByName("Star" + (i + 1)).getChildByName("Star").active = true;
            }else
            {
                this.Stars.getChildByName("Star" + (i + 1)).getChildByName("Star").active = false;
            }
        }
    }


    /**
     * UI苏醒
     */
    public awake() {
    
        // GamePlatform.sdk.recordVideo(2);
        UIManager.instance.economicBar.open();
    }

    public sleep() {
        UIManager.instance.economicBar.close();
    }
}
