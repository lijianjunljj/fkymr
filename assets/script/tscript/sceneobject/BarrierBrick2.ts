import Barrier from "../gamescene/Barrier";
import HurtArea from "../player/HurtArea";
import Vector2 from "../util/Vector2";

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
export default class BarrierBrick2 extends Barrier {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private targetPos:cc.Vec2 = cc.Vec2.ZERO;

    private starPos:cc.Vec2 = cc.Vec2.ZERO;

    private endPos:cc.Vec2 = cc.Vec2.ZERO;

    private moveDir:cc.Vec2 = cc.Vec2.ZERO;

    private moveSpeed = 100;

    private _rigidbody: cc.RigidBody = null;

    public get rigidbody(): cc.RigidBody {

        if(!this._rigidbody)
        {
            this._rigidbody = this.getComponent(cc.RigidBody);
        }

        return this._rigidbody;
    }

    start () {
        this.rigidbody.type = cc.RigidBodyType.Kinematic;
        cc.log(cc.RigidBodyType[this.rigidbody.type]);
    }

    public init(arr:any[])
    {
        this.node.active = false;
        super.init(arr);

        this.getComponent(cc.PhysicsBoxCollider).size = cc.size(this.node.width,this.node.height);
        this.node.active = true;


        if(this.moveData && this.moveData != "")
        {
            var posStrArr:string[] = this.moveData.split("|");
            if(!posStrArr[0] || !posStrArr[1])
            {
                cc.error("移动事件数据格式不正确",this.evt);
                this.moveData = null;
                return;
            }

            this.starPos = this.node.position;
            this.endPos = cc.v2(Number(posStrArr[0]),Number(posStrArr[1])); 

            this.targetPos = this.endPos;

            /*var dis = endPos.sub(starPos).mag();
            var baseSpeed = 60;
            var baseTimer = dis / baseSpeed;

            var seq = cc.sequence(cc.moveTo(baseTimer,endPos),cc.moveTo(baseTimer,starPos));
            this.node.runAction(seq.repeatForever());*/
       
        }

    }

    update (dt) 
    {
        if(this.moveData)
        {
            this.moveDir = this.targetPos.sub(this.node.position).normalize();
            this.rigidbody.linearVelocity = this.moveDir.mul(this.moveSpeed);

            if(Vector2.distance(this.node.position,this.targetPos) < this.moveSpeed * dt)
            {
                if(this.targetPos == this.endPos)
                {
                    this.targetPos = this.starPos;
                }else
                {
                    this.targetPos = this.endPos;
                }
            }

        }
        
        
    }

    public triggerEvent(sw:string)
    {
        if(this.sw && this.sw != "" && this.sw == sw)
        {
            var swValue:number = Number(this.sw);
            if(!isNaN(swValue))
            {
                if(swValue> 10 && swValue <= 20)
                {
                    this.node.active = false;
                }
            }
        }
    }

    public destroySelf()
    {
        this.node.destroy();
    }
}
