
import HurtArea from "../player/HurtArea";
import Captive from "./Captive";

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
export default class CaptivePart extends cc.Component {

    
    private _captive: Captive = null;
    public get captive(): Captive {

        if(!this._captive)
        {
            this._captive = this.node.parent.parent.getComponent(Captive);
        }

        return this._captive;
    }

    private _rigibody: cc.RigidBody = null;

    public get rigibody(): cc.RigidBody {

        if(!this._rigibody)
        {
            this._rigibody = this.getComponent(cc.RigidBody);
        }

        return this._rigibody;
    }


    start () {

    }

    public onHitWeapon(dir:cc.Vec2,force:cc.Vec2,hurtArea:HurtArea)
    {
        this.captive.onHitWeapon(dir,force,hurtArea);

    }

    // update (dt) {}

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

        //cc.log(" 受力瞬间 ",stress);

        if(stress > 250)
        {
            if(!this.captive.isDie)
            {
                this.scheduleOnce(()=>{
                    this.captive.die();
                },0)
            }
        }

        switch(otherCollider.tag)
        {
            case 1:

            break;

            case 2:

            break;

            case 3: //碰到墙壁 立即销毁
        
            break;

            case 4: //武器

            break;

            default:
                
            break;
        }

    }

}
