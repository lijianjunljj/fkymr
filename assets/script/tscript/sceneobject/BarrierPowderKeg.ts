import Barrier from "../gamescene/Barrier";
import HurtArea from "../player/HurtArea";
import SoundManager from "../core/SoundManager";
import { SoundClipType } from "../audio/SoundClip";
import AnimationController from "../util/AnimationController";

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
export default class BarrierPowderKeg extends Barrier {

   
    @property(AnimationController)
    public explodeEffect:AnimationController = null;

    public isExplode:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }


    /**
     * 类似unity 的OnCollisionEnter OnTriggerEnter的结合
     * @param concact 
     * @param selfCollider 
     * @param otherColliser 
     */
    public onBeginContact(concact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherCollider:cc.PhysicsCollider)
    {

        super.onBeginContact(concact,selfCollider,otherCollider);

    }

    public setDamage()
    {
        this.explode();
    }

    public onHitWeapon(dir:cc.Vec2,force:cc.Vec2,hurtArea:HurtArea)
    {
        this.explode();
    }

    public explode()
    {
        if(this.isExplode)
        {
            return;
        }

        this.isExplode = true;

        if(SoundManager.instance)
        {
            SoundManager.instance.playAudioClip(this.hitSoundtype,1);
        }

        this.getComponent(cc.Sprite).enabled = false;
        this.explodeEffect.node.active = true;
        //this.explodeEffect.playAnimation("Sprite",1);
        this.getComponent(cc.PhysicsCollider).enabled = false;

        this.scheduleOnce(()=>
        {
            this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
            this.getComponent(cc.RigidBody).linearVelocity = cc.Vec2.ZERO;
        },0);
        

        this.scheduleOnce(()=>
        {
            this.node.active = false;
        },1);

    }

    public triggerEvent(sw:string)
    {
        if(this.sw && this.sw != "" && this.sw == sw)
        {
            this.explode();
        }
    }

    // update (dt) {}

    public awake()
    {
        super.awake();
        this.getComponent(cc.Sprite).enabled = true;
        this.explodeEffect.node.active = false;
        this.getComponent(cc.PhysicsCollider).enabled = true;
        this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;

        this.isExplode = false;

    }
    public sleep()
    {
        super.sleep();
    }

    public destroySelf()
    {
        this.node.destroy();
    }
}
