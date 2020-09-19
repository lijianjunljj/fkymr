import Vector2 from "../util/Vector2";

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

export class Input
{
    /**
     * 游戏从运行开始经历的时间
     */
    public static mousePosition:cc.Vec2 = cc.Vec2.ZERO;

    public static axis:cc.Vec2 = cc.Vec2.ZERO;

    /*public static getAxis(axisName:string):cc.Vec2
    {
        return this.axis;
    }*/

    /**
     * 获得键盘按键按下状态
     */
    public static getKeyDown(keyCode:KeyCode):boolean
    {
        if(Input.keyDic[keyCode] == KeyStatus.keyDown)
        {
            return true;
        }

        return false;
    }

    /**
     * 获得键盘按键按住状态
     */
    public static getKey(keyCode:KeyCode):boolean
    {
        if(Input.keyDic[keyCode] == KeyStatus.keyDown || Input.keyDic[keyCode] == KeyStatus.press)
        {
            return true;
        }

        return false;
    }

    /**
     * 获得键盘按键按并释放状态
     */
    public static getKeyUp(keyCode:KeyCode):boolean
    {
        if(Input.keyDic[keyCode] == KeyStatus.keyUp)
        {
            return true;
        }

        return false;
    }

    public static keyDic:{[key:number]:number} = {};

}

/**
 * 全局数据管理 跳场景传值用
 */
@ccclass
export default class InputManager extends cc.Component {

    private static _instance: InputManager;
    public static get instance(): InputManager {
        if(this._instance == null)
        {
            var node:cc.Node = new cc.Node("InputManager");
            cc.game.addPersistRootNode(node);
            this._instance = node.addComponent(InputManager);
            this._instance.init();
        }
        return this._instance;
    }

    private discardKeyList:number[] = [];

    private axisDir:cc.Vec2 = cc.Vec2.ZERO;

    private init()
    {

    }

    onLoad()
    {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;


        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start()
    {
        /*this.node.width = 5000;
        this.node.height = 5000;
        this.node.x = cc.winSize.width / 2;
        this.node.y = cc.winSize.height / 2;

        this.node.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>
        {
            event.bubbles = true;
            event.stopPropagation();
        
            cc.log("点击鼠标",event.getLocation());

        },this,false);*/

    }

    /**
     * 启动时间
     */
    public startup()
    {
        console.log("InputManager 启动输入管理");
        //cc.log("keycode?? ",cc.macro.KEY.num0,cc.macro.KEY.num1,cc.macro.KEY.num3)
    }

    private onKeyDown(event:cc.Event.EventKeyboard) 
    {
        var keyCode:number = event.keyCode;
    
        if(event.keyCode >= 48 && event.keyCode <= 57)
        {
            keyCode += 48;
        }

        if(!Input.keyDic[keyCode])
        {
            Input.keyDic[keyCode] = KeyStatus.keyDown;
        }
        
    }

    private onKeyUp(event:cc.Event.EventKeyboard) 
    {
        var keyCode:number = event.keyCode;
    
        if(event.keyCode >= 48 && event.keyCode <= 57)
        {
            keyCode += 48;
        }

        Input.keyDic[keyCode] = KeyStatus.keyUp;
    }


    update(dt:number)
    {
        this.axisDir = cc.Vec2.ZERO;

        if(Input.getKey(KeyCode.LeftArrow) || Input.getKey(KeyCode.A))
        {
            this.axisDir.x = -1;
        }

        if(Input.getKey(KeyCode.RightArrow) || Input.getKey(KeyCode.D))
        {
            this.axisDir.x = 1;
        }

        if(Input.getKey(KeyCode.UpArrow) || Input.getKey(KeyCode.W))
        {
            this.axisDir.y = 1;
        }

        if(Input.getKey(KeyCode.DownArrow) || Input.getKey(KeyCode.S))
        {
            this.axisDir.y = -1;
        }

        Input.axis = this.axisDir;

        

    }

    lateUpdate()
    {

        for(var i = 0 ; i < this.discardKeyList.length ; i++)
        {
            delete Input.keyDic[this.discardKeyList[i]];
        }

        this.discardKeyList.length = 0;

        for(var keyCode in Input.keyDic)
        {
            if(Input.keyDic[keyCode] == KeyStatus.keyDown)
            {
                Input.keyDic[keyCode] = KeyStatus.press;
            }

            if(Input.keyDic[keyCode] == KeyStatus.keyUp)
            {
                Input.keyDic[keyCode] = KeyStatus.none;
                this.discardKeyList.push(Number(keyCode));
            }
        }
    }

}

//if(!(cc.sys.platform == cc.sys.EDITOR_PAGE))
if(!CC_EDITOR)
{
    InputManager.instance.startup();//启动输入管理
}

export enum KeyStatus
{
    none,
    keyDown,
    press,
    keyUp,
}

export enum KeyCode
{
    None = 0,

    Space = 32,
    Enter = 13,
    Ctrl = 17,
    Alt = 18,
    Escape = 27,

    LeftArrow = 37,
    UpArrow = 38,
    RightArrow = 39,
    DownArrow = 40,

    A = 65,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    Q,
    R,
    S,
    T,
    U,
    V,
    W,
    X,
    Y,
    Z,

    F1 = 112,
    F2,
    F3,
    F4,
    F5,
    F6,
    F7,
    F8,
    F9,
    F10,
    F11,
    F12,

    Num0 = 96,
    Num1,
    Num2,
    Num3,
    Num4,
    Num5,
    Num6,
    Num7,
    Num8,
    Num9,

}


