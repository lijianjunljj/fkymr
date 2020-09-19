import Player, { PlayerStatus } from "./Player";


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
export default class Body extends cc.Component {


    public player:Player = null;

    
    //@property(dragonBones.ArmatureDisplay)
    //public skin:dragonBones.ArmatureDisplay = null;

    @property(cc.Node)
    public truck:cc.Node = null;

    @property(cc.Node)
    public hand:cc.Node = null;

    onLoad()
    {
        this.player = this.node.parent.getComponent(Player);
    }

    start () {
        
    }

    update (dt) 
    {
     
    }

}
