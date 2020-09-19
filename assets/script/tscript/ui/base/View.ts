import UIManager from "../UIManager";

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

export default class View extends cc.Component {

    @property({displayName:"是否永久界面",tooltip:"勾选，关闭时会保存窗口对象，下次打开不用再创建，否在从内存删除，释放资源"})
    public persistent:boolean = true;

    /**
     * 是否已经被销毁
     */
    public isDestroy:boolean = false;

    onLoad () {

        var closeBtn = this.node.getChildByName("Win").getChildByName("CloseBtn");

        if(closeBtn)
        {
            closeBtn.on(cc.Node.EventType.TOUCH_END,this.onCloseBtnClick,this);
        }


        //this.awake();

    }

    protected onCloseBtnClick(event:cc.Event.EventTouch)
    {
        this.closeSelf(!this.persistent);
    }

    protected closeSelf(isDele:boolean = false)
    {
        if(!UIManager.instance.closeView(this.node.name,isDele))
        {
            this.close();
        }
    }

    /*start () {

    }*/

    // update (dt) {}

    /**
     * UI苏醒
     */
    public awake()
    {
        
    }

    /**
     * UI沉睡
     */
    public sleep()
    {

    }

    public open()
    {
        this.node.active = true;
        this.awake();
    }

    public close()
    {
        this.node.active = false;
        this.sleep();
    }

    public destroySelf()
    {
        this.node.destroy();
    }

    onDestroy()
    {
        this.isDestroy = true;
    }

}
