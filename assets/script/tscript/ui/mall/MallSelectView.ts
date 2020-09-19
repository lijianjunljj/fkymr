import SelectView from "../base/SelectView";
import MallView from "./MallView";
import { ItemType } from "../../item/ItemType";
import MallIcon from "./MallIcon";
import DataManager from "../../core/DataManager";
import BackpackManager, { BackpackItemData } from "../../core/BackpackManager";
import ItemConfigData from "../../configdata/ItemConfigData";
import GameManager from "../../core/GameManager";

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
export default class RankSelectView extends SelectView {

    

    @property(MallView)
    private mallkView:MallView = null;

    @property(cc.ScrollView)
    private scrollView:cc.ScrollView = null;

    @property(cc.Node)
    private content:cc.Node = null;


    @property({type:cc.Enum(ItemType)})
    public type:ItemType = ItemType.none;

    private isInit:boolean = false;

    //@property(ItemIcon)
    private mallIconList:MallIcon[] = [];


    private selectMallIcon:MallIcon = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      

    }

    // update (dt) {}

    public awake()
    {
        super.awake();
        this.refreshView();
    }

    public sleep()
    {
        super.sleep();
    }

    public init()
    {
        this.onSelectMallIcon.bind(this);
    }

    public onSelectMallIcon(mallIcon:MallIcon)
    {

        if(this.selectMallIcon)
        {
            this.selectMallIcon.selected = false;
            this.selectMallIcon.updateState();

        }

        this.selectMallIcon = mallIcon;
        this.selectMallIcon.selected = true;


        if(!this.selectMallIcon.locked)
        {
            if(this.type == ItemType.role)
            {
                //DataManager.instance.getPlayerData().hairId = this.selectMallIcon.backpackItemData.itemId;
            }

            if(this.type == ItemType.weapon)
            {
                //DataManager.instance.getPlayerData().clothesId = this.selectMallIcon.backpackItemData.itemId;
            }

            DataManager.instance.savePlayerData();
        }
        

        this.onPlayerEquip(this.selectMallIcon);

        this.mallkView.selectMallIcon = this.selectMallIcon;

        //this.mallkView.player.updateSkin();
        if(this.selectMallIcon.data.type == ItemType.role)
        {
            this.mallkView.setPlayer(this.selectMallIcon.data.itemId);
        }else if(this.selectMallIcon.data.type == ItemType.weapon)
        {
            this.mallkView.setWeapon(this.selectMallIcon.data.itemId);
        }

        this.mallkView.updateState();

        this.refreshProperty();

    }

    private onPlayerEquip(mallIcon:MallIcon)
    {
        for(var i = 0 ; i  < this.mallIconList.length ; i++)
        {
            this.mallIconList[i].updateState();
        }
    }

    protected refreshProperty()
    {
        if(!this.selectMallIcon)
            return;

        this.mallkView.payBtn.node.getChildByName("CostTxt").getComponent(cc.Label).string = "" + this.selectMallIcon.data.price;
    }


    public refreshView()
    {
        if(!this.isInit)
        {
            this.init();
            this.isInit = true;
        }

        if(this.selectMallIcon)
        {
            this.selectMallIcon.selected = false;
            this.selectMallIcon.updateState();
            //this.selectMallIcon.closeStretch();
            this.selectMallIcon = null;
        }

        var backpackItemData:BackpackItemData = null;

        if(this.type == ItemType.role)
        {
            backpackItemData = BackpackManager.instance.getBackpackItemData(DataManager.instance.getPlayerData().roleId);
        }else if(this.type == ItemType.weapon)
        {
            backpackItemData = BackpackManager.instance.getBackpackItemData(DataManager.instance.getPlayerData().weaponId);
        }

        var backpackItemDataArr:BackpackItemData[] = BackpackManager.instance.getBackpackItemDataArr(this.type).slice();
        backpackItemDataArr.sort((data1:BackpackItemData,data2:BackpackItemData):number=>
        {
            var cnfdata1:ItemConfigData = data1.itemConfigData;
            var cnfdata2:ItemConfigData = data2.itemConfigData;

            /*if(!data1.locked && data2.locked)
            {
                return -1;
            }

            if(data1.locked && !data2.locked)
            {
                return 1;
            }*/

            if(cnfdata1.sort > cnfdata2.sort)
            {
                return 1;
            }

            if(cnfdata1.sort < cnfdata2.sort)
            {
                return -1;
            }

            return 0;
        });
        
        for(var i = 0 ; i < backpackItemDataArr.length ; i++)
        {

            let mallIcon:MallIcon = this.mallIconList[i];
            
            if(!mallIcon)
            {
                mallIcon = GameManager.instance.getMallIcon();
                mallIcon.selectedCallback = (eq)=>
                {
                    this.onSelectMallIcon(mallIcon);
                };
                //mallIcon.equipSelectView = this;
                this.mallIconList.push(mallIcon);
            }
             
            mallIcon.type = this.type;
            mallIcon.node.parent = this.content;
            mallIcon.node.x =  i * 110 + 65
            mallIcon.node.y = 0;

            mallIcon.setBackpackItemData(backpackItemDataArr[i]);

            if(backpackItemData && backpackItemDataArr[i] == backpackItemData)
            {
                mallIcon.selected = true;
                this.onSelectMallIcon(mallIcon);
            }
        }

        this.content.width =  backpackItemDataArr.length * 110 + 5;

        if(this.content.width < 564)
        {
            this.content.width = 564;
        }

        this.refreshProperty();

    }
}
