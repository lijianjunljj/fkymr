// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export default class LevelConfigData {

    /**
     * 数据id
     */
    public id:number = 1;

    /**
     * 大关卡
     */
    public level_max:number = 0;

    /**
     * 章节
     */
    public chapter:number = 0;

    /**
     * 小关卡
     */
    public level_min:number = 0;

    /**
     * 武器数量
     */
    public ammoCount:number = 0;

    /**
     * 三星条件
     */
    public tripleStar:number = 0;

    /**
     * 二星条件
     */
    public doubleStar:number = 0;

    /**
     * 一星条件
     */
    public singleStar:number = 0;

}
