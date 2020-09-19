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
export default class BaseUI extends cc.Component {


    protected basePos:cc.Vec2 = cc.Vec2.ZERO;

    public onLoad()
    {
        this.basePos = this.node.position;

        /*this.scheduleOnce(()=>{
           this.close();
        },0.01)*/

        this.close();

    }

 

    public open()
    {
        this.node.active = true;
        this.scheduleOnce(()=>{
            this.node.position = cc.Vec2.ZERO;
        },0.01);
        
    }

    public close()
    {
        this.node.active = false;
        this.node.position = this.basePos;
    }

}
