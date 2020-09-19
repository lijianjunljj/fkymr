import View from "../base/View";
import DataManager from "../../core/DataManager";
import DataStorage from "../../core/DataStorage";

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
export default class EnergyView extends View {

    @property(cc.Button)
    private energyBtn:cc.Button = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        /*this.energyBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            DataManager.instance.getPlayerData().addEnergy(5);
            DataManager.instance.savePlayerData();
            this.onCloseBtnClick(null);
         }, this);*/

         this.energyBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            DataManager.instance.getPlayerData().addEnergy(5);
            DataManager.instance.savePlayerData();
            this.onCloseBtnClick(null);

         });

         if(DataStorage.getIntItem("firstEnergy",0) == 0)
         {
             DataStorage.setItem("firstEnergy",1);
         }

    }

    public awake()
    {
        super.awake();
    }


    public sleep()
    {
        super.sleep();
    }

    // update (dt) {}
}
