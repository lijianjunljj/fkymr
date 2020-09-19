
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
export default class RankItem extends cc.Component {


    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Sprite)
    headIcon: cc.Sprite = null;

    @property(cc.Label)
    rankTxt: cc.Label = null;

    @property(cc.Label)
    nameTxt: cc.Label = null;

    @property(cc.Label)
    valueTxt: cc.Label = null;

    @property(cc.SpriteFrame)
    goleImg:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    silverImg:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    copperImg:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bgImg1:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bgImg2:cc.SpriteFrame = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    public setData(rankId:number,data:any)
    {
        if(!data)
        {
            return;
        }

        var value = data.score;

        this.rankTxt.string = rankId.toString();
        this.nameTxt.string = "" + data.name == "" ? "游客" : data.name;
        this.valueTxt.string = "" + value;

        var avatarUrl:string = data.img;

        /*var avatarUrl:string = data.img;
        var index = avatarUrl.lastIndexOf("/");
        avatarUrl = avatarUrl.substring(0,index + 1) + 46 + "?aaa=aa.jpg";

        cc.loader.load(avatarUrl,(err,texture)=>
        {
            this.headIcon.spriteFrame.setTexture(texture);
        });*/
    }

    public setBg(type:number)
    {
        if(type == 0)
        {
            this.bg.spriteFrame = this.bgImg1;
        }else
        {
            this.bg.spriteFrame = this.bgImg2;
        }
        
    }

    public setRankIcon(index:number)
    {
        if(index == 1)
        {
            this.icon.node.active = true;
            this.icon.spriteFrame = this.goleImg;
            this.rankTxt.node.active = false;
        }else if(index == 2)
        {
            this.icon.node.active = true;
            this.icon.spriteFrame = this.silverImg;
            this.rankTxt.node.active = false;
        }else if(index == 3)
        {
            this.icon.node.active = true;
            this.icon.spriteFrame = this.copperImg;
            this.rankTxt.node.active = false;
        }else
        {
            this.icon.node.active = false;
            this.rankTxt.node.active = true;
            this.rankTxt.string = index.toString();
        }
    }

    // update (dt) {}
}
