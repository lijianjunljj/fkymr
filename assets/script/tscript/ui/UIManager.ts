import View from "./base/View";
import MainUI from "./main/MainUI";
import GameUI from "./main/GameUI";
import EconomicBar from "./toolbar/EconomicBar";


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

/**
 * 摊开管理类
 */
@ccclass
export default class UIManager extends cc.Component {

    private static _instance: UIManager;
    
    public static get instance(): UIManager {
        /*if(this._instance == null)
        {
            this._instance = new UIManager();
            this._instance.init();
        }*/
        return UIManager._instance;
    }
    
    private static viewDic:{[key:string]:View} = {};

    @property(cc.Node)
    private viewLayers:Array<cc.Node> = [];

    @property(EconomicBar)
    public economicBar:EconomicBar = null;

    @property(MainUI)
    public mainUI:MainUI = null;

    @property(GameUI)
    public gameUI:GameUI = null;

    constructor()
    {
        super();
        UIManager._instance = this;
        //cc.log("uimanager constructor");
    }

    onLoad()
    {
        UIManager._instance = this;
        UIManager._instance.init();
    }

    private init()
    {
    }

    start()
    {

    }

    /*update(dt)
    {
  
    }*/



    /**
     * 打开一个界面
     * @param viewName 
     * @param callback 
     * @param layerType 
     * @param root 
     */
    public OpenView(viewName:string,callback:Function = null,layerType:LayerType = LayerType.popup,root:string = "prefab/view/")
    {
        var path = root + viewName;

        if(UIManager.viewDic[viewName])
        {
            if(!UIManager.viewDic[viewName].isDestroy)
            {
                var view:View = UIManager.viewDic[viewName];
                view.node.setParent(null);
                this.viewLayers[layerType].addChild(view.node);
                view.node.position = cc.Vec2.ZERO;
                view.open();
    
                if(callback)
                {
                    callback.apply(this,[UIManager.viewDic[viewName]]);
                }
                return;
            }else
            {
                UIManager.viewDic[viewName] = null;
                delete UIManager.viewDic[viewName];
            }
            
        }

        cc.loader.loadRes(path,cc.Prefab,(err,prefab)=>{

            if(!err)
            {
                if(UIManager.viewDic[viewName])
                {
                    //防止同时生成多个相同窗口
                    return;
                }

                var node:cc.Node = cc.instantiate(prefab);
                var view:View = node.getComponent(View);
                //view.node.setParent(this.viewLayers[layerType]);
                view.node.setParent(null);
                this.viewLayers[layerType].addChild(view.node);
                view.node.position = cc.Vec2.ZERO;
                view.open();
                cc.log("加载到的资源",prefab,view.name);
                UIManager.viewDic[viewName] = view;
                if(callback != null)
                {
                    callback.apply(this,[view]);
                }
                
            }else
            {
                cc.log("路径" + path + "找不到资源");
            }

        })
    }

    /**
     * 关闭一个界面
     * @param viewName 
     * @param isDele 
     */
    public closeView(viewName:string,isDele:boolean = true):boolean
    {
        if(UIManager.viewDic[viewName])
        {
            UIManager.viewDic[viewName].close();
            UIManager.viewDic[viewName].node.setParent(null);
            if(isDele)
            {
                UIManager.viewDic[viewName].destroySelf();
                UIManager.viewDic[viewName] = null;
                delete UIManager.viewDic[viewName];
            }
            return true;
        }

        return false;
        
    }

    public getLayer(layerType:LayerType):cc.Node
    {
        return this.viewLayers[layerType];
    }

    /**
     * 是否有View窗口弹出
     */
    public hasViewShow():boolean
    {

        for(var i = 0 ; i < this.viewLayers.length ; i++)
        {
            if(this.viewLayers[i].childrenCount > 0)
            {
                return true;
            }
        }

        return false;
    }

}

export class ViewName
{

    public static AccountView = "AccountView";
    public static RankView = "RankView";
    public static OpenDataDomainView = "OpenDataDomainView";
    public static TryOutView = "TryOutView";
    public static TaskView = "TaskView";
    public static EnergyView = "EnergyView";
    public static LevelView = "LevelView";
    public static PassView = "PassView";
    public static MallView = "MallView";
    public static SignInView = "SignInView";
    public static InviteView = "InviteView";
    public static TeachView = "TeachView";
    

}

export enum LayerType
{
    back = 0,
    popup = 1,
}


