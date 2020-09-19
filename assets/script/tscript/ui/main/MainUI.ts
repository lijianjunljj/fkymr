import BaseUI from "../base/BaseUI";
import UIManager, { ViewName, LayerType } from "../UIManager";
import GameManager, { GameMode } from "../../core/GameManager";
import GlobalDataManager from "../../core/GlobalDataManager";
import DataManager from "../../core/DataManager";
import SoundManager from "../../core/SoundManager";
import { BgSoundClipType } from "../../audio/BgSoundClip";
import PlayerData from "../../data/PlayerData";

import LevelView from "../level/LevelView";
import Player, { PlayerControlType } from "../../player/Player";
import Weapon from "../../player/Weapon";
import EconomicManager from "../../core/EconomicManager";

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
export default class MainUI extends BaseUI {

    @property(cc.Node)
    context: cc.Node = null;

    @property(cc.Node)
    PlayerParent: cc.Node = null;

    @property(cc.Button)
    startBtn: cc.Button = null;

    @property(cc.Button)
    startBtn2: cc.Button = null;

    @property(cc.Button)
    startBtn3: cc.Button = null;

    @property(cc.Button)
    rankBtn: cc.Button = null;

    @property(cc.Button)
    mallBtn: cc.Button = null;

    @property(cc.Button)
    energyBtn: cc.Button = null;

    @property(cc.Button)
    signBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    private _player: Player = null;
    public getPlayer(): Player {
        return this._player;
    }

    public setPlayer(roleId: number): void {

        // this.roleId = roleId;

        if (this._player) {
            if (this._player.roleId == roleId) {
                return;
            }

            this._player.destroySelf();
            this._player = null;
        }

        this._player = GameManager.instance.getPlayer(roleId);
        this._player.node.parent = this.PlayerParent;
        this._player.controlType = PlayerControlType.none;
        this._player.node.position = cc.v2(0, 0);
        this._player.node.scale = 2
        this._player.createWeapon();
        this._player.currentWeapon.node.group = "ui";
        this._player.currentWeapon.getComponent(cc.PhysicsCollider).destroy()
        this._player.currentWeapon.getComponent(cc.RigidBody).destroy();
        this._player.currentWeapon.getComponent(Weapon).enabled = false;
        this._player.currentWeapon.getComponent(Weapon).tail.node.active = false;
    }

    onLoad() {

    }

    onUpdateMainSkin() {
        if (GlobalDataManager.instance.myTryOutData) {
            if (GlobalDataManager.instance.myTryOutData.roleId) {
                this.setPlayer(GlobalDataManager.instance.myTryOutData.roleId);
            }
        } else {
            this.setPlayer(DataManager.instance.getPlayerData().roleId);
        }
    }
    start() {

        var playerData: PlayerData = DataManager.instance.getPlayerData();
        //playerData.level_max = 1;
        //playerData.level_min = 10;

        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            
            UIManager.instance.OpenView(ViewName.LevelView, (view: LevelView) => {
                view.init(GameMode.mode1);
            });
        }, this);

        if (playerData.getLevelConfigData(GameMode.mode1).id >= 60) //解救人质解锁
        {
            this.startBtn2.node.getChildByName('mask').active = false
            this.startBtn2.interactable = true;
        }

        this.startBtn2.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            if (playerData.getLevelConfigData(GameMode.mode1).id >= 60) {
                UIManager.instance.OpenView(ViewName.LevelView, (view: LevelView) => {
                    view.init(GameMode.mode2);
                });
            } else {

            }

        }, this);

        if (playerData.getLevelConfigData(GameMode.mode1).id >= 120) //投石机解锁
        {
            this.startBtn3.node.getChildByName('mask').active = false
            this.startBtn3.interactable = true;
        }

        this.startBtn3.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {


            if (playerData.getLevelConfigData(GameMode.mode1).id >= 120) {
                UIManager.instance.OpenView(ViewName.LevelView, (view: LevelView) => {
                    view.init(GameMode.mode3);
                });
            } else {
                //     var prompt:cc.Node = this.startBtn3.node.getChildByName("Prompt");
                //     prompt.active = true;
                //     prompt.stopAllActions();
                //     prompt.getComponent(cc.Sprite).unscheduleAllCallbacks();
                //     prompt.scale = 0;
                //     prompt.runAction(cc.sequence(cc.scaleTo(0.15,1),cc.callFunc(()=>{

                //     prompt.getComponent(cc.Sprite).scheduleOnce(()=>{
                //         prompt.active = false;
                //     },1);
                // })));
            }

        }, this);


        this.rankBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            UIManager.instance.OpenView(ViewName.RankView);
        }, this);

        this.mallBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            UIManager.instance.OpenView(ViewName.MallView);
        }, this);

        this.energyBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            //GamePlatform.sdk.aldSdkSendEvent(`使用游戏主页恢复体力激励`, {});
            UIManager.instance.OpenView(ViewName.InviteView);
        }, this);

        this.signBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            UIManager.instance.OpenView(ViewName.SignInView);
        }, this);

        this.startBtn.node.getChildByName("StarCountTxt").getComponent(cc.Label).string = "" + DataManager.instance.getPlayerData().totalStar;

        SoundManager.instance.PlayBGSound(BgSoundClipType.main);

        GlobalDataManager.instance.myTryOutData = null;
        this.onUpdateMainSkin()

    }

    private onGameLogin() {

    }

    onDestroy() {
        
    }

    public open() {
        super.open();
    }

    public close() {
        super.close();
    }


}


