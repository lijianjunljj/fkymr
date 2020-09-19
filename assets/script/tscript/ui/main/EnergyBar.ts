import DataManager from "../../core/DataManager";

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
export default class EnergyBar extends cc.Component {

    @property(cc.Label)
    valueTxt: cc.Label = null;

    @property(cc.Label)
    timerTxt: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        this.timerTxt.string = "";
    }

    start () {

        this.valueTxt.string =  "×" + DataManager.instance.getPlayerData().energy;
        ///cc.systemEvent.on("energyRecoverCD",this.onEnergyRecoverCdRun,this);
    }

    private onEnergyRecoverCdRun(s,m,h,str,t)
    {
        this.valueTxt.string =  "×" + DataManager.instance.getPlayerData().energy;

        if(DataManager.instance.getPlayerData().energy >= 15)
        {
            this.timerTxt.string = "已满";
        }else
        {
            this.timerTxt.string = str;
        }
    }

    onEnable()
    {
        cc.systemEvent.on("energyRecoverCD",this.onEnergyRecoverCdRun,this);
    }

    onDisable()
    {
        cc.systemEvent.off("energyRecoverCD",this.onEnergyRecoverCdRun,this);
    }
    onDestroy()
    {
        cc.systemEvent.off("energyRecoverCD",this.onEnergyRecoverCdRun,this);
    }

    // update (dt) {}
}
