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
export default class Captive extends Barrier {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.Node)
    private body:cc.Node = null;

    @property(cc.Sprite)
    private truck:cc.Sprite = null;

    @property(cc.SpriteFrame)
    private damageSkin:cc.SpriteFrame = null;

    @property(cc.Node)
    private damageEffect:cc.Node = null;

    //@property(cc.Node)
    //private body2:cc.Node = null;

    public isDie:boolean = false;

    onLoad () 
    {
       
    }

    start () {

        var joins:cc.RigidBody[] = this.getComponentsInChildren(cc.RigidBody);

        for(var i = 0 ; i < joins.length ; i++)
        {
            joins[i].type = cc.RigidBodyType.Dynamic;
            //joins[i].gravityScale = 0;
        }

    }

    public init(arr:any[])
    {
        this.node.active = false;
        super.init(arr);
        this.node.active = true;

        this.node.scale = 1;

        var joins:cc.RigidBody[] = this.body.getComponentsInChildren(cc.RigidBody);

        for(var i = 0 ; i < joins.length ; i++)
        {
            joins[i].node.scaleX *= arr[6];
            joins[i].node.x *= arr[6];

            joins[i].node.scaleY *= arr[7];
            joins[i].node.y *= arr[7];

            if(joins[i].getComponent(cc.PolygonCollider))
            {
                var points = joins[i].getComponent(cc.PolygonCollider).points;
                for(var j = 0 ; j < points.length ; j++)
                {
                    points[j].x *= arr[6];
                    points[j].y *= arr[7];
                }
            }

            if(joins[i].getComponent(cc.RevoluteJoint))
            {
                joins[i].getComponent(cc.RevoluteJoint).anchor.x *= arr[6];
                joins[i].getComponent(cc.RevoluteJoint).anchor.y *= arr[7];

                joins[i].getComponent(cc.RevoluteJoint).connectedAnchor.x *= arr[6];
                joins[i].getComponent(cc.RevoluteJoint).connectedAnchor.y *= arr[7];
            }
        }

        

    }

    public onHitWeapon(dir:cc.Vec2,force:cc.Vec2,hurtArea:HurtArea)
    {
        super.onHitWeapon(dir,force,hurtArea);
        this.scheduleOnce(()=>{
            this.die();
        },0);//在物理碰撞检测帧中不能做刚体和节点位置处理，只能延迟一帧执行

    }
    

    public die()
    {
        if(this.isDie)
            return;

        this.isDie = true;

        this.damageEffect.active = true;

        this.truck.spriteFrame = this.damageSkin;

        var joins:cc.RigidBody[] = this.getComponentsInChildren(cc.RigidBody);

        for(var i = 0 ; i < joins.length ; i++)
        {
            joins[i].type = cc.RigidBodyType.Dynamic;
            joins[i].gravityScale = 1.0;
        }
    }

    
    /*update (dt)
     {
         if(Input.getKeyDown(KeyCode.Q))
         {
            var joins:cc.RigidBody[] = this.getComponentsInChildren(cc.RigidBody);

            for(var i = 0 ; i < joins.length ; i++)
            {
                joins[i].type = cc.RigidBodyType.Dynamic;
            }
         }
     }*/

     public destroySelf()
    {
        this.node.destroy();
    }
}
