// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;


export enum SoundClipType
{
    none = 0,
    ball_floor,
    damage,
    ball_pole,
    ball_ring_1,
    ball_ring_2,
    ball_ring_3,
    ball_sheet_1,
    ball_sheet_2,
    woof_1,
    woof_2,
    cheer_1,
    cheer_2,
    cheer_3,
    hit_car,
}

@ccclass
export default class SoundClip extends cc.Component {

    @property(cc.String)
    public clipName:string = "";

    @property({type:cc.Enum(SoundClipType)})
    public type:SoundClipType = SoundClipType.none;

    @property({type:cc.AudioClip})
    public clip:cc.AudioClip = null;
     
}