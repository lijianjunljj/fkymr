import BaseSceneObject from "../sceneobject/BaseSceneObject";
import Mathf from "../util/Mathf";
import EnemyPart from "../enemy/EnemyPart";
import Weapon from "./Weapon";
import CommonUils from "../util/CommonUils";
import GameManager, { GameStatus } from "../core/GameManager";
import Captive from "../captive/Captive";
import CaptivePart from "../captive/CaptivePart";

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
export default class HurtArea extends cc.Component {

    private _weapon: Weapon = null;
    public get weapon(): Weapon {
        return this._weapon;
    }

    @property
    public hurtPower:number = 0;

    @property
    public isExplosion:boolean = false;

    private _rigibody: cc.RigidBody = null;

    public get rigibody(): cc.RigidBody {

        if(!this._rigibody)
        {
            this._rigibody = this.getComponent(cc.RigidBody);
        }

        return this._rigibody;
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        if(this.node.parent)
        {
            this._weapon = this.node.parent.getComponent(Weapon);
        }
    }

    start () {

    }

    update (dt) 
    {
        if(GameManager.instance.gameStatus != GameStatus.start)
        {
            return;
        }

        if(this.weapon)
        {
            this.rigibody.linearVelocity = this.weapon.rigibody.linearVelocity;
        }
        
    }

    /**
     * 类似unity 的OnCollisionEnter OnTriggerEnter的结合
     * @param concact 
     * @param selfCollider 
     * @param otherColliser 
     */
    public onBeginContact(concact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherCollider:cc.PhysicsCollider)
    {
        var velocity:cc.Vec2 = this.rigibody.linearVelocity;

        if(velocity.y > -100 && velocity.y < 0 && !otherCollider.sensor)
        {
            velocity.y = 0;
        }

        this.rigibody.linearVelocity = velocity;

        var volume:number =  Mathf.clamp(this.rigibody.linearVelocity.mag() / 320,0,1);

        if(volume < 1)
        {
            volume = volume * volume; 
        }

        if(Math.abs(this.node.x) > 1000)
        {
            volume *= 1000 / Math.abs(this.node.x);
        }

        //cc.log("concact",concact.getWorldManifold());
        //cc.log("otherCollider",otherCollider.node.name,this.rigibody.linearVelocity.mag(),volume)

        switch(otherCollider.tag)
        {
            case 1://碰到敌人

                if(this.rigibody.linearVelocity.mag() >= this.hurtPower)
                {
                    var dir = CommonUils.getNodeWorldPos(otherCollider.node).sub(CommonUils.getNodeWorldPos(this.node));
                    otherCollider.getComponent(EnemyPart).onHitWeapon(dir,this.rigibody.linearVelocity,this);

                    if(this.isExplosion)
                    {
                        otherCollider.getComponent(cc.RigidBody).applyForceToCenter(dir.mul(200),true);
                    }
                }

            break;

            case 2://碰到障碍


                if(this.rigibody.linearVelocity.mag() >= this.hurtPower)
                {
                    var dir = CommonUils.getNodeWorldPos(otherCollider.node).sub(CommonUils.getNodeWorldPos(this.node));
                    otherCollider.getComponent(BaseSceneObject).onHitWeapon(dir,this.rigibody.linearVelocity,this);

                    if(this.isExplosion)
                    {
                        otherCollider.getComponent(cc.RigidBody).applyForceToCenter(dir.mul(1000),true);
                        otherCollider.getComponent(cc.RigidBody).applyTorque(-Mathf.sign(dir.x) * 100000,true)
                    }
                }

            break;

            case 3: //碰到墙壁

            break;

            case 4: //碰到武器

            break;

            case 5: //碰到俘虏

                if(this.rigibody.linearVelocity.mag() >= this.hurtPower)
                {
                    var dir = CommonUils.getNodeWorldPos(otherCollider.node).sub(CommonUils.getNodeWorldPos(this.node));
                    otherCollider.getComponent(CaptivePart).onHitWeapon(dir,this.rigibody.linearVelocity,this);

                    if(this.isExplosion)
                    {
                        otherCollider.getComponent(cc.RigidBody).applyForceToCenter(dir.mul(200),true);
                    }
                }

            break;


            default:
                //SoundManager.instance.playAudioClip(SoundClipType.ball_floor,volume);
            break;
        }

    }

}
