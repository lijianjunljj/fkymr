import Barrier from "../gamescene/Barrier";
import HurtArea from "../player/HurtArea";
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
export default class BarrierSW extends Barrier {

    @property(cc.SpriteFrame)
    private skin1:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private skin2:cc.SpriteFrame = null;

    private isOpen:boolean = false;

    public stressLimit = 1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }


    public init(arr:any[])
    {
        super.init(arr);
    }


    public onHitWeapon(dir:cc.Vec2,force:cc.Vec2,hurtArea:HurtArea)
    {
        if(!this.isOpen)
        {
            super.onHitWeapon(dir,force,hurtArea);
        }

        this.openSW();
    }

    public setDamage()
    {
        this.openSW();
    }

    private openSW()
    {
        if(this.isOpen)
        return;

        this.isOpen = true;
        this.getComponent(cc.Sprite).spriteFrame = this.skin2;

        var barriers:Barrier[] = GameManager.instance.gameScene.barriers;

        for(var i = 0 ; i < barriers.length ; i++)
        {
            if(barriers[i] == this)
            {
                continue;
            }

            barriers[i].triggerEvent(this.sw);
        }
    }

    // update (dt) {}

    public destroySelf()
    {
        this.node.destroy();
    }
}
