import Barrier, { BarrierType } from "../gamescene/Barrier";
import GameManager from "../core/GameManager";

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
export default class BarrierBrickSpawn extends Barrier {

    @property({type:cc.Enum(BarrierType)})
    spawnType: BarrierType = BarrierType.brick;

    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    public triggerEvent(sw:string)
    {
        if(this.sw && this.sw != "" && this.sw == sw)
        {

            var swValue:number = Number(this.sw);
            if(!isNaN(swValue))
            {
                if(swValue> 20 && swValue <= 30)
                {
                    this.spawnBrick();
                }else if(swValue> 30 && swValue <= 40)
                {

                    if(swValue == 31)
                    {
                        this.spawnType = BarrierType.powderKey;
                    }else
                    {
                        this.spawnType = BarrierType.powderKey2;
                    }

                    this.spawnPowderKeg();
                }
            }
            
        }
    }

    private spawnBrick()
    {
        var barrier:Barrier = GameManager.instance.getBarrier(this.spawnType);
        barrier.node.active = false;
        barrier.node.x = this.node.x;
        barrier.node.y = this.node.y;
        barrier.node.angle = this.node.angle;
        barrier.node.width = this.node.width;
        barrier.node.height = this.node.height;
        barrier.node.scaleX = this.node.scaleX;
        barrier.node.scaleY = this.node.scaleY;

        barrier.getComponent(cc.PhysicsBoxCollider).size = cc.size(this.node.width,this.node.height);

        barrier.node.active = true;
        barrier.node.parent = GameManager.instance.gameScene.barrierSpace;

        this.node.active = false;
    }

    private spawnPowderKeg()
    {
        var barrier:Barrier = GameManager.instance.getBarrier(this.spawnType);
        barrier.node.active = false;
        barrier.node.x = this.node.x;
        barrier.node.y = this.node.y;
        barrier.node.angle = this.node.angle;
        barrier.node.scaleX = this.node.scaleX;
        barrier.node.scaleY = this.node.scaleY;
        barrier.node.active = true;
        barrier.node.parent = GameManager.instance.gameScene.barrierSpace;

        this.node.active = false;
    }
}
