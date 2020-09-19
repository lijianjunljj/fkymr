import DataStorage from "../core/DataStorage";
import CustomEventType from "../event/CustomEventType";

//import {number} from "../../jscript/number.js";

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
export default class EconomicManager extends cc.Component {


    private static _instance: EconomicManager;
    public static get instance(): EconomicManager {
        if(this._instance == null)
        {
            this._instance = new EconomicManager();
            this._instance.init();
        }
        return this._instance;
    }

    
    /**
     * 金币数
     */
    private _coin:number;
    public get coin(): number {
        return this._coin;
    }
    public set coin(value: number) {

        if(this._coin == value)
        {
            return;
        }

        this._coin = value;
        DataStorage.setItem("coin",this._coin.toString());
        cc.systemEvent.emit(CustomEventType.CoinChange);
    }

    /**
     * 钻石数
     */
    private _diamond: number = 0;
    public get diamond(): number {
        return this._diamond;
    }
    public set diamond(value: number) {

        if(this._diamond == value)
        {
            return;
        }

        this._diamond = value;
        DataStorage.setItem("diamond",this._diamond);
        cc.systemEvent.emit(CustomEventType.DiamondChange);
    }



    private init():void
    {
        this._coin = DataStorage.getIntItem("coin",0);
        this._diamond = DataStorage.getIntItem("diamond",0);

        //this.gold = 50000;
        //this.diamond = 10000;
        //this.coin = 10000000
    }

}
