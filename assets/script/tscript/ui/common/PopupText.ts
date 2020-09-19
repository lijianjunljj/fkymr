
import ResourcesPool, { Recycle } from "../../core/ResourcesPool";
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
export default class PopupText extends cc.Component implements Recycle {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    @property(cc.Label)
    private label:cc.Label = null;

    start () {

    }


    public showText(msg:string,size:number,color:cc.Color)
    {
        this.label.string = msg;
        this.label.fontSize = size;
        this.label.node.color = color;

        this.scheduleOnce(()=>{

            var compCallback = cc.callFunc(()=>{
                this.destroySelf();
            },this);
    
            var seq = cc.sequence(cc.spawn(cc.moveBy(0.5,0,50),cc.fadeTo(0.5,25)),compCallback);
            this.node.runAction(seq);

        },0.5)
    }

    // update (dt) {}

    public getKey():string
    {
        
        //return PopupText.name;
        return "PopupText";
    }

    public awake()
    {
        this.node.position = cc.Vec2.ZERO;
        this.node.active = true;
        this.node.color = cc.Color.WHITE;
        this.node.opacity = 255;
    }
    public sleep()
    {
        this.node.stopAllActions();
        this.node.parent = null;
        this.node.active = false;
    }

    public destroySelf()
    {
        ResourcesPool.instance.put(this,45);
    }

}
