
import UIManager, { ViewName, LayerType } from "../ui/UIManager";
import GameManager, { GameStatus, GameMode } from "../core/GameManager";
import AccountView from "../ui/account/AccountView";
import Clock from "../util/Clock";
import GlobalDataManager from "../core/GlobalDataManager";
import SoundManager from "../core/SoundManager";
import { BgSoundClipType } from "../audio/BgSoundClip";
import DataManager from "../core/DataManager";
import LevelConfigData from "../configdata/LevelConfigData";
import Barrier, { BarrierType } from "./Barrier";
import Teach from "./Teach";
import Tile from "./Tile";
import { SceneData } from "../editor/LevelEditor";
import Player, { PlayerControlType } from "../player/Player";
import Enemy from "../enemy/Enemy";
import Weapon, { WeaponType } from "../player/Weapon";
import Captive from "../captive/Captive";
import { Input, KeyCode } from "../core/InputManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {


    @property(cc.Node)
    public context:cc.Node = null;

    @property(cc.Node)
    public barrierSpace:cc.Node = null;

    @property(cc.Node)
    public glassSpace:cc.Node = null;

    @property(cc.Node)
    public playerSpace:cc.Node = null;

    @property(cc.Node)
    public weaponSpace:cc.Node = null;

    @property(cc.Node)
    public tileSpace:cc.Node = null;

    @property(cc.Sprite)
    public bg:cc.Sprite = null;

    @property(cc.SpriteFrame)
    public bgImgs:cc.SpriteFrame[] = [];

    @property(Clock)
    public clock:Clock = null;

    @property(Teach)
    public teach:Teach = null;

    public barriers:Barrier[] = [];

    public tiles:Tile[] = [];

    public enemys:Enemy[] = [];

    public captives:Captive[] = [];

    public levelConfigData:LevelConfigData = null;

    private isResure:boolean = false;

    private timer:number = 0;

    private player: Player = null;

    public mode:GameMode = 1;

    public setPlayer(roleId:number):void
    {

        if(this.player)
        {
            if(this.player.roleId == roleId)
            {
                return;
            }
            
            this.player.destroySelf();
            this.player = null;
        }

        this.player = GameManager.instance.getPlayer(roleId);
        this.player.node.parent = this.playerSpace;

        if(this.mode == GameMode.mode3)
        {
            this.player.controlType = PlayerControlType.player2;
            this.player.weaponType = WeaponType.stone;
        }else
        {
            this.player.controlType = PlayerControlType.player;
        }

    }

    //区块地图配置
    private mapWidth:number = 750;
    private mapHeight:number = 1600;
    private ceilWidth:number = 75;
    private ceilheight:number = 75;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;

        cc.director.getPhysicsManager().enabledAccumulator = true;

        //cc.director.getPhysicsManager().debugDrawFlags = 1;
        //cc.director.getPhysicsManager().gravity = cc.v2(0,-10);

        //cc.log("cc.PhysicsManager.PTM_RATIO = " + cc.PhysicsManager.PTM_RATIO);
        //像素单位和物理单位的比例是32：1。即32个像素代表1米

        UIManager.instance.economicBar.close();

        this.node.getChildByName("Context").active = false;

        this.scheduleOnce(()=>{

            this.node.getChildByName("Context").active = true;

        },0);

    }

    start () {

        if(SoundManager.instance)
        {
            SoundManager.instance.PlayBGSound(BgSoundClipType.level1);
        }

        this.init(GlobalDataManager.instance.mode,GlobalDataManager.instance.levelConfigData);

    }

    /**
     * 加载关卡
     * @param level_max 
     * @param level_min 
     */
    public loadLevel(level_max:number,level_min:number)
    {

        GameManager.instance.gameStatus = GameStatus.none;
        
        this.player.reset();

        var levelcnfData:LevelConfigData =  DataManager.instance.getLevelConfigData(this.mode,level_max,level_min);
        this.clearScene();

        GlobalDataManager.instance.mode = this.mode;
        GlobalDataManager.instance.levelConfigData = levelcnfData;
        cc.director.loadScene("game_single");

        //this.init(levelcnfData);
        
    }

    private clearScene()
    {
        for(var i = 0 ; i < this.barriers.length ; i++)
        {
            this.barriers[i].destroySelf();;
        }

        for(var i = 0 ; i < this.tiles.length ; i++)
        {
            this.tiles[i].destroySelf();;
        }

        this.barriers.length = 0;
        this.tiles.length = 0;
        this.enemys.length = 0;
    }

    public init(mode:GameMode,levelcnfData:LevelConfigData)
    {

        this.mode = mode;

        if(levelcnfData.chapter <= this.bgImgs.length)
        {
            this.bg.spriteFrame = this.bgImgs[levelcnfData.chapter - 1];
        }

        var roleId:number = 0;
        var weaponId:number = 0;

        if(GlobalDataManager.instance.myTryOutData)
        {
            roleId = GlobalDataManager.instance.myTryOutData.roleId;
            weaponId = GlobalDataManager.instance.myTryOutData.weaponId;
            //GlobalDataManager.instance.myTryOutData = null;
        }

        if(roleId == 0)
        {
            roleId = DataManager.instance.getPlayerData().roleId;
        }

        if(weaponId == 0)
        {
            weaponId = DataManager.instance.getPlayerData().weaponId;
        }

        this.setPlayer(roleId);
        this.player.setWeaponSkin(weaponId);

        var sceneData:SceneData = DataManager.instance.getSceneConfigData(this.mode).scemeDatas[levelcnfData.id];

        this.levelConfigData = levelcnfData;

        this.player.reset();

        this.clock.Reset();

        if(this.isResure)
        {
            this.isResure = false;
        }else
        {
        }

        this.clearScene();

        this.player.node.position =  sceneData.playerPos

        if(sceneData.playerDirection == -1)
        {
            this.player.direction = -1;
        }else
        {
            this.player.direction = 1;
        }
        

        for(var i = 0 ; i < sceneData.barriers.length ; i++)
        {
            var barrier:Barrier = GameManager.instance.getBarrier(sceneData.barriers[i][0]);
            this.barriers.push(barrier);
            if(barrier.type == BarrierType.glass)
            {
                barrier.node.parent = this.glassSpace;
            }else
            {
                barrier.node.parent = this.barrierSpace;
            }
            
            barrier.init(sceneData.barriers[i]);

            //cc.log("sceneData.barriers[i]",sceneData.barriers[i]);

            if(barrier instanceof Enemy)
            {
                this.enemys.push(barrier);
            }

            if(barrier instanceof Captive)
            {
                this.captives.push(barrier);
            }
        }

        var tileDataGrid:number[][] = sceneData.tileDataGrid;

        for(var i = 0 ; i < tileDataGrid.length ; i++)
        {
            for(var j = 0 ; j < 10 ; j++)
            {
                var tileType:number = tileDataGrid[i][j];

                if(tileType != 0)
                {
                    var tile:Tile = GameManager.instance.getTile(tileDataGrid[i][j]);
                    this.tiles.push(tile);
                    tile.node.parent = this.tileSpace;
                    tile.node.x = j * this.ceilWidth + this.ceilWidth / 2;
                    tile.node.y = i * this.ceilheight + this.ceilheight / 2;
                }
            }
        }

        UIManager.instance.gameUI.init(levelcnfData);

        this.startGame();

    }

    public startGame()
    {
        
        this.clock.increse = 1;
        this.clock.Play();

        this.player.onGameStart();
       
        GameManager.instance.gameStatus = GameStatus.start;

        if(this.mode == GameMode.mode1 && this.levelConfigData.id == 1)
        {
            UIManager.instance.OpenView(ViewName.TeachView);
        }


    }

    public gameOver(isPass:boolean)
    {

        if(GameManager.instance.gameStatus == GameStatus.over)
        {
            return;
        }

        UIManager.instance.gameUI.onGameOver(()=>
        {
        });

        UIManager.instance.OpenView(ViewName.AccountView,(view:AccountView)=>
        {
            view.init(isPass);
        });

        GameManager.instance.gameStatus = GameStatus.over;
    
    }

    update(dt)
    {
        if(GameManager.instance.gameStatus == GameStatus.over)
        {
            return;
        }

        this.timer -= dt;

        if(this.timer <= 0)
        {
            this.timer = 1;

            if(this.enemys.length == 0)
            {
                this.updatePlayeLevelStep();
                this.gameOver(true);
            }else
            {
                this.enemys = this.enemys.filter((enemy:Enemy)=>
                {
                    return !enemy.isDie;
                });

                if(UIManager.instance.gameUI.weaponCount == 0 && this.weaponSpace.childrenCount == 0)
                {
                    this.gameOver(false);
                }

            }

            for(var i = 0 ; i < this.captives.length ; i++)
            {
                if(this.captives[i].isDie) //有俘虏死亡的话立刻失败
                {
                    this.gameOver(false);
                }
            }
        }


        if (Input.getKeyDown(KeyCode.LeftArrow)) {
      
            this.gotoPreLevel();
        }

        if (Input.getKeyDown(KeyCode.RightArrow)) {
         
            this.gotoNextLevel();
        }

        
    }
    
    public gameContinus()
    {

        this.isResure = true;
        
        var level_min:number = this.levelConfigData.level_min;
        var level_max:number = this.levelConfigData.level_max;
        this.loadLevel(level_max,level_min);

    }


    /**
     * 进入上一关
     */
    public gotoPreLevel()
    {

        var nextLevelId:number = this.levelConfigData.id - 1;

        var levelConfigDatas:LevelConfigData[] = DataManager.instance.getLevelConfigDatas(this.mode);

        //如果是最后一关则停留在最后一关
        if(nextLevelId < 1)
        {
            nextLevelId = 1;
        }

        var nextLeveCnfdata:LevelConfigData = levelConfigDatas[nextLevelId - 1];

        var level_min:number = nextLeveCnfdata.level_min;
        var level_max:number = nextLeveCnfdata.level_max;

        if(nextLevelId > DataManager.instance.getPlayerData().getLevelConfigData(this.mode).id)
        {
            DataManager.instance.getPlayerData().setLevel(this.mode,level_max,level_min);
            DataManager.instance.savePlayerData();
        }

        this.loadLevel(level_max,level_min);
    }

    
    /**
     * 进入下一关
     */
    public gotoNextLevel()
    {

        var nextLevelId:number = this.levelConfigData.id + 1;

        var levelConfigDatas:LevelConfigData[] = DataManager.instance.getLevelConfigDatas(this.mode);

        //如果是最后一关则停留在最后一关
        if(nextLevelId > levelConfigDatas[levelConfigDatas.length - 1].id)
        {
            nextLevelId = levelConfigDatas[levelConfigDatas.length - 1].id;
        }

        var nextLeveCnfdata:LevelConfigData = levelConfigDatas[nextLevelId - 1];

        var level_min:number = nextLeveCnfdata.level_min;
        var level_max:number = nextLeveCnfdata.level_max;

        if(nextLevelId > DataManager.instance.getPlayerData().getLevelConfigData(this.mode).id)
        {
            DataManager.instance.getPlayerData().setLevel(this.mode,level_max,level_min);
            DataManager.instance.savePlayerData();
        }

        this.loadLevel(level_max,level_min);
    }

    /**
     * 更新玩家关卡进度
     */
    public updatePlayeLevelStep()
    {

        var nextLevelId:number = this.levelConfigData.id + 1;

        var levelConfigDatas:LevelConfigData[] = DataManager.instance.getLevelConfigDatas(this.mode);

        //如果是最后一关则停留在最后一关
        if(nextLevelId > levelConfigDatas[levelConfigDatas.length - 1].id)
        {
            nextLevelId = levelConfigDatas[levelConfigDatas.length - 1].id;
        }

        var nextLeveCnfdata:LevelConfigData = levelConfigDatas[nextLevelId - 1];

        var level_min:number = nextLeveCnfdata.level_min;
        var level_max:number = nextLeveCnfdata.level_max;

        if(nextLevelId > DataManager.instance.getPlayerData().getLevelConfigData(this.mode).id)
        {
            DataManager.instance.getPlayerData().setLevel(this.mode,level_max,level_min);
            DataManager.instance.savePlayerData();
        }
    }

}
