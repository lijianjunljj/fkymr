

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
export default class Teach extends cc.Component {

    

    public complete:Function = null;


    public teaching = false;

    start () {

        this.teaching = true;


        this.scheduleOnce(()=>{
            this.guide();
        },1);

    }

    public guide()
    {


        this.enterStep(1);



        /*this.throwForce = this.player.getForceFrom(this.startPos, this.currentPos);
        this.throwForce.mulSelf(1.45);
        this.updateTrajectory(this.throwForce);*/
    }

    private enterStep(step:number)
    {
        
    }


    update (dt)
    {
        
    }

    

    
}
