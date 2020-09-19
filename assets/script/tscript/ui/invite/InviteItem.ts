import Httputils from "../../net/Httputils";
import DataManager from "../../core/DataManager";

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
export default class InviteItem extends cc.Component {

    @property(cc.Label)
    numTxt: cc.Label = null;

    @property(cc.Label)
    enegerTxt: cc.Label = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Node)
    areadyRec: cc.Node = null;

    @property(cc.Node)
    notInvite: cc.Node = null;

    @property(cc.Button)
    receiveBtn: cc.Button = null;

    @property(cc.SpriteFrame)
    rewardSkin: cc.SpriteFrame[] = [];

    data:any = null;

    private energy:number = 5

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.receiveBtn.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {

        },this);

    }

    // update (dt) {}

    public setData(rankId:number,data:any)
    {
        this.data = data;

        
        this.numTxt.string = "" + rankId;
        this.enegerTxt.string = "" + this.energy;

        if(this.data)
        {
            this.icon.spriteFrame = this.rewardSkin[1];
            this.notInvite.active = false;
            if(data.isRecv)
            {
                this.areadyRec.active = true;
                this.receiveBtn.node.active = false;
            }else
            {
                this.areadyRec.active = false;
                this.receiveBtn.node.active = true;
            }
        }else
        {
            this.areadyRec.active = false;
            this.receiveBtn.node.active = false;
            this.notInvite.active = true;
        }

        
    }
}
