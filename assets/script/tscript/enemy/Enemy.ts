import Barrier from "../gamescene/Barrier";
import { Input, KeyCode } from "../core/InputManager";
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
export default class Enemy extends Barrier {

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
            joins[i].gravityScale = 0;
        }

    }

    public init(arr:any[])
    {
        this.node.active = false;
        super.init(arr);
        this.node.active = true;

        /*if(this.node.scale == -1)
        {
            this.node.scale = 1;
            this.body1.active = false;
            this.body2.active = true;
        }else
        {
            this.body1.active = true;
            this.body2.active = false;
        }*/

        /*if(this.node.scale == -1)
        {
            this.node.scale = 1;

            var joins:cc.RigidBody[] = this.body.getComponentsInChildren(cc.RigidBody);

            for(var i = 0 ; i < joins.length ; i++)
            {
                joins[i].node.scaleX *= -1;
                joins[i].node.x *= -1;
                if(joins[i].getComponent(cc.PolygonCollider))
                {
                    var points = joins[i].getComponent(cc.PolygonCollider).points;
                    for(var j = 0 ; j < points.length ; j++)
                    {
                        points[j].x *= -1;
                    }
                }

                if(joins[i].getComponent(cc.RevoluteJoint))
                {
                    joins[i].getComponent(cc.RevoluteJoint).anchor.x *= -1;
                    joins[i].getComponent(cc.RevoluteJoint).connectedAnchor.x *= -1;
                    
                }
            }

        }*/

        this.node.scale = 1;

        var joins:cc.RigidBody[] = this.body.getComponentsInChildren(cc.RigidBody);

        var scaleX:number = arr[6] * 1;
        var scaleY:number = arr[7] * 1;

        for(var i = 0 ; i < joins.length ; i++)
        {
            joins[i].node.scaleX *= scaleX;
            joins[i].node.x *= scaleX;

            joins[i].node.scaleY *= scaleY;
            joins[i].node.y *= scaleY;

            if(joins[i].getComponent(cc.PolygonCollider))
            {
                var points = joins[i].getComponent(cc.PolygonCollider).points;
                for(var j = 0 ; j < points.length ; j++)
                {
                    points[j].x *= scaleX;
                    points[j].y *= scaleY;
                }
            }

            if(joins[i].getComponent(cc.RevoluteJoint))
            {
                joins[i].getComponent(cc.RevoluteJoint).anchor.x *= scaleX;
                joins[i].getComponent(cc.RevoluteJoint).anchor.y *= scaleY;

                joins[i].getComponent(cc.RevoluteJoint).connectedAnchor.x *= scaleX;
                joins[i].getComponent(cc.RevoluteJoint).connectedAnchor.y *= scaleY;
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

        var wheelJoints:cc.WheelJoint[] = this.getComponentsInChildren(cc.WheelJoint);

        for(var i = 0 ; i < wheelJoints.length ; i++)
        {
            wheelJoints[i].connectedBody = null;
            wheelJoints[i].enabled = false;
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
