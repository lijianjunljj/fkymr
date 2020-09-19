import Player, { PlayerStatus, PlayerControlType } from "./Player";
import GameManager, { GameStatus, GameMode } from "../core/GameManager";
import Vector2 from "../util/Vector2";
import Mathf from "../util/Mathf";
import CommonUils from "../util/CommonUils";
import GameScene from "../gamescene/GameScene";


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
export default class PlayerController2 extends cc.Component {


    @property()
    private inverseAim:boolean = false;

    public player:Player = null;

    private startPos:cc.Vec2 = cc.Vec2.ZERO;

    private gameScene:GameScene = null;

    private throwForce:cc.Vec2 = cc.Vec2.ZERO;


    private canShoot:boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

        this.player = this.getComponent(Player);
        this.gameScene = GameManager.instance.gameScene;

        if(this.player.controlType != PlayerControlType.player2)
        {
            return;
        }

        var touchPlane:cc.Node = GameManager.instance.touchPlane;

        //this.startPos = cc.v2(this.player.node.x,-cc.winSize.height/2);
        this.startPos = cc.v2(this.player.node.x,this.player.node.y);

        touchPlane.on(cc.Node.EventType.TOUCH_START,(event:cc.Event.EventTouch)=>
        {
            if(GameManager.instance.gameStatus != GameStatus.start)
            {
                return;
            }

            //this.startPos = this.gameScene.node.convertToNodeSpaceAR(event.getLocation());
            //this.startPos = cc.v2(this.player.node.x,-cc.winSize.height/2);

            var currentPos = this.gameScene.node.convertToNodeSpaceAR(event.getLocation());
            /*var dir = currentPos.sub(this.startPos);
            var angle = Mathf.lerp(Math.atan2(dir.y,dir.x),Math.PI/2,0.5);
            
            currentPos.x = this.startPos.x + Math.cos(angle) * dir.mag();
            currentPos.y = this.startPos.y + Math.sin(angle) * dir.mag();*/

            if(Vector2.distance(this.startPos,currentPos) < 50)
            {
                this.player.clearDots();
                this.canShoot = false;
                return;
            }

            this.canShoot = true;

            if (this.inverseAim)
                this.throwForce = this.player.getForceFrom(this.startPos, currentPos).mul(-1);
            else
                this.throwForce = this.player.getForceFrom(this.startPos, currentPos);
                
            
            this.throwForce.mulSelf(0.5);

            this.player.updateTrajectory2(this.throwForce);

        });

        touchPlane.on(cc.Node.EventType.TOUCH_MOVE,(event:cc.Event.EventTouch)=>
        {
            if(GameManager.instance.gameStatus != GameStatus.start)
            {
                return;
            }

            var currentPos = this.gameScene.node.convertToNodeSpaceAR(event.getLocation());

            //var dir = currentPos.sub(this.startPos);
            //var angle = Mathf.lerp(Math.atan2(dir.y,dir.x),Math.PI/2,0.5);
            
            //currentPos.x = this.startPos.x + Math.cos(angle) * dir.mag();
            //currentPos.y = this.startPos.y + Math.sin(angle) * dir.mag();

            if(Vector2.distance(this.startPos,currentPos) < 50)
            {
                this.player.clearDots();
                this.canShoot = false;
                return;
            }

            this.canShoot = true;

            if (this.inverseAim)
                this.throwForce = this.player.getForceFrom(this.startPos, currentPos).mul(-1);
            else
                this.throwForce = this.player.getForceFrom(this.startPos, currentPos);

            this.throwForce.mulSelf(0.5);

            this.player.updateTrajectory2(this.throwForce);

        });

        touchPlane.on(cc.Node.EventType.TOUCH_END,(event:cc.Event.EventTouch)=>
        {
            if(GameManager.instance.gameStatus != GameStatus.start)
            {
                return;
            }

            if(!this.canShoot)
                return;
            
            this.player.throw(this.throwForce);
            this.player.clearDots();
        });

        touchPlane.on(cc.Node.EventType.TOUCH_CANCEL,(event:cc.Event.EventTouch)=>
        {
            if(GameManager.instance.gameStatus != GameStatus.start)
            {
                return;
            }

            if(!this.canShoot)
                return;

            this.player.clearDots();
        });
    }

    /*update (dt) 
    {

    }*/


}
