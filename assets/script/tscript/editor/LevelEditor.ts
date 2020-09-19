import DataManager from "../core/DataManager";
import Mathf from "../util/Mathf";
import { Input, KeyCode } from "../core/InputManager";
import EditorElement from "./EditorElement";
import SceneConfigData from "../configdata/SceneConfigData";
import LevelConfigData from "../configdata/LevelConfigData";
import DataStorage from "../core/DataStorage";
import GlobalDataManager from "../core/GlobalDataManager";
import Loading from "../Loading";
import GridLayer from "./GridLayer";
import { GameMode } from "../core/GameManager";

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

export class SceneData
{
    public playerPos:cc.Vec2 = cc.Vec2.ZERO;

    public playerDirection:number = 1;

    /**
     * 区块数据
     */
    public tileDataGrid:number[][] = [];

    public barriers:any[][] = [];
}

@ccclass
export default class LevelEditor extends cc.Component {


    @property
    path: string = 'd:/';

    editorFilePath: string = 'd:/CroodsEditor/';

    //@property
    //fileName: string = 'ConfigTable.json';

    @property({type:cc.Enum(GameMode)})
    mode: GameMode = 1;

    @property(cc.Label)
    titleTxt: cc.Label = null;

    @property(cc.Node)
    public ui:cc.Node = null;

    @property(cc.Node)
    public ui1:cc.Node = null;

    @property(cc.Node)
    public ui2:cc.Node = null;

    @property(cc.Node)
    public barrierSpace:cc.Node = null;

    @property(cc.Node)
    public tileSpace:cc.Node = null;

    public barriers:cc.Node[] = [];

    @property(cc.Node)
    public editElenents:cc.Node[] = [];

    @property(cc.Sprite)
    public tile:cc.Sprite = null;

    @property(cc.SpriteFrame)
    public tileImgs:cc.SpriteFrame[] = [];

    @property(cc.Node)
    public player:cc.Node = null;

    @property(cc.EditBox)
    public nameInput:cc.EditBox = null;

    @property(cc.EditBox)
    public xInput:cc.EditBox = null;

    @property(cc.EditBox)
    public yInput:cc.EditBox = null;

    @property(cc.EditBox)
    public rInput:cc.EditBox = null;

    @property(cc.EditBox)
    public widthInput:cc.EditBox = null;

    @property(cc.EditBox)
    public heightInput:cc.EditBox = null;

    @property(cc.EditBox)
    public sxInput:cc.EditBox = null;

    @property(cc.EditBox)
    public syInput:cc.EditBox = null;

    @property(cc.EditBox)
    public evtInput:cc.EditBox = null;

    @property(cc.EditBox)
    public levelIdInput:cc.EditBox = null;

    @property(cc.EditBox)
    public levelMaxInput:cc.EditBox = null;

    @property(cc.EditBox)
    public levelMinInput:cc.EditBox = null;

    @property(cc.Node)
    public tileIconArr:cc.Node[] = [];

    private nodeX:number = 0;

    private nodeY:number = 0;

    private nodeR:number = 0;

    private nodeW:number = 0;

    private nodeH:number = 0;

    private nodeSX:number = 0;

    private nodeSY:number = 0;

    private nodeEVT:string = "";

    private selectedNode:cc.Node = null;

    private pressCtr:boolean = false;

    private static levelMode:number = 0;

    private static sceneData:SceneData = new SceneData();

    private static sceneCnfData:SceneConfigData = null;

    private static lastEditorLevel:number = 0;

    private _editorType: number = 0;
    public get editorType(): number {
        return this._editorType;
    }
    public set editorType(value: number) {
        this._editorType = value;
        if(this._editorType == 0)
        {
            this.ui1.active = true;
            this.ui2.active = false;
        }else
        {
            this.ui1.active = false;
            this.ui2.active = true;
        }
    }

    private msDosn:boolean = false;


    @property(GridLayer)
    private gridLayer:GridLayer = null;

    /*private _graphics: cc.Graphics = null;
    public get graphics(): cc.Graphics {

        if(!this._graphics)
        {
            this._graphics = this.addComponent(cc.Graphics);
        }

        return this._graphics;
    }*/
 
