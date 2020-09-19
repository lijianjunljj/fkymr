import { ItemType } from "../../item/ItemType";
import ItemConfigData from "../../configdata/ItemConfigData";
import { BackpackItemData } from "../../core/BackpackManager";
import ResourcesPool, { Recycle } from "../../core/ResourcesPool";
import ResourcesManager from "../../core/ResourcesManager";
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
export default class MallIcon extends cc.Component implements Recycle {

    @property(cc.Node)
    selectState: cc.Node = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    public type:ItemType = ItemType.none;

    public canSelected:boolean = true;

    private _selected: boolean = false;
    public get selected(): boolean {
        return this._selected;
    }
    public set selected(value: boolean) {

        this._selected = value;
        this.selectState.active = value;

        if(this._selected)
        {
            this.node.runAction(cc.scaleTo(0.1,1.2));
        }else
        {
            this.node.runAction(cc.scaleTo(0.1,1));
        }
        
    }


    private _locked: boolean = false;
    public get locked(): boolean {
        return this._locked;
    }
    public set locked(value: boolean) {
        this._locked = value;
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
    }

    // update (dt) {}

    public updateState()
    {

    }

    public setData(itemId:number)
    {
        this.data = DataManager.instance.getItemConfigDataByItemId(itemId);

        if(!this.data)
        {
            this.icon.spriteFrame = null;
            this.selected = false;
            ResourcesManager.instance.loadImage(`itemicon/${ItemType[this.type]}/${0}`,this.icon);
            return;
        }

        this.type = this.data.type;
        //this.nameTxt.string = `<b><i>${this.data.name}</i></b>`;

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

        if(backpackItemData.locked)
        {
            
        }else
        {
        }
        
        //this.level = backpackItemData.level;

        this.updateState();
    }

    
    

    // update (dt) {}

    public getKey():string
    {
        
        //return PopupText.name;
        return "MallIcon";
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
