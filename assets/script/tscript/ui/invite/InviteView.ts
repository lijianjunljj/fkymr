import View from "../base/View";
import UIManager from "../UIManager";
import InviteItem from "./InviteItem";
import Httputils from "../../net/Httputils";

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
export default class InviteView extends View {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property(cc.Prefab)
    inviteItemPrefab:cc.Prefab = null;

    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;

    @property(cc.Node)
    content:cc.Node = null;

    @property(cc.Button)
    inviteBtn: cc.Button = null;

    public dataArr:Array<any> = [
        {energer:15},
        {energer:15},
        {energer:15},
        {energer:15},
        {energer:15},  
    ];

    public inviteItemArr:InviteItem[] = []

    start () {

        this.inviteBtn.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            
        },this);

    }

    public initList()
    {
        //var len:number = this.dataArr.length;
        var len = 5;

        for(var i = 0 ; i < this.inviteItemArr.length ; i++)
        {
            this.inviteItemArr[i].node.active = false;
        }

        for(var i = 0 ; i < len ; i ++)
        {
            var inviteItem:InviteItem = this.inviteItemArr[i];

            if(!inviteItem)
            {
                inviteItem = this.getInviteItem();
                this.inviteItemArr.push(inviteItem);
            }

            inviteItem.node.y =  -i *  110 + -50;
            inviteItem.setData(i + 1,this.dataArr[i]);
        }

        this.content.height = i * 110 + 0;

        if(this.content.height < 580)
        {
            this.content.height = 580;
        }
        
        this.scrollView.scrollToTop(0);
    }

    public getInviteItem():InviteItem
    {
        var node:cc.Node = cc.instantiate(this.inviteItemPrefab);
        node.active = true;
        node.parent = this.content;
        node.position = cc.Vec2.ZERO;
        return node.getComponent(InviteItem);
    }

    // update (dt) {}

    public awake()
    {
        //UIManager.instance.economicBar.energyBar.active = true;
        super.awake();
    }

    public sleep()
    {
        //UIManager.instance.economicBar.energyBar.active = false;
        super.sleep();
    }
}
