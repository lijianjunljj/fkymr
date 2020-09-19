import View from "../base/View";
import GameScene from "../../gamescene/GameScene";
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
export default class PassView extends View {

    @property(cc.Button)
    private passBtn:cc.Button = null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        //var gameScene:GameScene = GameManager.instance.gameScene;

        /*this.passBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.onCloseBtnClick(null);
            GameManager.instance.gameScene.gotoNextLevel();
         }, this);*/

         this.passBtn.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {

            this.onCloseBtnClick(null);
            GameManager.instance.gameScene.gotoNextLevel();
         });

    }
    // update (dt) {}
}
