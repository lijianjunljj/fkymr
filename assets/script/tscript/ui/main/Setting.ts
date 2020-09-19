
import SoundManager from "../../core/SoundManager";

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
export default class Setting extends cc.Component {

    static switch1:boolean = true;
    static switch2:boolean = true;
    static switch3:boolean = true;

    @property(cc.Button)
    openBtn1: cc.Button = null;

    @property(cc.Button)
    closeBtn1: cc.Button = null;

    @property(cc.Button)
    openBtn2: cc.Button = null;

    @property(cc.Button)
    closeBtn2: cc.Button = null;

    @property(cc.Button)
    openBtn3: cc.Button = null;

    @property(cc.Button)
    closeBtn3: cc.Button = null;

    
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.openBtn1.node.active = !Setting.switch1;
        this.openBtn2.node.active = !Setting.switch2;
        this.openBtn3.node.active = !Setting.switch3;

        this.closeBtn1.node.active = Setting.switch1;
        this.closeBtn2.node.active = Setting.switch2;
        this.closeBtn3.node.active = Setting.switch3;
    }

    start () {

        this.openBtn1.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
           this.openBtn1.node.active = false;
           this.closeBtn1.node.active = true;
           
           Setting.switch1 = true;

        },this);

        this.closeBtn1.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            this.openBtn1.node.active = true;
            this.closeBtn1.node.active = false;

            Setting.switch1 = false;

        },this);

        this.openBtn2.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            this.openBtn2.node.active = false;
            this.closeBtn2.node.active = true;

            Setting.switch2 = true;

            SoundManager.instance.ResumeBgSound();

        },this);

        this.closeBtn2.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            this.openBtn2.node.active = true;
            this.closeBtn2.node.active = false;

            Setting.switch2 = false;

            SoundManager.instance.PauseBgSound();
        },this);

        this.openBtn3.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            this.openBtn3.node.active = false;
            this.closeBtn3.node.active = true;

            Setting.switch3 = true;

            SoundManager.instance.ResumeClipSound();
        },this);

        this.closeBtn3.node.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            this.openBtn3.node.active = true;
            this.closeBtn3.node.active = false;

            Setting.switch3 = false;

            SoundManager.instance.PauseClipSound();
        },this);

        

    }

    // update (dt) {}
}
