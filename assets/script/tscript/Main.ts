
import DataManager from "./core/DataManager";
import GameManager from "./core/GameManager";
import SystemManager from "./system/SystemManager";
import UIManager, { ViewName } from "./ui/UIManager";

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
export default class Main extends cc.Component {

    public static alreadyPlay:boolean = false;

    @property(cc.Node)
    public canvas:cc.Node = null;

    private gameMagr:GameManager;
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.debug.setDisplayStats(false);
        
        this.gameMagr = this.canvas.getComponent<GameManager>(GameManager);
        UIManager.instance.mainUI.enabled = false;
        this.canvas.active = false;
        DataManager.instance.loadComfigDatas(this.onLoadComfigDatas);
       
   }
   
   private onLoadComfigDatas = ()=>
   {
 
        if(!Main.alreadyPlay)
        {
            Main.alreadyPlay = true;
            DataManager.instance.getPlayerData().playTimes ++; // 玩家每打开一次游戏统计一次
            DataManager.instance.savePlayerData();
        }

        SystemManager.instance.updatePlayerEnergy();

        UIManager.instance.mainUI.enabled = true;

        this.gameMagr.init();
        this.canvas.active = true;

   }

   start () {

    //cc.log("url ? ",cc.url.raw("image/role/1001.png"));

   }

   // update (dt) {}

    
}
