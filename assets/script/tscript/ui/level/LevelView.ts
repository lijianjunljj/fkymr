import View from "../base/View";
import LevelItem from "./LevelItem";
import GameManager, { GameMode } from "../../core/GameManager";
import GlobalDataManager from "../../core/GlobalDataManager";
import DataManager from "../../core/DataManager";
import Loading from "../../Loading";
import LevelConfigData from "../../configdata/LevelConfigData";
import UIManager, { ViewName } from "../UIManager";

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
export default class LevelView extends View {

    @property(cc.Node)
    private content:cc.Node = null;
    
    @property(cc.Button)
    private leftBtn:cc.Button = null;

    @property(cc.Button)
    private rightBtn:cc.Button = null;

    @property(cc.Label)
    private titleTxt:cc.Label = null;

    @property(cc.Label)
    private pageTxt:cc.Label = null;

    @property(cc.Button)
    startBtn: cc.Button = null;

    private currentPage:number = 1;

    private totalPage:number = 10;


    private levelItemArr:LevelItem[] = [];


    public mode:GameMode = GameMode.mode1;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.leftBtn.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            
            this.currentPage --;
            if(this.currentPage < 1)
            {
                this.currentPage = 1;
            }

            this.pageTxt.string = this.currentPage + "/" + this.totalPage;

            this.showPage(this.currentPage);

        },this);

        this.rightBtn.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            
            this.currentPage ++;
            if(this.currentPage > this.totalPage)
            {
                this.currentPage = this.totalPage;
            }

            this.pageTxt.string = this.currentPage + "/" + this.totalPage;

            this.showPage(this.currentPage);
        },this);

        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            this.closeSelf(!this.persistent);
            GlobalDataManager.instance.mode = this.mode;
            GlobalDataManager.instance.levelConfigData = DataManager.instance.getPlayerData().getLevelConfigData(this.mode);
            Loading.loadScene("game_single");

        }, this);

    }



    public showPage(page:number)
    {

        this.clear();

        var levelcnfdatas:LevelConfigData[] = DataManager.instance.getLevelMaxConfigDataArr(this.mode,page);

        var len:number = levelcnfdatas.length;

        for(var i = 0 ; i < len ; i++)
        {
            let levelItem:LevelItem = GameManager.instance.getLevelItem();
            levelItem.node.parent = this.content;
            levelItem.levelView = this;
            levelItem.node.x = -230 +  (i % 5) * 115;
            levelItem.node.y = 40 -  Math.floor(i / 5) * 133;
            levelItem.init(levelcnfdatas[i].id);
            levelItem.callback = (litem:LevelItem)=>
            {
                this.onSelectedLevelItem(litem);
            };

            this.levelItemArr.push(levelItem);
        }

    }

    private onSelectedLevelItem(levelItem:LevelItem)
    {
        if(levelItem.locked)
        {
            return;
        }

        if(DataManager.instance.getPlayerData().energy <= 0)
        {
            UIManager.instance.OpenView(ViewName.EnergyView);
            return;
        }


        this.closeSelf(!this.persistent);
        GlobalDataManager.instance.mode = this.mode;
        GlobalDataManager.instance.levelConfigData = levelItem.levelConfigData;
        Loading.loadScene("game_single");

    }

    private clear()
    {
        for(var i = 0 ; i < this.levelItemArr.length ; i++)
        {
            this.levelItemArr[i].destroySelf();
        }

        this.levelItemArr.length = 0;
    }


    public init(mode:GameMode)
    {
        if(this.mode != mode)
        {
            this.currentPage = 1;
        }

        this.mode = mode;

        this.totalPage = DataManager.instance.getMaxLevelLenght(this.mode);
        this.pageTxt.string = this.currentPage + "/" + this.totalPage;
        this.showPage(this.currentPage);
        
        var currentLevelId = DataManager.instance.getPlayerData().getLevelConfigData(this.mode).id;

        var levelConfigDatas:LevelConfigData[] = DataManager.instance.getLevelConfigDatas(this.mode);

        var lastLevelId = levelConfigDatas[levelConfigDatas.length - 1].id;
        this.titleTxt.string = `${currentLevelId}/${lastLevelId}`;
    }


    awake()
    {
        

        //UIManager.instance.economicBar.energyBar.active = true;

        super.awake();
    }
    

    public sleep()
    {
        this.clear();
        super.sleep();

        //UIManager.instance.economicBar.energyBar.active = false;
    }

    // update (dt) {}
}
