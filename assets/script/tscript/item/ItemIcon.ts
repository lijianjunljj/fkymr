import { ItemType } from "./ItemType";
import ResourcesPool, { Recycle } from "../core/ResourcesPool";
import ResourcesManager from "../core/ResourcesManager";
import DataManager from "../core/DataManager";
import ItemConfigData from "../configdata/ItemConfigData";
import { BackpackItemData } from "../core/BackpackManager";


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
export default class ItemIcon extends cc.Component implements Recycle {

    @property({type:cc.Enum(ItemType)})
    public type:ItemType = ItemType.none;

    @property(cc.Sprite)
    public bg:cc.Sprite = null;

    @property(cc.Sprite)
    public selectState:cc.Sprite = null;

    @property(cc.Sprite)
    public lockSatte:cc.Sprite = null;

    @property(cc.Sprite)
    public icon:cc.Sprite = null;

    @property(cc.SpriteFrame)
    public bgImgs:cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    public coinImg:cc.SpriteFrame = null;

    @property(cc.Node)
    public star:cc.Node = null;

    @property(cc.SpriteFrame)
    public starBgImgs:cc.SpriteFrame[] = [];

    @property(cc.SpriteFrame)
    public starIconImgs:cc.SpriteFrame[] = [];

    @property()
    public canSelected:boolean = true;

    public price:number = 150;

    private _selected: boolean = false;
    public get selected(): boolean {
        return this._selected;
    }
    public set selected(value: boolean) {

        this.selectState.node.active = value;
        this._selected = value;
    }

    private _locked: boolean = false;
    public get locked(): boolean {
        return this._locked;
    }
    public set locked(value: boolean) {
        this.lockSatte.node.active = value;
        this._locked = value;
    }

    private _level: number = 0;
    public get level(): number {
        return this._level;
    }
    public set level(value: number) {
        
        if(this._level == value)
        {
            return;
        }

        var index:number = Math.floor((value - 1) / 5);

        for(var i = 1 ; i <= 5 ; i++)
        {
            

            this.star.getChildByName("Star" + i).getChildByName("Bg").getComponent(cc.Sprite).spriteFrame = this.starBgImgs[index];
            this.star.getChildByName("Star" + i).getChildByName("Icon").getComponent(cc.Sprite).spriteFrame = this.starIconImgs[index];

            if((i - 1) <= (value - 1) % 5)
            {
                this.star.getChildByName("Star" + i).getChildByName("Icon").active = true;
            }else
            {
                this.star.getChildByName("Star" + i).getChildByName("Icon").active = false;
            }
        }

        this._level = value;
    }

    public selectedCallback:Function = null;

    public data:ItemConfigData = null;

    public backpackItemData:BackpackItemData = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            if(!this.canSelected)
            {
                return;
            }

            if(!this.data)
            {
                return;
            }

            this.selected = true;
            this.selectedCallback && this.selectedCallback(this);
        },this);

        //this.icon.spriteFrame = null;

        //this.setBg(0);

    }

    public setBg(index:number)
    {
        this.bg.spriteFrame = this.bgImgs[index];
    }

    public setData(itemId:number)
    {
        this.data = DataManager.instance.getItemConfigDataByItemId(itemId);

        if(!this.data)
        {
            this.setBg(0);
            this.icon.spriteFrame = null;
            this.selected = false;
            return;
        }


        this.type = this.data.type;
        this.level = 1;

        this.setBg(0);


        ResourcesManager.instance.loadImage(`itemicon/${ItemType[this.type]}/${this.data.itemId}`,this.icon);
    }

    public setBackpackItemData(backpackItemData:BackpackItemData)
    {
        this.backpackItemData = backpackItemData;

        if(!this.backpackItemData)
        {
            this.setData(0);
            return;
        }

        this.locked = backpackItemData.locked;

        this.setData(this.backpackItemData.itemId);
    }

    public setCoin(value:number,coin_img:cc.SpriteFrame = null,level:number = 0)
    {

        if(coin_img)
        {
            this.icon.spriteFrame = coin_img;
        }else
        {
            this.icon.spriteFrame = this.coinImg;
        }

        this.setBg(level);
        this.selected = false;
        
        this.bg.node.width = this.bg.spriteFrame.getRect().width;
        this.bg.node.height = this.bg.spriteFrame.getRect().height;
    }

    // update (dt) {}

    public getKey():string
    {
        
        //return PopupText.name;
        return "ItemIcon";
    }

    public awake()
    {
        this.node.angle = 0;
        this.node.position = cc.Vec2.ZERO;
        this.node.active = true;
        this.node.color = cc.Color.WHITE;
        this.node.opacity = 255;
        this.node.scale = 1;

        this.selected = false;
        this.locked = false;
        this.canSelected = true;

    }
    public sleep()
    {
        this.node.stopAllActions();
        this.node.parent = null;
        this.node.active = false;
        this.selectedCallback = null;
        this.data = null;
        this.backpackItemData = null;
        this.icon.spriteFrame = null;

    }

    public destroySelf()
    {
        ResourcesPool.instance.put(this,20);
    }

}
