// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import CustomEventType from "../event/CustomEventType";
import Item from "../item/Item";
import GameManager, { GameStatus, GameMode } from "../core/GameManager";
import CommonUils from "../util/CommonUils";
import Mathf from "../util/Mathf";
import Vector2 from "../util/Vector2";
import UIManager from "../ui/UIManager";
import Body from "./Body";
import PlayerData from "../data/PlayerData";
import DataManager from "../core/DataManager";
import ResourcesManager from "../core/ResourcesManager";
import ItemConfigData from "../configdata/ItemConfigData";
import BackpackManager, { BackpackItemData } from "../core/BackpackManager";
import StrengthenConfigData from "../configdata/StrengthenConfigData";
import GlobalDataManager from "../core/GlobalDataManager";
import GameScene from "../gamescene/GameScene";
import Weapon, { WeaponType } from "./Weapon";


const {ccclass, property} = cc._decorator;


export enum PlayerStatus
{
    none = 0,
    idle = 1,
    shoot = 2,
}

export enum PlayerControlType
{
    /**
     * 无控制
     */
    none = 0,
    /**
     * 玩家控制
     */
    player = 1,

    /**
     * 玩家控制2
     */
    player2 = 2,

    /**
     * ai控制
     */
    ai = 3,
    /**
     * 网络玩家控制
     */
    net = 4,
}

@ccclass
export default class Player extends cc.Component {

    @property({type:cc.Enum(PlayerControlType),tooltip:"玩家控制类型:\nnone  无控制 \nplayer 玩家操作 \nai ai操作 \nnet 网络玩家操作"})
    public controlType:PlayerControlType = PlayerControlType.none;

    @property(Body)
    public body:Body = null;

    @property(cc.Node)
    public ballPoint:cc.Node = null;

    @property()
    public ballCount:number = 5;

    @property()
    public aimDotsNum:number = 30;

    @property(cc.Prefab)
    public trajectoryPointPrefab:cc.Prefab = null;

    @property()
    public power:number = 1.0;

    @property(Weapon)
    public currentWeapon:Weapon = null;

    @property(cc.Node)
    public aimedLime:cc.Node = null;

    private trajectoryPoints:cc.Node[] = [];

    private gameScene:GameScene = null;

    public score:number = 0;

    public playerData:PlayerData = null;

    /**
     * 抗雨能力
     */
    public resistRain:number = 0;

    /**
     * 抗风能力
     */
    public resistWind:number = 0;

    private timer:number = 0;

    private basePos:cc.Vec2 = cc.Vec2.ZERO;

    private dots:cc.Node = null;

    private aimedColor:cc.Color = cc.color(255,190,16);

    public roleId:number = 0;

    public weaponId:number = 0;

    public weaponType:WeaponType = WeaponType.bullet;
    

    /**
     * 连续进球
     */
    public continuousGoal:number = 0;

    private _status: PlayerStatus = PlayerStatus.none;
    public get status(): PlayerStatus {
        return this._status;
    }
    public set status(value: PlayerStatus) {

        if(this._status == value)
        {
            return;
        }

        this._status = value;
        
        if(this._status == PlayerStatus.idle)
        {
            
        }else if(this._status == PlayerStatus.shoot)
        {
     
        }

    }


    private _direction: number = 1;
    public get direction(): number {
        return this._direction;
    }
    public set direction(value: number) {

        if(this._direction == value)
        {
            return;
        }

        this._direction = value;

        if(this._direction > 0)
        {
            this.body.node.scaleX = 1;
        }else if(this._direction < 0)
        {
            this.body.node.scaleX = -1;
        }

    }


    public get aimDotsCount():number
    {
        return this.aimDotsNum;
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        this.status = PlayerStatus.idle;
    }

    start () {
       
        this.gameScene = GameManager.instance.gameScene;

        this.basePos = this.node.position;

        //this.direction = -1;

        this.createWeapon();

        if(this.controlType != PlayerControlType.none)
        {
            this.aimedLime.parent = this.gameScene.node;
            this.aimedLime.position = this.getWeaponPos();
        }
    }

