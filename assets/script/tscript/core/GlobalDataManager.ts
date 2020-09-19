import LevelConfigData from "../configdata/LevelConfigData";
import { GameMode } from "./GameManager";

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
 * 全局数据管理 跳场景传值用
 */
@ccclass
export default class GlobalDataManager extends cc.Component {

    private static _instance: GlobalDataManager;
    public static get instance(): GlobalDataManager {
        if(this._instance == null)
        {
            this._instance = new GlobalDataManager();
            this._instance.init();
        }
        return this._instance;
    }

    public myTryOutData:TryOutData = new TryOutData();

    public mode:GameMode = GameMode.mode1;
    public levelConfigData:LevelConfigData = null;


    private init()
    {
        
    }

}

export class TryOutData
{
    public roleId:number = 0;
    public weaponId:number = 0;
}
