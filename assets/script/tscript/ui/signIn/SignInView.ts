import DataManager from "../../core/DataManager";
import CommonUils from "../../util/CommonUils";
import View from "../base/View";
import UIManager from "../UIManager";

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
export default class SignInView extends View {

    @property(cc.Node)
    signItems: cc.Node = null;

    @property(cc.Button)
    recieveBtn: cc.Button = null;

    @property(cc.Node)
    alreadyRecieve:cc.Node = null;

    private signList:any[] = [
        {award:"Coin",amount:100},
        {award:"Coin",amount:200},
        {award:"Coin",amount:500},
        {award:"Coin",amount:800},
        {award:"Coin",amount:1000},
        {award:"Coin",amount:2000},
        {award:"Coin",amount:3600},
    ];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.recieveBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
           this.onSignIn();
           this.recieveBtn.node.active = false;
           this.alreadyRecieve.active = true;
        }, this);

    }

    public awake()
    {
        
        this.getSignInData();

        //UIManager.instance.economicBar.energyBar.active = true;
        super.awake();
    }

    public sleep()
    {
        //UIManager.instance.economicBar.energyBar.active = false;
        super.sleep();
    }
    
    private getSignInData()
    {

        
        var signInDay:number = DataManager.instance.getPlayerData().signInDay;
        var todaySignInState:number = DataManager.instance.getPlayerData().signInStates[signInDay - 1]

        var canSignIn = false;

        if(todaySignInState == 0)
        {
            canSignIn = true;
        }else
        {
            canSignIn = false;
        }

        this.recieveBtn.node.active = canSignIn;
        this.alreadyRecieve.active = !canSignIn;



        for(var i = 1 ; i <= 7 ; i++)
        {
            var signItem:cc.Node = this.signItems.getChildByName("SignItem" + i);
            var dataItem:any = this.signList[i - 1];

            var amount:number = dataItem.amount;
     
            signItem.getChildByName("ValueTxt").getComponent(cc.Label).string = "×" + amount;


            if(i < signInDay)
            {
                signItem.getChildByName("Bg2").active = false;
                signItem.getChildByName("Recieve").active = true;
            }else if(i == signInDay)
            {
                if(canSignIn)
                {
                    signItem.getChildByName("Bg2").active = true;
                    signItem.getChildByName("Recieve").active = false;
                }else
                {
                    signItem.getChildByName("Bg2").active = false;
                    signItem.getChildByName("Recieve").active = true;
                }
            }else
            {
                signItem.getChildByName("Bg2").active = false;
                signItem.getChildByName("Recieve").active = false;
            }

        }
    }

    private onSignIn()
    {
        var rewardCoin:number = 0;

        var signInDay:number = DataManager.instance.getPlayerData().signInDay;

        var dataItem:any = this.signList[signInDay - 1];

        var rewardCoin:number = dataItem.amount;


        DataManager.instance.getPlayerData().signInStates[DataManager.instance.getPlayerData().signInDay - 1] = 1;

 
        DataManager.instance.savePlayerData();

        UIManager.instance.economicBar.playCoinAni(rewardCoin,CommonUils.getNodeWorldPos(this.recieveBtn.node));

        this.getSignInData();
    }

    // update (dt) {}
}