    private mapWidth:number = 750;
    private mapHeight:number = 1600;
    private ceilWidth:number = 75;
    private ceilheight:number = 75;

    private row:number = 0;
    private col:number = 0;

    private tileGrid:cc.Sprite[][] = [];

    private _tileValue: number = 1;
    public get tileValue(): number {
        return this._tileValue;
    }
    public set tileValue(value: number) {
        this._tileValue = value;

        for(var i = 1 ; i <= this.tileIconArr.length ; i++)
        {
            if(i == value)
            {
                this.tileIconArr[i - 1].color = cc.Color.RED;
                this.ui2.getChildByName("TopBar").getChildByName("Tile").getComponent(cc.Sprite).spriteFrame 
                = this.tileIconArr[i - 1].getComponent(cc.Sprite).spriteFrame;

            }else
            {
                this.tileIconArr[i - 1].color = cc.Color.WHITE;
            }
            
        }

    }

    private getFileName():string
    {
        if(this.mode == GameMode.mode1)
        {
            return `SceneConfigTable.json`;
        }else
        {
            return `SceneConfigTable${this.mode}.json`;
        }
    }

    private getLevelConfigDatas():LevelConfigData[]
    {
        return DataManager.instance.getLevelConfigDatas(this.mode);
    }

    private getSceneConfigData():SceneConfigData
    {
        return DataManager.instance.getSceneConfigData(this.mode);
    }

    private setSceneConfigdata(cnfdata)
    {
        if(this.mode == GameMode.mode1)
        {
            DataManager.instance.sceneConfigData = cnfdata;
        }else if(this.mode == GameMode.mode2)
        {
            DataManager.instance.sceneConfigData2 = cnfdata;
        }else if(this.mode == GameMode.mode3)
        {
            DataManager.instance.sceneConfigData3 = cnfdata;
        }else if(this.mode == GameMode.mode4)
        {
            DataManager.instance.sceneConfigData4 = cnfdata;
        }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        if(LevelEditor.levelMode > 0)
        {
            this.mode = LevelEditor.levelMode;
        }

        this.titleTxt.string = "游戏模式" + this.mode;

        this.node.active = false;
        DataManager.instance.loadComfigDatas(()=>
        {
            this.node.active = true;
        });

        //DataManager.instance["_isJosnLoaded"] = false;

        cc.debug.setDisplayStats(false);

    }

