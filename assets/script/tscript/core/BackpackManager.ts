import { ItemType } from "../item/ItemType";
import ItemConfigData from "../configdata/ItemConfigData";
import DataManager from "./DataManager";
import DataStorage from "./DataStorage";

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

/**
 * 背包管理
 */
@ccclass
export default class BackpackManager extends cc.Component {

    private static _instance: BackpackManager;
    public static get instance(): BackpackManager {
        if(this._instance == null)
        {
            this._instance = new BackpackManager();
            this._instance.init();
        }
        return this._instance;
    }

    private itemTypeArr:ItemType[] = [ItemType.role,ItemType.weapon];

    private _backpackData: BackpackData = new BackpackData();
    public get backpackData(): BackpackData {
        return this._backpackData;
    }

    private init()
    {
        var localBackpackData:BackpackData = JSON.parse(DataStorage.getItem("backpackData"));
        this.cloneData(localBackpackData);
        this.unlockBackpackItem(1000); //默认解锁皮肤
        this.unlockBackpackItem(2000); //默认解锁武器
    }

    public cloneData(targetData:BackpackData)
    {
        this._backpackData = new BackpackData();

        var rolecfgDatas:ItemConfigData[] = DataManager.instance.getItemConfigDataArr(ItemType.role);

        var backpackItemData:BackpackItemData = null;

        for(var i = 0 ; i < rolecfgDatas.length ; i++)
        {
            backpackItemData = new BackpackItemData(rolecfgDatas[i].itemId);
            backpackItemData.slotId = i + 1;

            this.updateBackpackItemData(targetData,backpackItemData);

            this._backpackData.roleArr.push(backpackItemData);
        }

        var weaponcfgDatas:ItemConfigData[] = DataManager.instance.getItemConfigDataArr(ItemType.weapon);

        for(var i = 0 ; i < weaponcfgDatas.length ; i++)
        {

            backpackItemData = new BackpackItemData(weaponcfgDatas[i].itemId);
            backpackItemData.slotId = i + 1;

            this.updateBackpackItemData(targetData,backpackItemData);

            this._backpackData.weaponArr.push(backpackItemData);
        }

    }

    private updateBackpackItemData(targetData:BackpackData,backpackItemData:BackpackItemData)
    {
        if(!targetData)
        {
            return;
        }

        var backpackItemDataArr:BackpackItemData[] = [];

        var type:ItemType = backpackItemData.itemConfigData.type;

        if(type == ItemType.role)
        {
            backpackItemDataArr = targetData.roleArr;
        }

        if(type == ItemType.weapon)
        {
            backpackItemDataArr = targetData.weaponArr;
        }

        var localBackpackItemData = {};

        if(!backpackItemDataArr)
        {
            return;
        }

        for(var i = 0 ; i < backpackItemDataArr.length ; i++)
        {
            if(backpackItemDataArr[i].itemId == backpackItemData.itemId)
            {
                localBackpackItemData = backpackItemDataArr[i];
                backpackItemDataArr.splice(i,1);
                break;
            }
        }

        for(var key in localBackpackItemData)
        {
            if(typeof backpackItemData[key] != "undefined")
            {
                if(key != "slotId")
                {
                    backpackItemData[key] = localBackpackItemData[key];
                }
            }
        }

    }

    public save():void
    {
        DataStorage.setItem("backpackData",JSON.stringify(this._backpackData));
    }

    public getBackpackItemDataArr(type:ItemType):BackpackItemData[]
    {

        if(type == ItemType.role)
        {
            return this._backpackData.roleArr;

        }else if(type == ItemType.weapon)
        {
            return this._backpackData.weaponArr;
        }

        return []
    }

    public getBackpackItemData(itemId:number):BackpackItemData
    {
        var itemConfigData:ItemConfigData = DataManager.instance.getItemConfigDataByItemId(itemId);

        var backpackItemDataArr = this.getBackpackItemDataArr(itemConfigData.type);

        for(var i = 0 ; i < backpackItemDataArr.length ; i++)
        {
            if(backpackItemDataArr[i].itemId == itemId)
            {
                return backpackItemDataArr[i];
            }
        }

        return null;
    }

    /**
     * 
     * @param itemId 解锁道具
     */
    public unlockBackpackItem(itemId:number)
    {
        var backpackItemData:BackpackItemData = this.getBackpackItemData(itemId);

        if(backpackItemData)
        {
            if(!backpackItemData.locked)
            {
                backpackItemData.count ++;
            }else
            {
                backpackItemData.locked = false;
                backpackItemData.count = 0;
            }
            
        }

        this.save();
    }


    public pushBackpack(itemId:number)
    {
        var data = DataManager.instance.getItemConfigData(itemId);

        if(!data)
        {
            console.error("添加进背包的物品不存在配置数据 id = ",itemId);
            return;
        }

        var backpackItemData:BackpackItemData = new BackpackItemData(itemId);

        if(data.type == ItemType.role)
        {
            if(this._backpackData.roleArr.length > 0)
            {
                backpackItemData.slotId = this._backpackData.roleArr[this._backpackData.roleArr.length - 1].slotId + 1;
            }else
            {
                backpackItemData.slotId = 1;
            }

            this._backpackData.roleArr.push(backpackItemData);
        }else if(data.type == ItemType.weapon)
        {
            if(this._backpackData.weaponArr.length > 0)
            {
                backpackItemData.slotId = this._backpackData.weaponArr[this._backpackData.weaponArr.length - 1].slotId + 1;
            }else
            {
                backpackItemData.slotId = 1;
            }

            this._backpackData.weaponArr.push(backpackItemData);
        }
    }

    public removeBackpack(backpackItemData:BackpackItemData)
    {
        var index:number = -1;

        if(backpackItemData.itemConfigData.type == ItemType.role)
        {
            index = this._backpackData.roleArr.indexOf(backpackItemData);
            if(index != -1)
            {
                this._backpackData.roleArr.splice(index,1);
            }
            
        }else if(backpackItemData.itemConfigData.type == ItemType.weapon)
        {
            index = this._backpackData.weaponArr.indexOf(backpackItemData);
            if(index != -1)
            {
                this._backpackData.weaponArr.splice(index,1);
            }

        }
    }

}


export class BackpackData
{

    public roleArr:BackpackItemData[] = [];

    public weaponArr:BackpackItemData[] = [];
}

export class BackpackItemData
{

    /**
     * 槽位id
     */
    public slotId:number = 0;

    public itemId:number = 0;

    /**
     * 装备拥有数量
     */
    public count:number = 0;

    /**
     * 装备等级
     */
    public level:number = 1;

    public locked:boolean = true;

    

    public constructor(itemId:number)
    {
        this.itemId = itemId;
        this.locked = itemId % 1000 != 0;
    }

    public get itemConfigData():ItemConfigData
    {
        return DataManager.instance.getItemConfigDataByItemId(this.itemId);
    }
}
