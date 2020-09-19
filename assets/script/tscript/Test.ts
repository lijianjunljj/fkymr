
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
export default class Test extends cc.Component {



    @property(cc.Sprite)
    private sprite:cc.Sprite = null;


    @property(cc.Label)
    private label:cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

     onLoad () 
     {
        cc.director.getPhysicsManager().enabled = true;
        //cc.director.getPhysicsManager().debugDrawFlags = 1;
        //cc.director.getPhysicsManager().gravity = cc.Vec2.ZERO;
     }

    start () {

        this.sprite.getComponent(cc.RigidBody).applyForceToCenter(cc.v2(-5000),true);

        //this.sprite.getComponent(cc.RigidBody).applyTorque(50000,true);
        //this.sprite.getComponent(cc.RigidBody).linearVelocity = cc.v2(1000,0);
        //this.sprite.node.runAction(cc.rotateBy(2.5,360).repeatForever());
        //this.sprite.node.runAction(cc.moveBy(6,0,250));
        //this.getComponent(cc.Animation).play("splash");
        //this.getComponent(cc.Animation).stop();

        //this.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.tex,new cc.Rect(0,0,100,100),true,cc.v2(0,0),new cc.Size(100,100));


        //this.getComponent(cc.Sprite).spriteFrame.setTexture(this.tex,new cc.Rect(50,50,100,100))
        //this.getComponent(cc.Sprite).spriteFrame.setRect(new cc.Rect(0,0,100,100))



        /*for(var i= 0 ; i < 50 ; i++)
        {
            ResourcesManager.instance.load(`headIcon/${i+ 1}`,(spriteFrame:cc.SpriteFrame)=>{

                if(spriteFrame)
                {

                    this.sprite.spriteFrame = spriteFrame;
    
                    this.sprite.spriteFrame = spriteFrame;
                    
                    this.sprite.node.width = spriteFrame.getRect().width;
                    this.sprite.node.height = spriteFrame.getRect().height;
                    //this.skin.node.width = 500
    
                }
    
            },cc.SpriteFrame,true,false);

            ResourcesManager.instance.loadImage(`headIcon/${i+ 1}`,this.sprite,null,true,"prefab/");


        }*/


        //SplashScreen.instance.PlaySplash();
        //SplashScreen.instance.PlaySplashFadeOut();
        

        /*this.label.string = "乐发寿乐山大佛十六分上飞机了我"

        this.scheduleOnce(()=>{

            cc.log("begin",this.label.node.width,this.label.node.getContentSize().width);

            this.label.string = "乐发寿乐山大佛十六分上飞机了我"

            cc.log("end??",this.label.node.width,this.label.node.getContentSize().width);

        },0.01)*/
        
        

    }

     lateUpdate () 
     {
        //cc.log("lateUpdate ",this.label.node.width,this.label.node.getContentSize().width);
     }
}