    start () {

        if(CC_JSB)
        {
            cc.log("getWritablePath() = ",jsb.fileUtils.getWritablePath())
        }

        if(CC_JSB)
        {
            this.editorFilePath = this.path + `scene_cnf${this.mode == GameMode.mode1 ? "":this.mode}/`;

            if(!jsb.fileUtils.isDirectoryExist(this.editorFilePath))
            {
                cc.log("路径不存在,创建路径",this.editorFilePath);
                jsb.fileUtils.createDirectory(this.editorFilePath)
            }
        }

        


        this.editorType = 0;
        this.tileValue = 1;

        LevelEditor.sceneData = new SceneData();
       
        var r:number = Math.ceil(this.mapHeight / this.ceilheight);
        var c:number = Math.ceil(this.mapWidth / this.ceilWidth);

        this.row = r;
        this.col = c;

        for(var i= 0; i < r ; i++)
        {
            this.tileGrid.push([]);
            LevelEditor.sceneData.tileDataGrid.push([]);

            for(var j = 0 ; j < c ; j++)
            {
                var tile:cc.Sprite = cc.instantiate(this.tile.node).getComponent(cc.Sprite);
                tile.node.active = true;
                tile.node.x = j * this.ceilWidth + this.ceilWidth / 2;
                tile.node.y = i * this.ceilheight + this.ceilheight / 2;
                tile.spriteFrame = null;
                this.tileSpace.addChild(tile.node);
                this.tileGrid[i][j] = tile;
                LevelEditor.sceneData.tileDataGrid[i][j] = 0;
            }
        }
        

        this.gridLayer.drawGrid(this.mapWidth,this.mapHeight,this.ceilWidth,this.ceilheight,1);
        
        this.barriers = [];

        this.readFile();

        if(LevelEditor.lastEditorLevel == 0)
        {
            LevelEditor.lastEditorLevel = DataStorage.getIntItem("lastEditorLevel_" + this.mode,1);
        }

        if(LevelEditor.lastEditorLevel > this.getLevelConfigDatas().length)
        {
            LevelEditor.lastEditorLevel = this.getLevelConfigDatas().length;
        }

        this.initUI2();
        this.init();

        this.node.on(cc.Node.EventType.MOUSE_DOWN,(event:cc.Event.EventMouse)=>
        {
            this.msDosn = true;

            if(this.editorType == 0)
            {
            }else
            {


                var clickPos:cc.Vec2 = event.getLocation();

                if(this.pressCtr)
                {
                    this.setTileValue(clickPos.x,clickPos.y,0);
                }else
                {
                    this.setTileValue(clickPos.x,clickPos.y,this.tileValue);
                }
            }

            //cc.log("点击位置 ", clickPos, x,y);

        },false);

        this.player.on(cc.Node.EventType.MOUSE_DOWN,(event:cc.Event.EventMouse)=>
        {
            if(this.selectedNode)
            {
                this.selectedNode.getComponent(EditorElement).selected = false;
            }

            this.selectedNode = this.player;
            this.selectedNode.getComponent(EditorElement).selected = true;
            this.selectedNode.getComponent(EditorElement).drag = true;

        },false);

        this.node.on(cc.Node.EventType.MOUSE_MOVE,(event:cc.Event.EventMouse)=>
        {
            if(this.editorType == 0)
            {
                if(this.selectedNode && this.selectedNode.getComponent(EditorElement).drag && event.getDelta().mag() > 0)
                {
                    this.selectedNode.position = event.getLocation().sub(cc.v2(cc.winSize.width / 2,cc.winSize.height / 2));
                }
            }else
            {
                if(this.msDosn)
                {
                    var clickPos:cc.Vec2 = event.getLocation();

                    if(this.pressCtr)
                    {
                        this.setTileValue(clickPos.x,clickPos.y,0);
                    }else
                    {
                        this.setTileValue(clickPos.x,clickPos.y,this.tileValue);
                    }
                }
            }
            
        },false);

        this.node.on(cc.Node.EventType.MOUSE_UP,(event:cc.Event.EventMouse)=>
        {
            this.msDosn = false;

            if(this.editorType == 0)
            {
                if(this.selectedNode)
                {
                    this.selectedNode.getComponent(EditorElement).drag = false;
                }
            }else
            {

            }
        },false);

    }

    private init()
    {

        LevelEditor.sceneData = LevelEditor.sceneCnfData.scemeDatas[LevelEditor.lastEditorLevel];

        var levelConfigData:LevelConfigData = this.getLevelConfigDatas()[LevelEditor.lastEditorLevel - 1];

        if(!LevelEditor.sceneData)
        {
            LevelEditor.lastEditorLevel = 1;
            LevelEditor.sceneData = LevelEditor.sceneCnfData.scemeDatas[LevelEditor.lastEditorLevel];
        }

        this.player.position = LevelEditor.sceneData.playerPos;
        if(LevelEditor.sceneData.playerDirection == -1)
        {
            this.player.scaleX = -1;
        }else
        {
            this.player.scaleX = 1;
        }

        this.player["evt"] = 0;

        for(var i = 0 ; i < this.barriers.length ; i++)
        {
            this.barriers[i].destroy();
        }

        this.barriers.length = 0;

        for(var i = 0 ; i < LevelEditor.sceneData.barriers.length ; i++)
        {
            var type:number = 0;

            if(!LevelEditor.sceneData.barriers[i][0])
            {
                type = 0;
            }else
            {
                type = LevelEditor.sceneData.barriers[i][0];
            }

            this.barriers[i] = this.getEditElement(type);            
            this.barriers[i].x = LevelEditor.sceneData.barriers[i][1];
            this.barriers[i].y = LevelEditor.sceneData.barriers[i][2];
            this.barriers[i].angle = LevelEditor.sceneData.barriers[i][3];
            this.barriers[i].width = LevelEditor.sceneData.barriers[i][4];
            this.barriers[i].height = LevelEditor.sceneData.barriers[i][5];

            console.log("LevelEditor.sceneData.barriers[i] ",LevelEditor.sceneData.barriers[i])

            if(!LevelEditor.sceneData.barriers[i][6])
            {
                this.barriers[i].scaleX = 1
            }else
            {
                this.barriers[i].scaleX = LevelEditor.sceneData.barriers[i][6];
            }

            if(!LevelEditor.sceneData.barriers[i][7])
            {
                this.barriers[i].scaleY = 1;
            }else
            {
                this.barriers[i].scaleY = LevelEditor.sceneData.barriers[i][7];
            }

            if(!LevelEditor.sceneData.barriers[i][8])
            {
                this.barriers[i]["evt"] = 0;
            }else
            {
                this.barriers[i]["evt"] = LevelEditor.sceneData.barriers[i][8];
            }

            
            
        }

        var tileDataGrid:number[][] = LevelEditor.sceneData.tileDataGrid;

        for(var i = 0 ; i < tileDataGrid.length ; i++)
        {
            if(tileDataGrid[i].length > this.col)
            {
                tileDataGrid[i].pop();
            }
        }


        for(var i = 0 ; i < tileDataGrid.length ; i++)
        {
            for(var j = 0 ; j < tileDataGrid[0].length ; j++)
            {
                var r = i;
                var c = j;

                this.tileGrid[r][c].spriteFrame = this.tileImgs[tileDataGrid[r][c]];

            }
        }

        this.levelIdInput.string = "" + levelConfigData.id;
        this.levelMaxInput.string = "" + levelConfigData.level_max;
        this.levelMinInput.string = "" + levelConfigData.level_min;

        if(this.selectedNode)
        {
            this.selectedNode.getComponent(EditorElement).selected = false;
            this.selectedNode = null;
        }

        DataStorage.setItem("lastEditorLevel_" + this.mode,LevelEditor.lastEditorLevel);
        //this.writeFile();

    }

