import SelectView from "../base/SelectView";
import { OpenDataDomainType } from "../opendatadomain/OpenDataDomainView";
import RankView from "./RankView";

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
export default class RankSelectView extends SelectView {

    @property({type:cc.Enum(OpenDataDomainType)})
    private rankType:OpenDataDomainType = OpenDataDomainType.none;

    @property(RankView)
    private rankView:RankView = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}


    public awake()
    {
        this.rankView.init(this.rankType);
        super.awake();
    }

    public sleep()
    {
        super.sleep();
    }
}
