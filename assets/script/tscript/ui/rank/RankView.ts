
import RankItem from "./RankItem";
import UIManager from "../UIManager";
import WXOpenDataDomainView from "../opendatadomain/WXOpenDataDomainView";
import { OpenDataDomainType } from "../opendatadomain/OpenDataDomainView";
import SelectView from "../base/SelectView";
import TabButton from "../base/TabButton";

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
export default class RankView extends WXOpenDataDomainView {

    @property(TabButton)
    protected tabBtns:Array<TabButton> = [];

    @property(SelectView)
    protected selevtViews:Array<SelectView> = [];

    @property(cc.Node)
    protected showView:cc.Node = null;
    
    protected currentView:SelectView;


    @property(cc.Button)
    private leftBtn:cc.Button = null;

    @property(cc.Button)
    private rightBtn:cc.Button = null;

    @property(cc.Label)
    public pageTxt:cc.Label = null;

    private currentPage:number = 1;

    private totalPage:number = 1;

    @property(cc.Label)
    public myRankTxt:cc.Label = null;

    @property(cc.Label)
    public grTxt:cc.Label = null;
    

    @property(cc.Prefab)
    private rankItemPrefab:cc.Prefab = null;

    @property(cc.Button)
    lookGroupBtn: cc.Button = null;

    @property(cc.Button)
    challengeBtn: cc.Button = null;

    public rankItemArr:RankItem[] = []

    public dataArr:Array<any> = [];

    private rankData:any = {
        myRank:{},
        myRankLv:1,
        worldRanks:[]
    };

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        super.onLoad();

        for(var i = 0 ; i < this.tabBtns.length; i++)
        {
            this.tabBtns[i].node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>{
            },this);
            this.tabBtns[i].node.on(cc.Node.EventType.TOUCH_END,this.onTouchUp,this);
        }

        for(var i = 0 ; i < this.selevtViews.length; i++)
        {
            this.selevtViews[i].sleep();
        }

    }

    public start () {

        this.lookGroupBtn.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {

        },this);

        this.challengeBtn.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            this.closeSelf(this.persistent);
            UIManager.instance.mainUI.startBtn.node.dispatchEvent(new cc.Event(cc.Node.EventType.TOUCH_END,false));
        },this);


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

       
        //this.selectTab(0,true);

        cc.systemEvent.on("shareTicketUpdate",this.onShareTicketUpdate,this);

    }

    public selectTab(index:number = -1,force:boolean = false)
    {
        for(var i = 0 ; i < this.tabBtns.length; i++)
        {

            if(i != index )
            {
                if(this.tabBtns[i].selected)
                {
                    this.tabBtns[i].selected = false;
                }
                
            }else
            {
                if(force)
                {
                    this.tabBtns[i].selected = false;
                }

                if(!this.tabBtns[i].selected)
                {
                    this.tabBtns[i].selected = true;

                    if(this.currentView)
                    {
                        this.currentView.sleep();
                    }
    
                    this.currentView = this.selevtViews[i];
                    this.currentView.node.setParent(this.showView);
                    this.currentView.node.position = cc.Vec2.ZERO;
                    this.currentView.awake();

                }
                
            }
        }
    }

    private onTouchUp(event:cc.Event.EventTouch)
    {
        var btnNode:cc.Node = event.currentTarget as cc.Node;
        
        var index:number = this.tabBtns.indexOf(btnNode.getComponent(TabButton));

        this.selectTab(index);
    }

    onDestroy()
    {
        cc.systemEvent.off("shareTicketUpdate",this.onShareTicketUpdate,this);
    }

    private onShareTicketUpdate(event)
    {
        this.selectTab(0,true);
        this.init(OpenDataDomainType.group);
    }

    protected onOpenWorldRank()
    {
        this.closeOpenDataDomain();

        if(this.rankItemArr.length == 0)
        {
            for(var i = 0 ; i < 5 ; i ++)
            {
                var rankItem:RankItem = this.getRankItem();
                this.rankItemArr.push(rankItem);
                rankItem.node.active = false;
                rankItem.node.y = 125 + i * -63;
            }
        }

    }

    protected onOpenFriendRank()
    {
        super.onOpenFriendRank();
    }

    protected onOpenGroupRank()
    {
        super.onOpenGroupRank();

        this.grTxt.node.active = true;

        for(var i = 0 ; i < this.tabBtns.length; i++)
        {
            this.tabBtns[i].node.active = false;
        }
    }


    /*public showRank()
    {
       
        var len:number = this.dataArr.length;

        if(len > 100)
        {
            len = 100;
        }

        for(var i = 0 ; i < this.rankItemArr.length ; i++)
        {
            this.rankItemArr[i].node.active = false;
        }

        for(var i = 0 ; i < len ; i ++)
        {
            var rankItem:RankItem = this.rankItemArr[i];

            if(!rankItem)
            {
                rankItem = this.getRankItem();
                this.rankItemArr.push(rankItem);
            }

            rankItem.node.active = true;
            rankItem.node.y = 125 + i * -63;
            rankItem.setRankIcon(i + 1);
            rankItem.setData(i + 1,this.dataArr[i]);
           

        }

    }*/

    public showPage(page:number)
    {

        var pageLen:number = this.dataArr.length % this.rankItemArr.length
        if(pageLen == 0)
        {
            if(this.dataArr.length != 0)
            {
                pageLen = this.rankItemArr.length;
            }
        }

        var begin:number = (page - 1) * this.rankItemArr.length;
        var end:number = begin + pageLen;

        var index:number = 0;

        for(var i = begin ; i < begin + this.rankItemArr.length ; i++)
        {
            var rankItem:RankItem = this.rankItemArr[index];
            rankItem.setRankIcon(i + 1);

            if(i < this.dataArr.length)
            {
                rankItem.setData(i + 1,this.dataArr[i]);
                rankItem.node.active = true;
            }else
            {
                rankItem.node.active = false;
            }

            index ++;
        }


    }

    public getRankItem():RankItem
    {
        var node:cc.Node = cc.instantiate(this.rankItemPrefab);
        node.active = true;
        node.parent = this.selevtViews[1].node;
        node.position = cc.Vec2.ZERO;
        return node.getComponent(RankItem);
    }

    
    awake()
    {

        for(var i = 0 ; i < this.tabBtns.length; i++)
        {
            this.tabBtns[i].node.active = true;
        }

        this.grTxt.node.active = false;
        this.myRankTxt.string = "";

        this.selectTab(0,true);
        
        this.showOpenDataDomain();
        UIManager.instance.economicBar.close();
        super.awake();
    }
    

    public sleep()
    {
        UIManager.instance.economicBar.open();
        super.sleep();
    }

    
}
