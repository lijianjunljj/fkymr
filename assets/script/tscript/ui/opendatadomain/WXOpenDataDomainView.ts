
import OpenDataDomainView, { OpenDataDomainType } from "./OpenDataDomainView";

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
@ccclass
export default class WXOpenDataDomainView extends OpenDataDomainView {


    
    @property(cc.Sprite)
    protected openDataCanvasDisPlay: cc.Sprite = null;

    protected showOpenData: boolean = false;

    protected tex: cc.Texture2D = new cc.Texture2D();

    protected wxSubContext: cc.WXSubContextView = null;
    
    // LIFE-CYCLE CALLBACKS:


    
    onLoad () 
    {
        super.onLoad();


        if(window["wx"] && !window["tt"]) //如果是微信平台
        {
            this.wxSubContext = this.openDataCanvasDisPlay.getComponent(cc.WXSubContextView);
            this.wxSubContext.updateSubContextViewport();
    
            this.openDataCanvasDisPlay.node.active = true;
            this.updateOpenDataCanvas();
    
        }

        
    }

    start() {

        
    }

    public init(type:OpenDataDomainType)
    {

        switch(type)
        {
            case OpenDataDomainType.friend:

                this.onOpenFriendRank();
                
            break;

            case OpenDataDomainType.group:
            
                this.onOpenGroupRank();

            break;

            case OpenDataDomainType.world:

                this.onOpenWorldRank();
                
            break;
        }

    }

    protected onOpenFriendRank()
    {
        this.showOpenDataDomain();
    }

    protected onOpenGroupRank()
    {
        this.showOpenDataDomain();
    }

    protected onOpenWorldRank()
    {

    }

    update(dt) {

        if (this.showOpenData) {
            //this.updateOpenDataCanvas();
        }
    }

    updateOpenDataCanvas() {


    }

    /**
     * 显示开防数据域
     */
    public showOpenDataDomain() {

        if(!window["wx"]) //如果不是是微信平台
        {
            return;
        }

        this.openDataCanvasDisPlay.node.active = true;
 
        this.scheduleOnce(()=>
            {
                this.openDataCanvasDisPlay.getComponent(cc.WXSubContextView).updateSubContextViewport();
            },
        1);

        
        this.showOpenData = true;

        //this.wxSubContext.enabled = true;
        //(this.wxSubContext["update"] as Function)();
    }


    /**
     * 关闭开放数据域
     */
    public closeOpenDataDomain() {
        
        if(!window["wx"]) //如果不是是微信平台
        {
            return;
        }

        this.openDataCanvasDisPlay.node.active = false;
        this.showOpenData = false;

    }

    public awake()
    {
       
    }

    public sleep()
    {
        this.closeOpenDataDomain();
    }

}