    public initUI2()
    {
        
        for(let i = 1 ; i <= this.tileIconArr.length ; i++)
        {
            this.tileIconArr[i - 1].getComponent(cc.Sprite).spriteFrame = this.tileImgs[i];
            this.tileIconArr[i - 1].on(cc.Node.EventType.MOUSE_DOWN,(event:cc.Event.EventMouse)=>
            {
                this.tileValue = i;
            },false);
        }
    }

    public setTileValue(x:number,y:number,value:number)
    {
        var r:number = Math.floor(y / this.ceilheight);
        var c:number = Math.floor(x / this.ceilWidth);

        r = Mathf.clamp(r,0,this.row);
        c = Mathf.clamp(c,0,this.col);

        LevelEditor.sceneData.tileDataGrid[r][c] = value;
        this.tileGrid[r][c].spriteFrame = this.tileImgs[value];
    }

    onTextInputDidEnded(editBox:cc.EditBox,flag:number)
    {
        var value:number = Number(editBox.string);

        if(flag == 1)
        {
            if(value > 0 && value < this.getLevelConfigDatas().length)
            {
                LevelEditor.lastEditorLevel = value;
                this.init();
            }
        }

        if(flag == 2)
        {
            var level_max:number = Number(this.levelMaxInput.string);
            var level_min:number = Number(this.levelMinInput.string);

            var levelcnfdata:LevelConfigData = DataManager.instance.getLevelConfigData(this.mode,level_max,level_min);
            if(levelcnfdata)
            {
                LevelEditor.lastEditorLevel = levelcnfdata.id;
                this.init();
            }
        }

        if(flag == 3)
        {
            var level_max:number = Number(this.levelMaxInput.string);
            var level_min:number = Number(this.levelMinInput.string);

            var levelcnfdata:LevelConfigData = DataManager.instance.getLevelConfigData(this.mode,level_max,level_min);
            if(levelcnfdata)
            {
                LevelEditor.lastEditorLevel = levelcnfdata.id;
                this.init();
            }
        }

    }