    public reset()
    {
        this.score = 0;
        this.clearDots();
    }

    public onGameStart()
    {
        this.gameScene = GameManager.instance.gameScene;

        this.dots = this.gameScene.node.getChildByName("Dots");

        if(!this.dots)
        {
            this.dots = new cc.Node("Dots");
            this.dots.parent = this.gameScene.node;
        }

        //for (var i = 0; i < this.aimDotsCount; i++)
        for (var i = 0; i < 40; i++)
        {
            this.pushDot();
        }
    }

    public pushDot()
    {
        var dot:cc.Node = cc.instantiate(this.trajectoryPointPrefab);
        dot.parent = this.dots;
        dot.active = false;

        /*if(i >= this.aimDotsNum)
        {
            dot.color = cc.color(255,190,16);
        }*/

        this.trajectoryPoints.push(dot);
    }

    public onCollisionEnter(other:cc.Collider,self:cc.Collider)
    {
        
    }
    
    update (dt) {

        if(GameManager.instance.gameStatus != GameStatus.start)
        {
            return;
        }

        if(this.timer > 0)
        {
            this.timer -= dt;
            if(this.timer <= 0)
            {
                this.timer = 0;
                this.createWeapon();
            }
        }

        if(this.currentWeapon)
        {
            this.currentWeapon.node.position = cc.Vec2.ZERO;
            this.currentWeapon.rigibody.linearVelocity = cc.Vec2.ZERO; 
        }

    }


    public updateSkin(playerData:PlayerData = null)
    {
        if(!playerData)
        {
            this.playerData = DataManager.instance.getPlayerData();
        }else
        {
            this.playerData = playerData;
        }

        
        var itemConfigData:ItemConfigData = null;

        //itemConfigData = DataManager.instance.getItemConfigDataByItemId(this.playerData.roleId);
        //this.setRoleSkin(itemConfigData.itemId);

        //itemConfigData = DataManager.instance.getItemConfigDataByItemId(this.playerData.weaponId);
        //this.setWeaponSkin(itemConfigData.itemId);

    }


    public setRoleSkin(roleId:number)
    {
        this.roleId = roleId;
        ResourcesManager.instance.loadImage(`model/role/${roleId}/truck`,this.body.truck.getComponent(cc.Sprite));
        ResourcesManager.instance.loadImage(`model/role/${roleId}/hand`,this.body.hand.getComponent(cc.Sprite));
    }

    public setWeaponSkin(weaponId:number)
    {
        this.weaponId = weaponId;
        if(this.currentWeapon && this.weaponType == WeaponType.bullet)
        {
            ResourcesManager.instance.loadImage(`model/weapon/${this.weaponId}`,this.currentWeapon.skin);
        }
    }


    public createWeapon()
    {
        if(UIManager.instance.gameUI && UIManager.instance.gameUI.weaponCount <= 0)
        {
            return;
        }

        if(!this.currentWeapon)
        {
            //if(this.ballCount > 0)
            //{
            this.currentWeapon = GameManager.instance.getWeapon(this.weaponType);
            this.currentWeapon.node.parent = this.ballPoint;
            this.currentWeapon.player = this;

            if(this.weaponId != 0 && this.weaponType == WeaponType.bullet)
            {
                ResourcesManager.instance.loadImage(`model/weapon/${this.weaponId}`,this.currentWeapon.skin);
            }

            
        }
    }

    public throw(force:cc.Vec2)
    {
        if(!this.currentWeapon)
        {
            return;
        }

        UIManager.instance.gameUI.weaponCount --;

        CommonUils.setParent(this.currentWeapon.node,this.gameScene.weaponSpace)
        this.currentWeapon.throw(force);
        
        this.currentWeapon = null;

        this.timer = 0.25;

        

    }
    
