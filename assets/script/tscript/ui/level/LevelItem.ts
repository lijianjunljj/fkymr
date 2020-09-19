import ResourcesPool, { Recycle } from "../../core/ResourcesPool";
import LevelConfigData from "../../configdata/LevelConfigData";
import DataManager from "../../core/DataManager";
import LevelView from "./LevelView";

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
export default class LevelItem extends cc.Component implements Recycle {


    @property(cc.Node)
    starArr: cc.Node[] = [];

    @property(cc.Label)
    levelTxt: cc.Label = null;

    public callback:Function = null;

    public levelConfigData:LevelConfigData = null;

    public locked:boolean = false;

    public levelView:LevelView = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>
        {
            this.callback && this.callback(this);
        },this);

    }

    public init(levelId:number)
    {

        this.levelConfigData = DataManager.instance.getLevelConfigDatas(this.levelView.mode)[levelId - 1];
        this.levelTxt.string = "" + levelId;

        this.setStar(DataManager.instance.getPlayerData().getLevelState(this.levelView.mode,levelId));

        if(levelId <= DataManager.instance.getPlayerData().getLevelConfigData(this.levelView.mode).id)
        {
            this.locked = false;

            for(var i = 0 ; i < this.starArr.length ; i++)
            {
                this.starArr[i].active = true;
            }

            var color:cc.Color = this.levelTxt.node.color.fromHEX("#6F1413");

            this.levelTxt.node.color = color;
            this.levelTxt.getComponent(cc.LabelOutline).color = color;

            this.node.getChildByName("Bg").active = true;
            this.node.getChildByName("Bg2").active = false;

        }else
        {
            this.locked = true;

            for(var i = 0 ; i < this.starArr.length ; i++)
            {
                this.starArr[i].active = false;
            }
            
            var color:cc.Color = this.levelTxt.node.color.fromHEX("#68451F");

            this.levelTxt.node.color = color;
            this.levelTxt.getComponent(cc.LabelOutline).color = color;

            this.node.getChildByName("Bg").active = false;
            this.node.getChildByName("Bg2").active = true;

        }

    }

    private setStar(value:number)
    {
        for(var i = 0 ; i < this.starArr.length ; i++)
        {
            if(i < value)
            {
                this.starArr[i].getChildByName("Star").active = true;
            }else
            {
                this.starArr[i].getChildByName("Star").active = false;
            }
        }
    }

    // update (dt) {}

    public getKey():string
    {
        return "LevelItem";
    }

    public awake()
    {
        this.node.active = true;
        this.node.angle = 0;
        this.node.position = cc.Vec2.ZERO;
        this.node.color = cc.Color.WHITE;
        this.node.opacity = 255;
        this.node.scale = 1;
    }
    public sleep()
    {
        this.node.stopAllActions();
        this.node.parent = null;
        this.levelView = null;
        this.node.active = false;
    }

    public destroySelf()
    {
        ResourcesPool.instance.put(this,15);
    }
}
