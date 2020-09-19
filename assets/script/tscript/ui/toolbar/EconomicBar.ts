import EconomicManager from "../../core/EconomicManager";
import CustomEventType from "../../event/CustomEventType";
import Coin from "./Coin";
import GameManager from "../../core/GameManager";
import Random from "../../util/Random";

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
export default class EconomicBar extends cc.Component {

    @property(cc.Node)
    coinIcon: cc.Node = null;

    @property(cc.Label)
    coinTxt: cc.Label = null;

    @property(cc.Node)
    energyBar: cc.Node = null;

    private _coin: number = 0;
    public get coin(): number {
        return this._coin;
    }
    public set coin(value: number) {

        this._coin = Math.floor(value);

        if(this.coinTxt && this.coinTxt.isValid)
        {
            this.coinTxt.string = this._coin.toString();
        }
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        /*this.addCoinBtn.node.on(cc.Node.EventType.TOUCH_START,(event)=>{

        },this);

        this.addGoldBtn.node.on(cc.Node.EventType.TOUCH_START,(event)=>{

        },this);

        this.addDiamondBtn.node.on(cc.Node.EventType.TOUCH_START,(event)=>{

        },this);*/

        this.coin = EconomicManager.instance.coin;
      
        cc.systemEvent.on(CustomEventType.CoinChange,this.onCoinChange,this);
        //cc.systemEvent.on(CustomEventType.GoldChange,this.onGoldChange,this);
        //cc.systemEvent.on(CustomEventType.DiamondChange,this.onDiamondChange,this);

    }

    // update (dt) {}

    onDestroy()
    {
        cc.systemEvent.off(CustomEventType.CoinChange,this.onCoinChange,this);
        //cc.systemEvent.off(CustomEventType.GoldChange,this.onGoldChange,this);
        //cc.systemEvent.off(CustomEventType.DiamondChange,this.onDiamondChange,this);
    }


    private onCoinChange(event:cc.Event.EventCustom)
    {
        var dcoin:number = Math.abs(EconomicManager.instance.coin - this.coin);

        if(dcoin == 0)
        {
            //this.coinTxt.string = EconomicManager.instance.coin.toString();
            this.coin = EconomicManager.instance.coin;
        }else
        {
            //this.coinTxt.string = EconomicManager.instance.coin.toString();

            var t:number =  dcoin / 1000;
            t = t > 1.5 ? 1.5 : t;

            cc["tween"](this).to(t, { coin: EconomicManager.instance.coin}).call(() => 
            {
                //cc.log("缓动动画结束");
            }).start();

        }
        
    }

    /*private onGoldChange(event:cc.Event.EventCustom)
    {
        this.goldValueTxt.string = EconomicManager.instance.gold.toString();
    }

    private onDiamondChange(event:cc.Event.EventCustom)
    {
        this.diamondValueTxt.string = EconomicManager.instance.diamond.toString();
    }*/

    

    /**
     * 播放获得金币动画
     * @param value 
     * @param pos 
     * @param complete 
     */
    public playCoinAni(value:number,pos:cc.Vec2,complete:Function = null)
    {
        pos = this.node.convertToNodeSpaceAR(cc.v2(pos.x + cc.winSize.width / 2,pos.y + cc.winSize.height / 2));

        var range:number = 120;

        var targetPos:cc.Vec2 = this.coinIcon.position

        for(var i = 0 ; i < 20 ; i++)
        {
            let coin:Coin = GameManager.instance.getCoin();
            coin.node.parent = this.node;
            coin.node.position = pos;
            let midPos = cc.v2(pos.x + Random.Range(-range,range),pos.y + Random.Range(-range,range));
            
            let seq = cc.sequence(cc.moveTo(0.5,midPos).easing(cc.easeCubicActionOut()),cc.moveTo(0.5,targetPos),cc.callFunc(()=>{
                coin.destroySelf();
            })); 

            coin.node.runAction(seq);

        }

        this.scheduleOnce(()=>
        {
            EconomicManager.instance.coin += value;
            complete && complete();
        },1.0)

    }

    public open()
    {
        this.node.active = true;
        this.coin = EconomicManager.instance.coin;
    }

    public close()
    {
        this.node.active = false;
    }


}