    public getWeaponPos():cc.Vec2
    {
        if(!this.currentWeapon.node.parent)
        {
            this.currentWeapon.awake();
            this.currentWeapon.node.parent = this.ballPoint;
            this.currentWeapon.node.position = cc.Vec2.ZERO;
            this.currentWeapon.node.active = true;
        }
        var worldPos:cc.Vec2 = this.currentWeapon.node.parent.convertToWorldSpaceAR(this.currentWeapon.node.position);
        var relaPos:cc.Vec2 = this.gameScene.node.convertToNodeSpaceAR(worldPos);
        return relaPos;
    }

    public updateTrajectory(throwForce:cc.Vec2):void
    {
      
        if(!this.currentWeapon)
            return;

        this.body.hand.angle = -Vector2.angle(throwForce.mul(-1)) * this.direction;

        this.aimedLime.active = true;
        this.aimedLime.angle = -(Vector2.angle(throwForce) - 90);
        this.aimedLime.position = this.getWeaponPos();
    }

    public updateTrajectory2(throwForce:cc.Vec2):void
    {
      
        if(!this.currentWeapon)
            return;

        this.body.hand.angle = -Vector2.angle(throwForce.mul(-1)) * this.direction;

        var startPos:cc.Vec2 = this.getWeaponPos();
        var forceVector:cc.Vec2 = throwForce.mul(1/this.currentWeapon.mass)

        var velocity:number = Math.sqrt((forceVector.x * forceVector.x) + (forceVector.y * forceVector.y));
        var angle:number = Mathf.rad2Deg * (Math.atan2(forceVector.y, forceVector.x));

        var g:number = cc.director.getPhysicsManager().gravity.y;
        var ty:number = Math.abs(-forceVector.y/g); //球上升时间

        var minTime = 0.125;
        var timeStep:number = 0;
        timeStep += minTime;

        var baseAimedNum:number = Math.ceil(ty / minTime);
        var additionAimedNum:number = 0;

        for (var i = 0; i < this.trajectoryPoints.length; i++)
        {
            var dx:number = velocity * timeStep * Math.cos(angle * Mathf.deg2Rad);
            var dy:number = velocity * timeStep * Math.sin(angle * Mathf.deg2Rad) - (cc.director.getPhysicsManager().gravity.mag() * timeStep * timeStep / 2.0);
            var pos:cc.Vec2 = new cc.Vec2(startPos.x + dx, startPos.y + dy);
            this.trajectoryPoints[i].position = pos;

            //this.trajectoryPoints[i].GetComponent<Renderer>().sortingOrder = i;
            
            //this.trajectoryPoints[i].eulerAngles = new Vector3(0, 0, Mathf.Atan2(forceVector.y - (Physics.gravity.magnitude) * timeStep, forceVector.x) * Mathf.Rad2Deg);
            this.trajectoryPoints[i].angle = -Math.atan2(forceVector.y - (cc.director.getPhysicsManager().gravity.mag()) * timeStep, forceVector.x) * Mathf.rad2Deg
            timeStep += minTime;

            if(i < baseAimedNum)
            {
                this.trajectoryPoints[i].color = cc.Color.WHITE;
            }else
            {
                this.trajectoryPoints[i].color = this.aimedColor;
            }

            if(i < baseAimedNum + additionAimedNum)
            {
                this.trajectoryPoints[i].active = true;
            }else
            {
                this.trajectoryPoints[i].active = false;
            }

        }
    }

    

    public getForceFrom(fromPos:cc.Vec2, toPos:cc.Vec2):cc.Vec2
    {
        return toPos.sub(fromPos).mul(this.power);
    }
    

    public clearDots():void
    {
        
        this.aimedLime.active = false;

        for (var i = 0; i < this.trajectoryPoints.length; i++)
        {
            this.trajectoryPoints[i].active = false;
        }
    }

    public destroySelf()
    {
        //ResourcesPool.instance.put(this,1);
        this.node.destroy();
    }


}