    public getEditElement(type:number):cc.Node
    {
        var elenent:cc.Node = cc.instantiate(this.editElenents[type]);
        elenent.parent = this.barrierSpace;
        elenent.active = true;

        elenent.position = cc.v2(289,219);
        elenent.angle = 0;
        elenent.opacity = 255;
        elenent["evt"] = 0;


        elenent.on(cc.Node.EventType.MOUSE_DOWN,(event:cc.Event.EventMouse)=>
        {
            if(this.selectedNode)
            {
                this.selectedNode.getComponent(EditorElement).selected = false;
            }

            if(event.getButton() == cc.Event.EventMouse.BUTTON_LEFT)
            {
                this.selectedNode = elenent;
                this.selectedNode.getComponent(EditorElement).selected = true;
                this.selectedNode.getComponent(EditorElement).drag = true;
            }else if(event.getButton() == cc.Event.EventMouse.BUTTON_RIGHT)
            {
                this.deleteEditElement(elenent);
            }

        },false);

        elenent.on(cc.Node.EventType.MOUSE_WHEEL,(event:cc.Event.EventMouse)=>
        {
            if(this.selectedNode)
            {
                this.selectedNode.getComponent(EditorElement).selected = false;
            }

            this.selectedNode = elenent;
            this.selectedNode.getComponent(EditorElement).selected = true;

            if(!this.pressCtr)
            {
                elenent.angle += Mathf.sign(event.getScrollY()) * 5;
            }else
            {
                elenent.angle += Mathf.sign(event.getScrollY());
            }
            
        },false);

        return elenent;
    }

    public deleteEditElement(editNode:cc.Node)
    {
        if(!editNode)
            return;

        if(this.selectedNode == editNode)
        {
            this.selectedNode.getComponent(EditorElement).selected = false;
            this.selectedNode = null;
        }

        var index:number = this.barriers.indexOf(editNode);

        if(index != -1)
        {
            this.barriers.splice(index,1);
        }

        editNode.destroy();

    }

    onTextInputChange(value:number,editBox,flag)
    {
        var numValue = Number(value);

        if(flag == 1)
        {
            this.nodeX = numValue;
            if(this.selectedNode)
            {
                this.selectedNode.x = this.nodeX;
            }
        }

        if(flag == 2)
        {
            this.nodeY = numValue;
            if(this.selectedNode)
            {
                this.selectedNode.y = this.nodeY;
            }
        }

        if(flag == 3)
        {
            this.nodeR = numValue;
            if(this.selectedNode)
            {
                this.selectedNode.angle = this.nodeR;
            }
        }

        if(flag == 4)
        {
            this.nodeW = numValue;
            if(this.selectedNode)
            {
                this.selectedNode.width = this.nodeW;
            }
        }

        if(flag == 5)
        {
            this.nodeH = numValue;
            if(this.selectedNode)
            {
                this.selectedNode.height = this.nodeH;
            }
        }

        if(flag == 6)
        {
            this.nodeSX = numValue;
            if(this.selectedNode)
            {
                this.selectedNode.scaleX = this.nodeSX;
            }
        }

        if(flag == 7)
        {
            this.nodeSY = numValue;
            if(this.selectedNode)
            {
                this.selectedNode.scaleY = this.nodeSY;
            }
        }

        if(flag == 8)
        {
            this.nodeEVT = value.toString();
            if(this.selectedNode)
            {
                this.selectedNode["evt"] = this.nodeEVT;
            }
        }
    }

    addBarrier(event,type:number)
    {
        //this.barrierCount ++;

        var ban:cc.Node = this.getEditElement(type);
        this.barriers.push(ban);
    }

    pageUp()
    {
        LevelEditor.lastEditorLevel --;

        if(LevelEditor.lastEditorLevel <= 1)
        {
            LevelEditor.lastEditorLevel = 1;
        }

        this.init();
    }

    pageDown()
    {
        
        LevelEditor.lastEditorLevel ++;

        if(LevelEditor.lastEditorLevel >= this.getLevelConfigDatas().length)
        {
            LevelEditor.lastEditorLevel = this.getLevelConfigDatas().length;
        }

        this.init();

    }

