import ResourcesPool, { Recycle } from "../core/ResourcesPool";
import Player, { PlayerControlType } from "./Player";
import SoundManager from "../core/SoundManager";
import { SoundClipType } from "../audio/SoundClip";
import HurtArea from "./HurtArea";


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

export enum WeaponStatus
{
    none,
}

export enum WeaponType
{
    bullet = 0,
    stone = 1,
}

@ccclass
export default class Weapon extends cc.Component implements Recycle {

    // LIFE-CYCLE CALLBACKS:

    @property({type:cc.Enum(WeaponType)})
    public type:WeaponType = WeaponType.bullet;

    @property(cc.Sprite)
    public skin:cc.Sprite = null;

    @property(cc.MotionStreak)
    public tail:cc.MotionStreak = null;


    public player:Player = null;

    public status:WeaponStatus = WeaponStatus.none;

    public mass:number;
    
    public timer:number = 0;

    public isDestroy:boolean = false;

    private _rigibody: cc.RigidBody = null;

    public get rigibody(): cc.RigidBody {

        if(!this._rigibody)
        {
            this._rigibody = this.getComponent(cc.RigidBody);
        }

        return this._rigibody;
    }


    /*private _hurtArea: HurtArea;
    public get hurtArea(): HurtArea {

        if(!this._hurtArea)
        {
            this._hurtArea = this.getComponentInChildren(HurtArea);
        }

        return this._hurtArea;
    }*/
 

    // onLoad () {}

    start () {

        this.rigibody.type = cc.RigidBodyType.Dynamic;
        this.mass = this.rigibody.getMass();
        this.rigibody.type = cc.RigidBodyType.Kinematic;

        this.tail.node.active = true;

        this.tail.node.zIndex = 0
        this.skin.node.zIndex = 2;

    }

    update (dt) 
    {

        if(!this.player)
        {
            return;
        }

        if(this.timer > 0)
        {
            this.timer -= dt;

            if(this.timer <= 0)
            {
                this.timer = 0;

                this.destroySelf(); 

            }
        }

        //this.tailPartical.node.position = this.node.position;

    }

    public throw(force:cc.Vec2):void
    {

        this.rigibody.type = cc.RigidBodyType.Dynamic;
        //this.rigibody.applyForceToCenter(force,true);
        this.rigibody.linearVelocity = force.mul(1/this.rigibody.getMass() * 2.25);
        this.rigibody.applyTorque(2000,true);

        if(SoundManager.instance)
        {
            SoundManager.instance.playAudioClip(SoundClipType.woof_1);
        }
        //cc.log("force",force.toString(),"speed ",this.rigibody.linearVelocity.toString())

        this.timer = 2.0;

    }

    public showTail()
    {
        this.tail.node.active = true; 
    }


    /**
     * 类似unity 的OnCollisionEnter OnTriggerEnter的结合
     * @param concact 
     * @param selfCollider 
     * @param otherColliser 
     */
    public onBeginContact(concact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherCollider:cc.PhysicsCollider)
    {
        
        //cc.log("concact",concact.getWorldManifold());
        //cc.log("otherCollider",otherCollider.node.name,this.rigibody.linearVelocity.mag(),volume)

        switch(otherCollider.tag)
        {
            case 1:

            break;

            case 2:

            break;

            case 3: //碰到墙壁 立即销毁
                this.scheduleOnce(()=>{
                    this.destroySelf();
                },0);
            break;


            default:
                //SoundManager.instance.playAudioClip(SoundClipType.ball_floor,volume);
            break;
        }

    }

    public getKey():string
    {
        
        //return PopupText.name;
        return "Weapon";
    }

    public awake()
    {
        if(this.isDestroy)
        {
            return;
        }

        this.node.angle = 0;
        this.node.position = cc.Vec2.ZERO;
        this.node.active = true;
        this.node.color = cc.Color.WHITE;
        this.node.opacity = 255;
        this.node.scale = 1;
        this.skin.node.opacity = 255;

        this.player = null;
        this.status = WeaponStatus.none;

        this.tail.node.active = true;

        this.rigibody.linearVelocity = cc.Vec2.ZERO;
        this.rigibody.angularVelocity = 0;
        this.rigibody.type = cc.RigidBodyType.Kinematic;
        this.rigibody.enabled = true;
        this.getComponentInChildren(HurtArea).rigibody.linearVelocity = cc.Vec2.ZERO;

        this.timer = 0;

    }
    public sleep()
    {
        this.timer = 0;
        this.node.stopAllActions();
        this.node.parent = null;
        this.node.active = false;
        this.rigibody.linearVelocity = cc.Vec2.ZERO;
        this.rigibody.angularVelocity = 0;
        this.rigibody.type = cc.RigidBodyType.Kinematic;
        this.rigibody.enabled = false;
        this.getComponentInChildren(HurtArea).rigibody.linearVelocity = cc.Vec2.ZERO;
    }

    
    public destroySelf()
    {
        //ResourcesPool.instance.put(this,15);
        this.node.destroy();
    }

    onDestroy()
    {
        this.isDestroy = true;
    }
}
