
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 按钮类型
 */
export enum CBType {
    /**
     * 普通按钮
     */
    none,
    /**
     * 分享按钮
     */
    share,
    /**
     * 视频按钮
     */
    video,
}

@ccclass
export default class CustomButton extends cc.Component {

    /**
     * 设置按钮默认类型
     */
    @property({ type: cc.Enum(CBType), tooltip: "设置按钮默认类型" })
    public defaultType: CBType = CBType.none;


    onLoad() {

    }

    start() {


    }

}
