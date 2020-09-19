
import DataManager from "../core/DataManager";

import DataStorage from "../core/DataStorage";
import { Input, KeyCode } from "../core/InputManager";
import Clock from "../util/Clock";
import Mathf from "../util/Mathf";



// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 系统管理 全局对象 用于做低层数据处理 生命周期一直存在
 */
@ccclass
export default class SystemManager extends cc.Component {


    private static _instance: SystemManager;
    public static get instance(): SystemManager {
        if (this._instance == null) {
            var node: cc.Node = new cc.Node("SystemManager");
            node.zIndex = 1000;
            cc.game.addPersistRootNode(node);
            this._instance = node.addComponent(SystemManager);
            this._instance.init();
        }
        return this._instance;
    }



    private init() {



    }

    onLoad() {
        cc.game.setFrameRate(60); //设置游戏帧率
    }

    start() {

        //this.updatePlayerEnergy();

    }

    /**
     * 启动系统管理
     */
    public startup() {
        console.log("SystemManager 启动系统管理");
    }

    private isUpdatePlayerEnergy:boolean = false;

    public updatePlayerEnergy()
    {
        if(this.isUpdatePlayerEnergy)
            return;

        this.isUpdatePlayerEnergy = true;

        var lastPlayTime:number = DataStorage.getIntItem("lastClockTime",Date.now());
        var nowPlayTime:number = Date.now();
        var difTime = Math.floor((nowPlayTime - lastPlayTime) / 1000); //离线时间

        var node:cc.Node = new cc.Node("Clock");
        var clock:Clock = node.addComponent(Clock);
        clock.hms = 2;

        var recoverTimer:number = 10 * 60;
    
        if(difTime > 0)
        {
            var recoverEnergy:number = Math.floor(difTime / recoverTimer);
            DataManager.instance.getPlayerData().addEnergy(recoverEnergy);
            DataManager.instance.savePlayerData();
            clock.timeLength = (recoverTimer + 1) - difTime % (recoverTimer + 1);
        }else
        {
            clock.timeLength = -difTime;
        }
        
        clock.timeLength = Mathf.clamp(clock.timeLength,0,recoverTimer + 1);
        DataStorage.setItem("lastClockTime",Date.now() + clock.timeLength * 1000);

        var runClock:Function = ()=>
        {
            clock.Stop();
            clock.Reset();
            clock.Play((s,m,h,str,t)=>
            {
                cc.systemEvent.emit("energyRecoverCD",s,m,h,str,t);
                //DataStorage.setItem("lastPlayTime",Date.now()); //上一次完游戏的时间
            },()=>
            {
                DataManager.instance.getPlayerData().addEnergy(1);
                DataManager.instance.savePlayerData();
                clock.timeLength = recoverTimer + 1;
                DataStorage.setItem("lastClockTime",Date.now() + clock.timeLength * 1000);
                runClock();
            });
        }

        runClock();
        
        /*this.schedule((dt)=>
        {
            DataStorage.setItem("lastPlayTime",Date.now());
        },1);*/
    }

    update(dt) {
        

        //if(CC_EDITOR || CC_PREVIEW)
        {
            if (Input.getKeyDown(KeyCode.E)) {
                //按下e键时触发
                if(cc.director.getScene().name != "editor")
                {
                    cc.director.loadScene("editor");
                }
            }
        }

    }
}


if (!CC_EDITOR) {
    SystemManager.instance.startup();//启动输入管理
}