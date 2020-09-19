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
export default class TabButton extends cc.Component {

    // LIFE-CYCLE CALLBACKS:


    @property(cc.Node)
    private normalFrame:cc.Node = null;

    @property(cc.Node)
    private selectedFrame:cc.Node = null;

    @property(cc.Boolean)
    private _selected: boolean = false;
    public get selected(): boolean {
        return this._selected;
    }
    public set selected(value: boolean) {

        if(value)
        {
            //this.node.emit("mousedown",this);
            this.normalFrame.active = false;
            this.selectedFrame.active = true;
            
           
        }else
        {
            this.normalFrame.active = true;
            this.selectedFrame.active = false;   
        }

        this._selected = value;
    }


    onLoad () 
    {
        this.selected = false;
    }

    /*start () {

    }*/

    

    // update (dt) {}
}
