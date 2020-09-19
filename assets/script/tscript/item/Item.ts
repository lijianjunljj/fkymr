import { ItemType } from "./ItemType";

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
export default class Item extends cc.Component {

    @property({type:cc.Enum(ItemType)})
    public type:ItemType = ItemType.none;


    //@property
    //public value:number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {
        
    }

    public destroySelf():void
    {
        this.node.destroy();
    }
    // update (dt) {}
}