    update (dt) 
    {
        if(Input.getKeyDown(KeyCode.Ctrl))
        {
            
            this.pressCtr = true;
        }

        if(Input.getKeyUp(KeyCode.Ctrl))
        {
            this.pressCtr = false;
        }

        if(Input.getKeyDown(KeyCode.D))
        {
            if(this.pressCtr)
            {
                //删除
                this.deleteEditElement(this.selectedNode);
            }
        }

        if(Input.getKeyDown(KeyCode.S))
        {
            if(this.pressCtr)
            {
                //保存
                this.writeFile();
            }
        }

        if(Input.getKeyDown(KeyCode.Enter))
        {
            if(this.pressCtr)
            {
                //测试游戏
                this.testScene();
            }
        }

        if(Input.getKey(KeyCode.LeftArrow))
        {
            if(this.selectedNode)
            {
                this.selectedNode.x --;
            }
        }

        if(Input.getKey(KeyCode.RightArrow))
        {
            if(this.selectedNode)
            {
                this.selectedNode.x ++;
            }
        }

        if(Input.getKey(KeyCode.UpArrow))
        {
            if(this.selectedNode)
            {
                this.selectedNode.y ++;
            }
        }

        if(Input.getKey(KeyCode.DownArrow))
        {
            if(this.selectedNode)
            {
                this.selectedNode.y --;
            }
        }

        if (Input.getKeyDown(KeyCode.Space)) {
            this.ui.active = !this.ui.active;
        }

        if (Input.getKeyDown(KeyCode.F1)) {
            
            this.editorType = 0;
        }

        if (Input.getKeyDown(KeyCode.F2)) {
            
            this.editorType = 1;
        }


        for(var i = 1 ; i <= 4 ; i++)
        {
            if(Input.getKeyDown(KeyCode[`Num` + i]))
            {
                this.writeFile();
                LevelEditor.levelMode = i;
                LevelEditor.lastEditorLevel = 0;
                LevelEditor.sceneCnfData = null;
                cc.director.loadScene("editor");
            }
        }

        
        if(this.selectedNode)
        {
            this.nameInput.string = this.selectedNode.getComponent(EditorElement).elementName;

            this.nodeX = this.selectedNode.x;
            this.nodeY = this.selectedNode.y;
            this.nodeR = this.selectedNode.angle;
            this.nodeW = this.selectedNode.width;
            this.nodeH = this.selectedNode.height;
            this.nodeSX = this.selectedNode.scaleX;
            this.nodeSY = this.selectedNode.scaleY;
            this.nodeEVT = this.selectedNode["evt"];

            this.xInput.string = this.nodeX.toString();
            this.yInput.string = this.nodeY.toString();
            this.rInput.string = this.nodeR.toString();
            this.widthInput.string = this.nodeW.toString();
            this.heightInput.string = this.nodeH.toString();
            this.sxInput.string = this.nodeSX.toString();
            this.syInput.string = this.nodeSY.toString();
            this.evtInput.string = this.nodeEVT.toString();

        }

        this.updateSceneData();

    }

    public updateSceneData()
    {

        LevelEditor.sceneData.playerPos = this.player.position;
        LevelEditor.sceneData.playerDirection = this.player.scaleX;

        LevelEditor.sceneData.barriers.length = this.barriers.length;

        for(var i = 0 ; i < this.barriers.length ; i++)
        {
            if(!LevelEditor.sceneData.barriers[i])
            {
                LevelEditor.sceneData.barriers[i] = [];
            }
            LevelEditor.sceneData.barriers[i][0] = this.barriers[i].getComponent(EditorElement).type;
            LevelEditor.sceneData.barriers[i][1] = this.barriers[i].x;
            LevelEditor.sceneData.barriers[i][2] = this.barriers[i].y;
            LevelEditor.sceneData.barriers[i][3] = this.barriers[i].angle;
            LevelEditor.sceneData.barriers[i][4] = this.barriers[i].width;
            LevelEditor.sceneData.barriers[i][5] = this.barriers[i].height;
            LevelEditor.sceneData.barriers[i][6] = this.barriers[i].scaleX;
            LevelEditor.sceneData.barriers[i][7] = this.barriers[i].scaleY;
            LevelEditor.sceneData.barriers[i][8] = this.barriers[i]["evt"];
            
        }
    }

    public testScene()
    {
        var levelConfigData:LevelConfigData = this.getLevelConfigDatas()[LevelEditor.lastEditorLevel - 1];
        GlobalDataManager.instance.mode = this.mode;
        GlobalDataManager.instance.levelConfigData = levelConfigData;//DataManager.instance.getPlayerData().levelConfigData;
        Loading.loadScene("game_single");
    }

