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

@ccclass
export default class Tile extends cc.Component implements Recycle {

    public type:number = 0;

    // onLoad () {}

    start () {

    }

    // update (dt) {}



    public getKey():string
    {
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
    }
    public sleep()
    {
        this.node.stopAllActions();
        this.node.parent = null;
        this.node.active = false;
    }

    public destroySelf()
    {
        if(this.type == 1)
        {
            ResourcesPool.instance.put(this,60); //第一种区块用得频率较高，缓存多一点
        }else
        {
            ResourcesPool.instance.put(this,5);
        }
    }

}
