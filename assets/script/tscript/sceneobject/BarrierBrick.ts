import Barrier from "../gamescene/Barrier";
import HurtArea from "../player/HurtArea";
import GridLayer from "../editor/GridLayer";

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
export default class BarrierBrick extends Barrier {

    @property(HurtArea)
    hurtArea: HurtArea = null;


    private _rivet: cc.Node;
    public get rivet(): cc.Node {

        if(!this._rivet)
        {
            this._rivet = new cc.Node("Rivet");
            this._rivet.parent = this.node;
            var rigidBody:cc.RigidBody = this.rivet.addComponent(cc.RigidBody);
            var joint:cc.RevoluteJoint = this.rivet.addComponent(cc.RevoluteJoint);
            var graphics:cc.Graphics = this._rivet.addComponent(cc.Graphics);
            rigidBody.type = cc.RigidBodyType.Kinematic;

            graphics.fillColor = cc.color(0,0,0);
            graphics.circle(0,0,8);
            graphics.fill();
            graphics.stroke();
    
            joint.connectedBody = this.getComponent(cc.RigidBody);

            //joint.connectedBody = this.getComponent(cc.RigidBody);
            //joint.connectedAnchor = cc.v2(-200,0);

            /*joint.upperAngle = 180;
            joint.lowerAngle = 0;
            //joint.enableLimit = true;

            joint.maxMotorTorque = 200;
            joint.motorSpeed = 200;
            joint.enableMotor = true;*/


        }

        return this._rivet;
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        //this.rivet.getComponent(cc.RevoluteJoint).connectedBody = this.getComponent(cc.RigidBody);
        //this.motor.getComponent(cc.MotorJoint).connectedBody = this.getComponent(cc.RigidBody);
        //this.getComponent(cc.RigidBody).type = cc.RigidBodyType.Kinematic;
        //this.getComponent(cc.RigidBody).angularVelocity = 100;
    }


    public init(arr:any[])
    {
        this.node.active = false;
        this.hurtArea.node.active = false;
        super.init(arr);

        this.getComponent(cc.PhysicsBoxCollider).size = cc.size(this.node.width,this.node.height);
        this.hurtArea.getComponent(cc.PhysicsBoxCollider).size = cc.size(this.node.width + 1,this.node.height + 1);
        
        this.hurtArea.node.active = true;
        this.node.active = true;

        if(this.rivetData && this.rivetData != "")
        {
            var rivetStrArr:string[] = this.rivetData.split("|");
            if(rivetStrArr[0] && rivetStrArr[1])
            {
                var rivetPos:cc.Vec2 = cc.v2(Number(rivetStrArr[0]),Number(rivetStrArr[1]));
                this.rivet.getComponent(cc.RevoluteJoint).connectedAnchor = rivetPos;
                this.rivet.position = rivetPos;
            }
        }

        if(this.motorData && this.motorData != "")
        {
            var motorStrArr:string[] = this.motorData.split("|");
            if(motorStrArr[0] && motorStrArr[1])
            {
                var motorParam:cc.Vec2 = cc.v2(Number(motorStrArr[0]),Number(motorStrArr[1]));
                this.rivet.getComponent(cc.RevoluteJoint).maxMotorTorque = motorParam.x;
                this.rivet.getComponent(cc.RevoluteJoint).motorSpeed = motorParam.y;
                this.rivet.getComponent(cc.RevoluteJoint).enableMotor= true;
                this.rivet.getComponent(cc.Graphics).clear();
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

    // update (dt) {}

    public destroySelf()
    {
        this.node.destroy();
    }
}
