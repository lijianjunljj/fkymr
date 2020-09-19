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

/**
 * 让刚体跟随父容器移动
 */
@ccclass
export default class RigibodyFollow extends cc.Component {

   
    private basePos:cc.Vec2 = cc.Vec2.ZERO;


    onLoad () 
    {
        this.basePos = this.node.position;
    }

    start () {

    }

    update (dt) 
    {
        this.node.position = this.basePos;
    }
}
