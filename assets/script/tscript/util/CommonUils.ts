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

@ccclass
export default class CommonUils {


     private static chNumArr:string[] = ["零","一","二","三","四","五","六","七","八","九"];

 

   public static getNodeWorldPos(node:cc.Node):cc.Vec2
   {
        if(node.parent == null)
        {
             return node.position;
        }

        var worldPos:cc.Vec2 = node.parent.convertToWorldSpaceAR(node.position);
        var pos = cc.v2(worldPos.x - cc.winSize.width * 0.5,worldPos.y - cc.winSize.height * 0.5);
        return pos;
   }

   public static getMouseCanvasPos(mousePos:cc.Vec2):cc.Vec2
   {
     var pos = cc.v2(mousePos.x - cc.winSize.width * 0.5,mousePos.y - cc.winSize.height * 0.5);
     return pos;
   }

   public static setParent(child:cc.Node,parent:cc.Node):void
    {
        if(child.parent == parent)
        {
            return;
        }

        if(child.parent && parent)
        {
            var worldPos:cc.Vec2 = child.parent.convertToWorldSpaceAR(child.position);
            var relaPos:cc.Vec2 = parent.convertToNodeSpaceAR(worldPos);
            child.parent = parent;
            child.position = relaPos;
        }else
        {
            child.parent = parent;
        }

    }

   public static converCHNumber(num:number):string
   {
     num = Math.floor(num);
     if(num < 0)
          num = 0;
     
     if(num > 9)
          num = 9;

     return this.chNumArr[num];
   }
   
}
