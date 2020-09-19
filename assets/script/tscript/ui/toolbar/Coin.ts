import ResourcesPool, { Recycle } from "../../core/ResourcesPool";
import ResourcesManager from "../../core/ResourcesManager";


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

@ccclass
export default class Coin extends cc.Component implements Recycle {

    
    private model:cc.Node = null;

    // onLoad () {}

    start () {

        ResourcesManager.instance.load("CoinPrefab",(node:cc.Node)=>{
            this.model = node;
            this.node.addChild(node);
            node.position = cc.Vec2.ZERO;
            node.active = true;
        },cc.Prefab,true,true);

    }

    public init()
    {
        
    }

   
    public fly()
    {
        
       // var seq = cc.sequence(action,compCallback);
       // this.node.runAction(seq);
    }

    public getKey():string
    {
        return "Coin";
    }

    public awake()
    {
        this.node.position = cc.Vec2.ZERO;
        this.node.active = true;
    }
    public sleep()
    {
        this.node.stopAllActions();
        this.node.setParent(null);
        this.node.active = false;
    }

    public destroySelf()
    {
        ResourcesPool.instance.put(this,20);
    }

    // update (dt) {}
}
