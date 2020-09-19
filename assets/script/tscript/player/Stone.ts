import Weapon from "./Weapon";
import SoundManager from "../core/SoundManager";
import { SoundClipType } from "../audio/SoundClip";

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
export default class Stone extends Weapon {

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        super.start();
    }

    update (dt) 
    {
        super.update(dt);
    }

    public throw(force:cc.Vec2):void
    {

        //force = cc.v2(0,320);
        //super.throw(force);

        this.rigibody.type = cc.RigidBodyType.Dynamic;
        //this.rigibody.applyForceToCenter(force,true);
        this.rigibody.linearVelocity = force.mul(1/this.rigibody.getMass() * 3.935);
        this.rigibody.applyTorque(2000,true);

        if(SoundManager.instance)
        {
            SoundManager.instance.playAudioClip(SoundClipType.woof_1);
        }

        this.timer = 7.5;
    }
}
