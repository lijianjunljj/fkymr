import Mathf from "../util/Mathf";
import SoundManager from "../core/SoundManager";
import { SoundClipType } from "../audio/SoundClip";
import Random from "../util/Random";
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
export default class BaseSceneObject extends cc.Component {


    @property({type:cc.Enum(SoundClipType)})
    public hitSoundtype:SoundClipType = SoundClipType.none;

    // onLoad () {}

    start () {
        
    }

    // update (dt) {}

    public onHitWeapon(dir:cc.Vec2,force:cc.Vec2,hurtArea:HurtArea)
    {
        var volume:number =  Mathf.clamp(force.mag() / 320,0,1);

        if(volume === NaN)
        {
            volume = 0.5;
            cc.error("声音异常",force.mag());
        }

        if(SoundManager.instance)
        {
            SoundManager.instance.playAudioClip(this.hitSoundtype,volume);
        }
        
    }
}
