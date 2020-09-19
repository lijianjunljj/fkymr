import PopupText from "../ui/common/PopupText";
import ResourcesPool from "./ResourcesPool";
import ResourcesManager from "./ResourcesManager";
import GameScene from "../gamescene/GameScene";
import ItemIcon from "../item/ItemIcon";
import Coin from "../ui/toolbar/Coin";
import Tile from "../gamescene/Tile";
import Player from "../player/Player";
import Barrier, { BarrierType } from "../gamescene/Barrier";
import Weapon, { WeaponType } from "../player/Weapon";
import LevelItem from "../ui/level/LevelItem";
import MallIcon from "../ui/mall/MallIcon";


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

/**
 * 游戏状态
 */
export enum GameStatus
{
    none = 0,
    start = 1,
    over = 2,
}

/**
 * 游戏模式
 */
export enum GameMode
{
    none = 0,

    /**
     * 征途模式
     */
    mode1 = 1,
    /**
     * 人质模式
     */
    mode2 = 2,
    /**
     * 投石器模式
     */
    mode3 = 3,
    /**
     * 对战模式
     */
    mode4 = 4,
}

@ccclass
export default class GameManager extends cc.Component {

    private static _instance: GameManager;
    public static get instance(): GameManager {
        /*if(this._instance == null)
        {
            this._instance = new GameManager();
            this._instance.init();
        }*/
        return GameManager._instance;
    }

    @property(cc.Node)
    public canvas:cc.Node = null;

    @property(cc.Node)
    public msgLayer:cc.Node = null;

    @property({type:cc.Enum(GameMode)})
    public gameMode:GameMode = GameMode.mode1;

    @property(GameScene)
    public gameScene:GameScene = null;

    @property(cc.Node)
    public touchPlane:cc.Node = null;

    @property(cc.Prefab)
    public playerPrefabArr:cc.Prefab[] = [];

    @property(cc.Prefab)
    public itemIconPrefab:cc.Prefab = null;

    @property(cc.Prefab)
    public mallIconPrefab:cc.Prefab = null;

    @property(cc.Prefab)
    public levelItemPrefab:cc.Prefab = null;

    @property(cc.Prefab)
    public weaponPrefabArr:cc.Prefab[] = [];

    @property(cc.Prefab)
    public barrierPrefabArr:cc.Prefab[] = [];

    @property(cc.Prefab)
    public tilePrefabArr:cc.Prefab[] = [];

    @property(cc.SpriteFrame)
    public shareImg:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    public videoImg:cc.SpriteFrame = null;

    public gameStatus:GameStatus = GameStatus.none;

    /*@property(Product)
    private productList:Product[] = [];
    private productDic:{[key:number]:Product} = {};*/

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        GameManager._instance = this;
        //GameManager._instance.init();
    }

    public init()
    {
        //this.canvas = cc.find("Canvas");
    }

    public showPopupText(position:cc.Vec2,msg:string,size:number = 32,color:cc.Color = cc.Color.YELLOW)
    {
        var popupText:PopupText = ResourcesPool.instance.get<PopupText>("PopupText");
        
        if(popupText)
        {
            popupText.node.setParent(this.msgLayer);
            popupText.node.position = position;
            popupText.showText(msg,size,color);
        }else
        {
            ResourcesManager.instance.load("PopupText",(node:cc.Node)=>{
                popupText = node.getComponent(PopupText);
                popupText.node.setParent(this.msgLayer);
                popupText.node.position = position;
                popupText.node.active = true;
                popupText.showText(msg,size,color);
            });
        }
    }

    /**
     * 获得玩家
     */
    public getPlayer(roleId:number):Player
    {
        var node:cc.Node = cc.instantiate(this.playerPrefabArr[roleId % 1000]);
        var player = node.getComponent(Player);
        player.node.position = cc.Vec2.ZERO;
        player.node.active = true;
        player.roleId = roleId;
        return player;
    }


    /**
     * 获得物品图标
     */
    public getItemIcon():ItemIcon
    {

        var itemIcon:ItemIcon = ResourcesPool.instance.get<ItemIcon>("ItemIcon");
        
        if(itemIcon)
        {
            return itemIcon;
        }

        var node:cc.Node = cc.instantiate(this.itemIconPrefab);
        itemIcon = node.getComponent(ItemIcon);
        itemIcon.node.position = cc.Vec2.ZERO;
        itemIcon.node.active = true;
        itemIcon.icon.spriteFrame = null;
        return itemIcon;
    }

    /**
     * 获得物品图标
     */
    public getMallIcon():MallIcon
    {

        var mallIcon:MallIcon = ResourcesPool.instance.get<MallIcon>("MallIcon");
        
        if(mallIcon)
        {
            return mallIcon;
        }

        var node:cc.Node = cc.instantiate(this.mallIconPrefab);
        mallIcon = node.getComponent(MallIcon);
        mallIcon.node.position = cc.Vec2.ZERO;
        mallIcon.node.active = true;
        mallIcon.icon.spriteFrame = null;
        return mallIcon;
    }

    /**
     * 获得关卡单元
     */
    public getLevelItem():LevelItem
    {

        var levelItem:LevelItem = ResourcesPool.instance.get<LevelItem>("LevelItem");
        
        if(levelItem)
        {
            return levelItem;
        }

        var node:cc.Node = cc.instantiate(this.levelItemPrefab);
        levelItem = node.getComponent(LevelItem);
        levelItem.node.position = cc.Vec2.ZERO;
        levelItem.node.active = true;
 
        return levelItem;
    }

    /**
     * 获得武器
     */
    public getWeapon(type:WeaponType):Weapon
    {

        var weapon:Weapon = ResourcesPool.instance.get<Weapon>("Weapon");
        
        if(weapon && !weapon.isDestroy)
        {
            return weapon;
        }

        var node:cc.Node = cc.instantiate(this.weaponPrefabArr[type]);
        weapon = node.getComponent(Weapon);
        weapon.node.position = cc.Vec2.ZERO;
        weapon.node.active = true;
        return weapon;
    }

  

    /**
     * 获得障碍物
     */
    public getBarrier(type:BarrierType):Barrier
    {

        var barrier:Barrier = ResourcesPool.instance.get<Barrier>("Barrier" + type);
        
        if(barrier)
        {
            return barrier;
        }

        var node:cc.Node = cc.instantiate(this.barrierPrefabArr[type]);
        barrier = node.getComponent(Barrier);
        barrier.node.name = "Barrier" + type;
        barrier.type = type;
        barrier.node.position = cc.Vec2.ZERO;
        barrier.node.active = true;

        return barrier;

    }

    /**
     * 获得区块
     */
    public getTile(type:number):Tile
    {

        var tile:Tile = ResourcesPool.instance.get<Tile>("Tile" + type);

        if(tile)
        {
            //cc.log("从资源池获得 ","Tile" + type);
            return tile;
        }

        var node:cc.Node = cc.instantiate(this.tilePrefabArr[type - 1]);
        tile = node.getComponent(Tile);
        tile.type = type;
        tile.node.name = "Tile" + type
        tile.node.position = cc.Vec2.ZERO;
        tile.node.active = true;

        return tile;
    }


    public getCoin():Coin
    {
        var coin:Coin = ResourcesPool.instance.get<Coin>("Coin");
        if(coin)
        {
            console.log("从对象池获得金币");
            return coin;
        }

        var node:cc.Node = new cc.Node("Coin");
        coin = node.addComponent(Coin);
        coin.node.position = cc.Vec2.ZERO;
        coin.init();
        return coin;
    }
   
    /*start () {

    }*/

    // update (dt) {}
}