    public readFile()
    {
        if(LevelEditor.sceneCnfData)
            return;

        if(CC_JSB)
        {

            var jsonStr = jsb.fileUtils.getStringFromFile(this.path + this.getFileName());

            cc.log("打开文件",this.path + this.getFileName());

            if(jsonStr)
            {
                LevelEditor.sceneCnfData = JSON.parse(jsonStr);
            }else
            {
                cc.log("文件不存在" + this.path + this.getFileName() + "  自动创建")
                LevelEditor.sceneCnfData = new SceneConfigData();
            }

        }else
        {
            if(!this.getSceneConfigData())
            {
                LevelEditor.sceneCnfData = new SceneConfigData();
            }else
            {
                cc.log("场景配置数据 ",this.getSceneConfigData());
                LevelEditor.sceneCnfData = this.getSceneConfigData();
            }
        }

        
        var arr = [];
        var r:number = Math.ceil(this.mapHeight / this.ceilheight);
        var c:number = Math.ceil(this.mapWidth / this.ceilWidth);

        for(var i= 0; i < r ; i++)
        {
            arr.push([]);

            for(var j = 0 ; j < c ; j++)
            {
                arr[i][j] = 0;
            }
        }

        var levelConfigDatas:LevelConfigData[] = this.getLevelConfigDatas();

        for(var i = 0 ; i < levelConfigDatas.length ; i++)
        {

            var filePath:string = this.editorFilePath + "Scene-" + levelConfigDatas[i].id + ".json";

            if(CC_JSB)
            {
                if(jsb.fileUtils.isFileExist(filePath))
                {
                    var cnf:string = jsb.fileUtils.getStringFromFile(filePath);
                    if(cnf)
                    {
                        LevelEditor.sceneCnfData.scemeDatas[levelConfigDatas[i].id] = JSON.parse(cnf);
                    }
                }
            }

            if(!LevelEditor.sceneCnfData.scemeDatas[levelConfigDatas[i].id])
            {
                LevelEditor.sceneCnfData.scemeDatas[levelConfigDatas[i].id] = new SceneData();
                LevelEditor.sceneCnfData.scemeDatas[levelConfigDatas[i].id].tileDataGrid = arr;
            }else
            {
                if(LevelEditor.sceneCnfData.scemeDatas[levelConfigDatas[i].id].playerPos == undefined)
                {
                    LevelEditor.sceneCnfData.scemeDatas[levelConfigDatas[i].id].playerPos = cc.Vec2.ZERO;
                }
            }

            if(CC_JSB)
            {
                var dataStr:string = JSON.stringify(LevelEditor.sceneCnfData.scemeDatas[levelConfigDatas[i].id]);

                if(!jsb.fileUtils.isFileExist(filePath))
                {
                    if(this.path,jsb.fileUtils.writeStringToFile(dataStr,filePath))
                    {
                        cc.log("保存新关卡数据",this.editorFilePath + filePath);
                    }
                }
            }
            
        }

        this.setSceneConfigdata(LevelEditor.sceneCnfData)

    }

    public writeFile()
    {

        var dataStr:string = JSON.stringify(LevelEditor.sceneCnfData);

        //cc.log("dataStr",dataStr);

        if(CC_JSB)
        {
            
            if(this.path,jsb.fileUtils.writeStringToFile(dataStr,this.path + this.getFileName()))
            {
                cc.log("保存数据",this.path + this.getFileName());
            }

            var scemeDatas = LevelEditor.sceneCnfData.scemeDatas;
            
            var filePath:string = this.editorFilePath + "Scene-" + LevelEditor.lastEditorLevel + ".json";
            var dataStr:string = JSON.stringify(scemeDatas[LevelEditor.lastEditorLevel]);
            if(this.path,jsb.fileUtils.writeStringToFile(dataStr,filePath))
            {
                //cc.log("保存关卡数据",this.editorFilePath + filePath);
            }

            /*for(var id in scemeDatas)
            {
                var filePath:string = this.editorFilePath + "Scene-" + id + ".json";
                var dataStr:string = JSON.stringify(scemeDatas[id]);

                if(this.path,jsb.fileUtils.writeStringToFile(dataStr,filePath))
                {
                    //cc.log("保存关卡数据",this.editorFilePath + filePath);
                }
            }*/
        }
    }

}
