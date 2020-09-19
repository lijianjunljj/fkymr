import Random from "../util/Random";
import GameScene from "./GameScene";
import GameManager from "../core/GameManager";
import BaseSceneObject from "../sceneobject/BaseSceneObject";
import ResourcesPool, { Recycle } from "../core/ResourcesPool";

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

export enum BarrierType
{
    ball = 0,
    box = 1,
    brick = 2,
    powderKey = 3,
    dragon = 4,
    powderKey2 = 5,
    brick2 = 6,
    sw = 7,
    sw2 = 8,
    sw3 = 9,
    brick3 = 10,
    brick4 = 11,
    brick5 = 12,
    spawnBrick = 13,
    spawnBrick2 = 14,
    glass = 15,
    captive = 16,
    dragon2 = 17
}

@ccclass
export default class Barrier extends BaseSceneObject implements Recycle{

    //@property({type:cc.Enum(BarrierType)})
    public type:BarrierType = BarrierType.ball;

    public stressLimit:number = 800;

    // LIFE-CYCLE CALLBACKS:

    protected get gameScene(): GameScene {
        return GameManager.instance.gameScene;
    }

    private _rigibody: cc.RigidBody = null;

    public get rigibody(): cc.RigidBody {

        if(!this._rigibody)
        {
            this._rigibody = this.getComponent(cc.RigidBody);
        }

        return this._rigibody;
    }

    /**
     * 是否着陆
     */
    protected grounded:boolean = false;

    public evt:string = "";

    public sw:string = "";

    public moveData:string = "";

    public rivetData:string = "";

    public motorData:string = "";

    //public moveTarget:cc.Vec2 = cc.Vec2.ZERO

    // onLoad () {}

    public start () {

        //this.gameScene = GameManager.instance.gameScene.getComponent(GameScene);

    }

    public init(arr:any[])
    {
        this.type = arr[0];
        this.node.x = arr[1];
        this.node.y = arr[2];
        this.node.angle = arr[3];
        this.node.width = arr[4];
        this.node.height = arr[5];
        this.node.scaleX = arr[6];
        this.node.scaleY = arr[7];
        this.evt = arr[8];

        if(this.evt)
        {
            var evtArr:string[] = this.evt.split(",");
            for(var i = 0 ; i < evtArr.length ; i++)
            {
                var evtDatas:string[] = evtArr[i].split(":");

                if(evtDatas[0] == "sw")
                {
                    this.sw = evtDatas[1];
                }else if(evtDatas[0] == "move")
                {
                    this.moveData = evtDatas[1];
                }else if(evtDatas[0] == "rivet")
                {
                    this.rivetData = evtDatas[1];
                }else if(evtDatas[0] == "motor")
                {
                    this.motorData = evtDatas[1];
                }else if(evtDatas[0] == "spawn")
                {
                    this.motorData = evtDatas[1];
                }
            }
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
        //cc.log("concact",concact.getWorldManifold());
        //cc.log("otherCollider",otherCollider.node.name,this.rigibody.linearVelocity.mag(),otherCollider.getComponent(cc.RigidBody).linearVelocity.mag());

        var stress:number = otherCollider.getComponent(cc.RigidBody).linearVelocity.sub(this.rigibody.linearVelocity).mag();

        var velocity1:cc.Vec2 = this.rigibody.linearVelocity;
        velocity1.y /= this.rigibody.gravityScale;

        var velocity2:cc.Vec2 = otherCollider.getComponent(cc.RigidBody).linearVelocity;
        velocity2.y /= otherCollider.getComponent(cc.RigidBody).gravityScale;
        
        //cc.log(" 受力瞬间 ",stress);

        if(stress >= this.stressLimit )
        {
            this.setDamage();
        }

        if(otherCollider.getComponent(cc.RigidBody).type == cc.RigidBodyType.Dynamic)
        {
            otherCollider.getComponent(cc.RigidBody).linearVelocity.mag() / otherCollider.getComponent(cc.RigidBody).gravityScale
        }
    }

    public setDamage()
    {

    }

    /**
     * 
     * @param event 触发事件
     */
    public triggerEvent(sw:string)
    {

    }

    // update (dt) {}

    public getKey():string
    {
        
        //return PopupText.name;
        return this.node.name;
    }

    public awake()
    {
        this.node.active = true;
        this.node.angle = 0;
        this.node.position = cc.Vec2.ZERO;
        this.node.color = cc.Color.WHITE;
        this.node.opacity = 255;
        this.node.scale = 1;
        this.evt = "";
        this.sw = "";
        this.moveData = "";
    }
    public sleep()
    {
        this.node.stopAllActions();
        this.node.parent = null;
        this.node.active = false;
    }

    public destroySelf()
    {
        ResourcesPool.instance.put(this,0);
    }
}
