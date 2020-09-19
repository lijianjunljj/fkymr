
import TabSelectView from "../base/TabSelectView";
import Player, { PlayerControlType } from "../../player/Player";
import GameManager from "../../core/GameManager";
import Weapon from "../../player/Weapon";
import DataManager from "../../core/DataManager";
import EconomicManager from "../../core/EconomicManager";
import MallIcon from "./MallIcon";
import GlobalDataManager, { TryOutData } from "../../core/GlobalDataManager";
import { ItemType } from "../../item/ItemType";
import BackpackManager from "../../core/BackpackManager";
import CommonUils from "../../util/CommonUils";
import UIManager from "../UIManager";

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
export default class MallView extends TabSelectView {

    @property(cc.Node)
    content:cc.Node = null;

    @property(cc.Button)
    tryOutBtn: cc.Button = null;

    @property(cc.Button)
    payBtn: cc.Button = null;

    @property(cc.Button)
    useBtn: cc.Button = null;

    @property(cc.Node)
    usedLabel: cc.Node = null;

    public selectMallIcon:MallIcon = null;

    public roleId:number = 0;

    public weaponId:number = 0;

    private _player: Player = null;
    public getPlayer(): Player 
    {
        return this._player;
    }

    public setPlayer(roleId:number):void
    {

        this.roleId = roleId;

        if(this._player)
        {
            if(this._player.roleId == roleId)
            {
                return;
            }

            this._player.destroySelf();
            this._player = null;
        }

        this._player = GameManager.instance.getPlayer(roleId);
        this._player.node.parent = this.content;
        this._player.controlType = PlayerControlType.none;
        this._player.node.position = cc.v2(0,-310);

        this._player.createWeapon();
        this._player.currentWeapon.node.group = "ui";
        this._player.currentWeapon.getComponent(cc.PhysicsCollider).destroy()
        this._player.currentWeapon.getComponent(cc.RigidBody).destroy();
        this._player.currentWeapon.getComponent(Weapon).enabled = false;
        this._player.currentWeapon.getComponent(Weapon).tail.node.active = false;
    }

    public setWeapon(weaponId:number)
    {
        this.weaponId = weaponId;

        if(this._player)
        {
            this._player.setWeaponSkin(weaponId);
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.setPlayer(DataManager.instance.getPlayerData().roleId);

        super.start();

        this.tryOutBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            if(this.selectMallIcon)
            {
                if(!GlobalDataManager.instance.myTryOutData)
                {
                    GlobalDataManager.instance.myTryOutData = new TryOutData();
                }

                if(this.selectMallIcon.type == ItemType.role)
                {
                    GlobalDataManager.instance.myTryOutData.roleId = this.selectMallIcon.data.itemId;
                }

                if(this.selectMallIcon.type == ItemType.weapon)
                {
                    GlobalDataManager.instance.myTryOutData.weaponId = this.selectMallIcon.data.itemId;
                }

                this.updateState();
            }
        });

        this.payBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            
            if(this.selectMallIcon)
            {
                if(EconomicManager.instance.coin >= this.selectMallIcon.data.price)
                {
                    EconomicManager.instance.coin -= this.selectMallIcon.data.price;
                    BackpackManager.instance.unlockBackpackItem(this.selectMallIcon.data.itemId);
                    this.updateState();
                }else
                {
                    GameManager.instance.showPopupText(CommonUils.getNodeWorldPos(this.payBtn.node),"金币不足",56,cc.Color.RED);
                }
            }

        }, this);

        this.useBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            
            if(this.selectMallIcon)
            {

                if(this.selectMallIcon.type == ItemType.role)
                {
                    DataManager.instance.getPlayerData().roleId = this.selectMallIcon.data.itemId;
                }

                if(this.selectMallIcon.type == ItemType.weapon)
                {
                    DataManager.instance.getPlayerData().weaponId = this.selectMallIcon.data.itemId;
                }

                GlobalDataManager.instance.myTryOutData = null;

                this.updateState();

            }

        }, this);

    }

    // update (dt) {}


    public updateState()
    {   
        UIManager.instance.mainUI.onUpdateMainSkin()
        if(GlobalDataManager.instance.myTryOutData)
        {
            if(
                this.selectMallIcon.data.itemId == GlobalDataManager.instance.myTryOutData.roleId ||
                this.selectMallIcon.data.itemId == GlobalDataManager.instance.myTryOutData.weaponId
            ){
    
                this.tryOutBtn.node.active = false;
                this.payBtn.node.active = false;
                this.useBtn.node.active = false;
                this.usedLabel.active = true;

            }else
            {
                if(
                    this.selectMallIcon.data.itemId == DataManager.instance.getPlayerData().roleId ||
                    this.selectMallIcon.data.itemId == DataManager.instance.getPlayerData().weaponId 
                ){
                    this.tryOutBtn.node.active = false;
                    this.payBtn.node.active = false;
                    this.useBtn.node.active = true;
                    this.usedLabel.active = false;
                }else
                {
                    if(this.selectMallIcon.backpackItemData.locked)
                    {
                        this.tryOutBtn.node.active = true;
                        this.payBtn.node.active = true;
                        this.useBtn.node.active = false;
                        this.usedLabel.active = false;
                    }else
                    {
                        this.tryOutBtn.node.active = false;
                        this.payBtn.node.active = false;
                        this.useBtn.node.active = true;
                        this.usedLabel.active = false;
                    }
                }
            }
        }else
        {
            if(
                this.selectMallIcon.data.itemId == DataManager.instance.getPlayerData().roleId ||
                this.selectMallIcon.data.itemId == DataManager.instance.getPlayerData().weaponId 
            ){
                this.tryOutBtn.node.active = false;
                this.payBtn.node.active = false;
                this.useBtn.node.active = false;
                this.usedLabel.active = true;
            }else
            {
                if(this.selectMallIcon.backpackItemData.locked)
                {
                    this.tryOutBtn.node.active = true;
                    this.payBtn.node.active = true;
                    this.useBtn.node.active = false;
                    this.usedLabel.active = false;
                }else
                {
                    this.tryOutBtn.node.active = false;
                    this.payBtn.node.active = false;
                    this.useBtn.node.active = true;
                    this.usedLabel.active = false;
                }
            }
        }

    }

    public awake()
    {
        super.awake();
    }

    public sleep()
    {
        super.sleep();
    }
}
