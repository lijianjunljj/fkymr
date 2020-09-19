import Barrier from "../gamescene/Barrier";
import HurtArea from "../player/HurtArea";

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
export default class BarrierBox extends Barrier {

   
    @property(dragonBones.ArmatureDisplay)
    public explodeEffect:dragonBones.ArmatureDisplay = null;

    public isExplode:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public onHitWeapon(dir:cc.Vec2,force:cc.Vec2,hurtArea:HurtArea)
    {
        if(!this.isExplode)
        {
            super.onHitWeapon(dir,force,hurtArea);
        }
        this.explode();
    }

    public setDamage()
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

        this.getComponent(cc.Sprite).enabled = false;
        this.explodeEffect.node.active = true;
        this.explodeEffect.playAnimation("Sprite",1);
        this.getComponent(cc.PhysicsCollider).enabled = false;

        this.scheduleOnce(()=>
        {
            this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
        },0);

        this.scheduleOnce(()=>
        {
            this.node.active = false;
        },2);

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
}
