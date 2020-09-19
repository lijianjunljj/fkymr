
import ResourcesManager from "./ResourcesManager";
import DataStorage from "./DataStorage";
import PlayerData from "../data/PlayerData";

import LevelConfigData from "../configdata/LevelConfigData";
import CustomEventType from "../event/CustomEventType";
import ItemConfigData from "../configdata/ItemConfigData";

import SceneConfigData from "../configdata/SceneConfigData";
import { GameMode } from "./GameManager";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DataManager extends cc.Component {

    private static _instance: DataManager;
    public static get instance(): DataManager {
        if (this._instance == null) {
            this._instance = new DataManager();
            this._instance.init();
        }
        return DataManager._instance;
    }

    /**
     * 玩家数据
     */
    private _playerData: PlayerData = null;

    /**
     * 宝箱数据
    */
    //private _boxData: BoxData = null;

    private _levelConfigDatas: LevelConfigData[] = null;
    public get levelConfigDatas(): LevelConfigData[] {
        return this._levelConfigDatas;
    }
    private _levelConfigDataDic: { [key: number]: LevelConfigData } = {};
    private _levelConfigDataArr: { [key: number]: LevelConfigData[] } = [];

    private _levelConfigDatas2: LevelConfigData[] = null;
    public get levelConfigDatas2(): LevelConfigData[] {
        return this._levelConfigDatas2;
    }
    private _levelConfigDataDic2: { [key: number]: LevelConfigData } = {};
    private _levelConfigDataArr2: { [key: number]: LevelConfigData[] } = [];

    private _levelConfigDatas3: LevelConfigData[] = null;
    public get levelConfigDatas3(): LevelConfigData[] {
        return this._levelConfigDatas3;
    }
    private _levelConfigDataDic3: { [key: number]: LevelConfigData } = {};
    private _levelConfigDataArr3: { [key: number]: LevelConfigData[] } = [];

    private _levelConfigDatas4: LevelConfigData[] = null;
    public get levelConfigDatas4(): LevelConfigData[] {
        return this._levelConfigDatas4;
    }
    private _levelConfigDataDic4: { [key: number]: LevelConfigData } = {};
    private _levelConfigDataArr4: { [key: number]: LevelConfigData[] } = [];


    private _sceneConfigData: SceneConfigData = null;
    public get sceneConfigData(): SceneConfigData {
        return this._sceneConfigData;
    }
    public set sceneConfigData(value: SceneConfigData) {
        this._sceneConfigData = value;
    }

    private _sceneConfigData2: SceneConfigData = null;
    public get sceneConfigData2(): SceneConfigData {
        return this._sceneConfigData2;
    }
    public set sceneConfigData2(value: SceneConfigData) {
        this._sceneConfigData2 = value;
    }

    private _sceneConfigData3: SceneConfigData = null;
    public get sceneConfigData3(): SceneConfigData {
        return this._sceneConfigData3;
    }
    public set sceneConfigData3(value: SceneConfigData) {
        this._sceneConfigData3 = value;
    }

    private _sceneConfigData4: SceneConfigData = null;
    public get sceneConfigData4(): SceneConfigData {
        return this._sceneConfigData4;
    }
    public set sceneConfigData4(value: SceneConfigData) {
        this._sceneConfigData4 = value;
    }

    private _itemConfigDatas: ItemConfigData[] = null;
    public get itemConfigDatas(): ItemConfigData[] {
        return this._itemConfigDatas;
    }

    private _itemConfigDataDic: { [key: number]: ItemConfigData } = [];

    private _itemConfigDataArr: { [key: number]: ItemConfigData[] } = [];

    private _isJosnLoaded = false;

    private init() {
        /**发布版本一点要删除 */

        //DataStorage.removeItem("playerData");
        //DataStorage.removeItem("levelData");
        //DataStorage.removeItem("day");

    }

    //加载配置数据
    public loadComfigDatas(callback: Function) {
        if (this._isJosnLoaded) {
            callback();
            return;
        }

        var jsonArr = ["ItemConfigTable", "LevelConfigTable","LevelConfigTable2","LevelConfigTable3","LevelConfigTable4",
        "SceneConfigTable","SceneConfigTable2","SceneConfigTable3","SceneConfigTable4"];

        var resMgr = ResourcesManager.instance;

        resMgr.loadJson("ItemConfigTable", (data, jsonName) => { this._itemConfigDatas = data; removeJsonitem(jsonName); });
        resMgr.loadJson("LevelConfigTable", (data, jsonName) => { this._levelConfigDatas = data; removeJsonitem(jsonName); });
        resMgr.loadJson("LevelConfigTable2", (data, jsonName) => { this._levelConfigDatas2 = data; removeJsonitem(jsonName); });
        resMgr.loadJson("LevelConfigTable3", (data, jsonName) => { this._levelConfigDatas3 = data; removeJsonitem(jsonName); });
        resMgr.loadJson("LevelConfigTable4", (data, jsonName) => { this._levelConfigDatas4 = data; removeJsonitem(jsonName); });
        resMgr.loadJson("SceneConfigTable", (data, jsonName) => { this._sceneConfigData = data; removeJsonitem(jsonName); });
        resMgr.loadJson("SceneConfigTable2", (data, jsonName) => { this._sceneConfigData2 = data; removeJsonitem(jsonName); });
        resMgr.loadJson("SceneConfigTable3", (data, jsonName) => { this._sceneConfigData3 = data; removeJsonitem(jsonName); });
        resMgr.loadJson("SceneConfigTable4", (data, jsonName) => { this._sceneConfigData4 = data; removeJsonitem(jsonName); });

        this.schedule(wait, 0.02);
        var self = this;


        function wait() {
            if (jsonArr.length == 0) {
                this.onConfigDataLoadComp();
                callback();
                self.unschedule(wait);
                self._isJosnLoaded = true;
            }
        }

        function removeJsonitem(item: string) {
            var index = jsonArr.indexOf(item);
            if (index >= 0) {
                jsonArr.splice(index, 1);
            }
        }
    }

    private onConfigDataLoadComp() {
        var len: number = this._itemConfigDatas.length;

        for (var i = 0; i < len; i++) {
            var itemConfigData: ItemConfigData = this._itemConfigDatas[i];
            this._itemConfigDataDic[itemConfigData.itemId] = itemConfigData;

            if (!this._itemConfigDataArr[itemConfigData.type]) {
                this._itemConfigDataArr[itemConfigData.type] = [];
            }

            this._itemConfigDataArr[itemConfigData.type].push(itemConfigData);

        }

        len = this._levelConfigDatas.length;

        for (var i = 0; i < len; i++) {
            var levelConfigData: LevelConfigData = this._levelConfigDatas[i];
            this._levelConfigDataDic[levelConfigData.level_max + "_" + levelConfigData.level_min] = levelConfigData;
            

            if (!this._levelConfigDataArr[levelConfigData.level_max]) {
                this._levelConfigDataArr[levelConfigData.level_max] = [];
            }

            this._levelConfigDataArr[levelConfigData.level_max].push(levelConfigData);
        }


        len = this._levelConfigDatas2.length;

        for (var i = 0; i < len; i++) {
            var levelConfigData: LevelConfigData = this._levelConfigDatas2[i];
            this._levelConfigDataDic2[levelConfigData.level_max + "_" + levelConfigData.level_min] = levelConfigData;
            
            if (!this._levelConfigDataArr2[levelConfigData.level_max]) {
                this._levelConfigDataArr2[levelConfigData.level_max] = [];
            }

            this._levelConfigDataArr2[levelConfigData.level_max].push(levelConfigData);
        }


        len = this._levelConfigDatas3.length;

        for (var i = 0; i < len; i++) {
            var levelConfigData: LevelConfigData = this._levelConfigDatas3[i];
            this._levelConfigDataDic3[levelConfigData.level_max + "_" + levelConfigData.level_min] = levelConfigData;
            
            if (!this._levelConfigDataArr3[levelConfigData.level_max]) {
                this._levelConfigDataArr3[levelConfigData.level_max] = [];
            }

            this._levelConfigDataArr3[levelConfigData.level_max].push(levelConfigData);
        }

        len = this._levelConfigDatas4.length;

        for (var i = 0; i < len; i++) {
            var levelConfigData: LevelConfigData = this._levelConfigDatas4[i];
            this._levelConfigDataDic4[levelConfigData.level_max + "_" + levelConfigData.level_min] = levelConfigData;
            
            if (!this._levelConfigDataArr4[levelConfigData.level_max]) {
                this._levelConfigDataArr4[levelConfigData.level_max] = [];
            }

            this._levelConfigDataArr4[levelConfigData.level_max].push(levelConfigData);
        }

        this.updateDataEveryDay();
    }


    private updateDataEveryDay() {
        //DataStorage.setItem("day","2018/11/22");

        var yesterday: Date = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        var lastDay: string = DataStorage.getItem("day", this.getLocaleDateString(yesterday));

        //cc.log("上次登录时间",lastDay,DataStorage.getItem("day","没存储"));
        //var date1:Date = new Date("2018/11/15 00:00:00");
        var lastDate: Date = new Date(lastDay); //上一次的日期

        var nowDate: Date = new Date(this.getLocaleDateString(new Date())); //现在的日期

        var dateDifc = (nowDate.getTime() - lastDate.getTime()) / 86400000;

        //cc.log("dateDifc",dateDifc,this.getLocaleDateString(nowDate),this.getLocaleDateString(new Date()),this.getSignInData().lastLoginDay);

        var checkTimer = function (dt) {
            nowDate = new Date();

            if (nowDate.getHours() >= 0)//每天凌晨0点钟刷新数据
            {
                console.log("新的一天到了");
                /*DataManager.instance.getPlayerData().IsTaskPoolOne = false //更新任务池
                DataManager.instance.getPlayerData().IsTaskPoolTwo = false
                DataManager.instance.getPlayerData().CurOneTaskPoolId = []
                DataManager.instance.getPlayerData().CurTwoTaskPoolId = []*/


                this.getPlayerData().logindays++;
                this.getPlayerData().lotteryTimes = 0; //每天重置抽奖次数

                
                if(this.getPlayerData().signInStates[this.getPlayerData().signInDay - 1] == 1)
                {
                    if(this.getPlayerData().signInDay < 7)
                    {
                        this.getPlayerData().signInDay ++;
                    }
                }

                this.getPlayerData().reset();
                this.savePlayerData();

                this.unschedule(checkTimer);

                DataStorage.setItem("day", this.getLocaleDateString(nowDate));

                cc.systemEvent.emit(CustomEventType.NewDay);



            }

        }.bind(this);

        //this.scheduleOnce(checkTimer,1.25);//首次快速更新一下
  
        if (dateDifc >= 1)//如果是新的一天
        {
            this.schedule(checkTimer, 5);
            checkTimer(0);

        } else if (dateDifc < 0) {
            //cc.log("用户手动调了系统时间");
            //this.schedule(checkTimer,5);
            //checkTimer(0);
            DataStorage.setItem("day", this.getLocaleDateString(nowDate));//重新存储当前时间
        }
    }

    public getLocaleDateString(date: Date): string {
        //"2018/11/22"
        var year: string = date.getFullYear().toString();
        var mon: number = date.getMonth() + 1;
        var month: string = mon < 10 ? "0" + mon : mon.toString();
        var day: string = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();

        return year + "/" + month + "/" + day;

    }
    
    /*public getBoxData():BoxData{
        if (this._boxData == null) {
            this._boxData = new BoxData();
            // this._boxData.init();
            var localData: BoxData = JSON.parse(DataStorage.getItem("BoxData"));

            if (localData) {
                for (var key in localData) {
                    if (typeof this._boxData[key] != "undefined") {
                        this._boxData[key] = localData[key];
                    }
                }
            }
        }

        return this._boxData;
    }
    public saveBoxData(): void {
        DataStorage.setItem("BoxData", JSON.stringify(this._boxData));
    }*/


    public getPlayerData(): PlayerData {
        if (this._playerData == null) {
            this._playerData = new PlayerData();
            this._playerData.init();
            var localData: PlayerData = JSON.parse(DataStorage.getItem("playerData"));

            if (localData) {
                for (var key in localData) {
                    if (typeof this._playerData[key] != "undefined") {
                        this._playerData[key] = localData[key];
                    }
                }
            }

        }

        return this._playerData;
    }

    public savePlayerData(): void {
        DataStorage.setItem("playerData", JSON.stringify(this._playerData));
    }

    public getLevelConfigData(mode:GameMode,level_max: number,level_min:number): LevelConfigData {

        return this.getLevelConfigDataDic(mode)[level_max + "_" + level_min];
    }

    public getLevelMaxConfigDataArr(mode:GameMode,max_id:number):LevelConfigData[]
    {
        return this.getLevelConfigDataArr(mode)[max_id];
    }

    public getMaxLevelLenght(mode:GameMode):number
    {
        return this.getLevelConfigDataArr(mode)["length"] - 1;
    }

    
    public getLevelConfigDatas(mode:GameMode):LevelConfigData[]
    {
        if(mode == GameMode.mode1)
        {
            return this.levelConfigDatas;
        }else if(mode == GameMode.mode2)
        {
            return this.levelConfigDatas2;
        }else if(mode == GameMode.mode3)
        {
            return this.levelConfigDatas3;
        }else if(mode == GameMode.mode4)
        {
            return this.levelConfigDatas4;
        }
        
        return null;
    }

    public getLevelConfigDataArr(mode:GameMode):{ [key: number]: LevelConfigData[] }
    {
        if(mode == GameMode.mode1)
        {
            return this._levelConfigDataArr;
        }else if(mode == GameMode.mode2)
        {
            return this._levelConfigDataArr2;
        }else if(mode == GameMode.mode3)
        {
            return this._levelConfigDataArr3;
        }else if(mode == GameMode.mode4)
        {
            return this._levelConfigDataArr4;
        }
        
        return null;
    }

    public getLevelConfigDataDic(mode:GameMode):{ [key: number]: LevelConfigData }
    {
        if(mode == GameMode.mode1)
        {
            return this._levelConfigDataDic;
        }else if(mode == GameMode.mode2)
        {
            return this._levelConfigDataDic2;
        }else if(mode == GameMode.mode3)
        {
            return this._levelConfigDataDic3;
        }else if(mode == GameMode.mode4)
        {
            return this._levelConfigDataDic4;
        }
        
        return null;
    }

    public getSceneConfigData(mode:GameMode):SceneConfigData
    {
        if(mode == GameMode.mode1)
        {
            return this.sceneConfigData;
        }else if(mode == GameMode.mode2)
        {
            return this.sceneConfigData2;
        }else if(mode == GameMode.mode3)
        {
            return this.sceneConfigData3;
        }else if(mode == GameMode.mode4)
        {
            return this.sceneConfigData4;
        }
        return null;
    }


    public getItemConfigData(id: number): ItemConfigData {
        if (id <= 0)
            return null;
        return this._itemConfigDatas[id - 1];
    }

    public getItemConfigDataByItemId(id: number): ItemConfigData {
        if (id <= 0)
            return null;
        return this._itemConfigDataDic[id];
    }

    public getItemConfigDataArr(type: number): ItemConfigData[] {
        return this._itemConfigDataArr[type];
    }

    // update (dt) {}
}

