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

export enum BgSoundClipType
{
    none = 0,
    main = 1,
    level1 = 2,
    level2 = 3,
    level3 = 4,
    level4 = 5,
    level5 = 6,
}

@ccclass
export default class BgSoundClip extends cc.Component {
    @property(cc.String)
    public clipName:string = "";

    @property({type:cc.Enum(BgSoundClipType)})
    public type:BgSoundClipType = BgSoundClipType.none;

    @property({type:cc.AudioClip})
    public clip:cc.AudioClip = null;
}
