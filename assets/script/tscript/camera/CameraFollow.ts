
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
export default class CameraFollow extends cc.Component {


    @property(cc.Camera)
    public camera:cc.Camera = null;

    public static instance:CameraFollow = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        CameraFollow.instance = this;
        //this.quake = this.camera.getComponent(Quake);
    }

    start () {

        
    }

     update (dt) 
     {

        
     }



}
