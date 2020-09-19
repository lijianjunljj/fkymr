import DataManager from "../core/DataManager";
import LevelConfigData from "../configdata/LevelConfigData";
import { GameMode } from "../core/GameManager";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


/**
 * 玩家数据
 */
export default class PlayerData {

    /**
     * 玩了多少次游戏，用户每打开一次小程序统计一次
     */
    public playTimes:number = 0;

    /**
     * 大关卡
     */
    public level_max:number = 1;

    /**
     * 小关卡
     */
    public level_min:number = 1;

    /**
     * 模式2大关卡
     */
    public level_max2:number = 1;

    /**
     * 模式2小关卡
     */
    public level_min2:number = 1;

    /**
     * 模式3大关卡
     */
    public level_max3:number = 1;

    /**
     * 模式3小关卡
     */
    public level_min3:number = 1;

    /**
     * 模式4大关卡
     */
    public level_max4:number = 1;

    /**
     * 模式4小关卡
     */
    public level_min4:number = 1;

    
    /**
     * 关卡状态 0：未解锁，1：1星，2：2星，3：3星
     */
    public levelStateArr:number[] = [];

    /**
     * 模式2关卡状态 0：未解锁，1：1星，2：2星，3：3星
     */
    public levelStateArr2:number[] = [];

    /**
     * 模式3关卡状态 0：未解锁，1：1星，2：2星，3：3星
     */
    public levelStateArr3:number[] = [];

    /**
     * 模式4关卡状态 0：未解锁，1：1星，2：2星，3：3星
     */
    public levelStateArr4:number[] = [];

    /**
     * 玩家体力值
     */
    public energy:number = 15;

    /**
     * 玩家得分 (胜利场次)
     */
    public score:number = 0;

    /**
     * 登录天数
     */
    public logindays:number = 0;

    /**
     * 角色id
     */
    public roleId:number = 1000;

    /**
     * 武器Id
     */
    public weaponId:number = 2000;


    /**
     * 玩游戏的次数
     */
    public gameTimes: number = 0;

    /**
     * 完成游戏的次数
     */
    public compGameTimes: number = 0;

    /**
     * 分享游戏次数
     */
    public shareTimes: number = 0;

    /**
     * 看视频次数
     */
    public videoTimes: number = 0;

    /**
     * 邀请好友次数，每成功邀请一个算一次
     */
    public inviteFriendTimes: number = 0;

    public signInDay:number = 1;
    public signInStates:number[] = [0,0,0,0,0,0,0];

    public get totalStar():number
    {
        var star:number = 0;

        for(var i = 1 ; i <= 2 ; i++)
        {
            star += this.getTotalStar(i);
        }

        return star;
    }

    public init()
    {

    }

    public reset()
    {
        this.shareTimes = 0;
        this.videoTimes = 0;
    }

    public getLevelConfigData(mode:GameMode)
    {

        var level_max:number = 0;
        var level_min:number = 0;

        if(mode == GameMode.mode1)
        {
            level_max = this.level_max;
            level_min = this.level_min;

        }else if(mode == GameMode.mode2)
        {
            level_max = this.level_max2;
            level_min = this.level_min2;

        }else if(mode == GameMode.mode3)
        {
            level_max = this.level_max3;
            level_min = this.level_min3;

        }else if(mode == GameMode.mode4)
        {
            level_max = this.level_max4;
            level_min = this.level_min4;
        }

        return DataManager.instance.getLevelConfigData(mode,level_max,level_min);
    }

    public getTotalStar(mode:GameMode)
    {

        var levelStateArr = this.levelStateArr;

        if(mode == GameMode.mode1)
        {
            levelStateArr = this.levelStateArr;
        }else if(mode == GameMode.mode2)
        {
            levelStateArr = this.levelStateArr2;
        }else if(mode == GameMode.mode3)
        {
            levelStateArr = this.levelStateArr3;

        }else if(mode == GameMode.mode4)
        {
            levelStateArr = this.levelStateArr4;
        }

        var star:number = 0;
        var len:number = levelStateArr.length;

        for(var i = 0 ; i < len ; i++)
        {
            if(levelStateArr[i])
            {
                star += levelStateArr[i];
            }
        }

        return star;
    }

    public getLevelState(mode:GameMode,levelId:number):number
    {
        var levelStateArr = this.levelStateArr;

        if(mode == GameMode.mode1)
        {
            levelStateArr = this.levelStateArr;
        }else if(mode == GameMode.mode2)
        {
            levelStateArr = this.levelStateArr2;
        }else if(mode == GameMode.mode3)
        {
            levelStateArr = this.levelStateArr3;
        }else if(mode == GameMode.mode4)
        {
            levelStateArr = this.levelStateArr4;
        }

        var lvcnfdata:LevelConfigData = DataManager.instance.getLevelConfigDatas(mode)[levelId - 1];
        if(!lvcnfdata || !levelStateArr[lvcnfdata.id - 1])
        {
            return 0; 
        }

        return levelStateArr[lvcnfdata.id - 1];
    }

    public setLevelState(mode:GameMode,levelId:number,state:number):void
    {

        var levelStateArr = this.levelStateArr;

        if(mode == GameMode.mode1)
        {
            levelStateArr = this.levelStateArr;
        }else if(mode == GameMode.mode2)
        {
            levelStateArr = this.levelStateArr2;
        }else if(mode == GameMode.mode3)
        {
            levelStateArr = this.levelStateArr3;
        }else if(mode == GameMode.mode4)
        {
            levelStateArr = this.levelStateArr4;
        }

        if(!levelStateArr[levelId - 1])
        {
            levelStateArr[levelId - 1] = state;
        }else
        {
            if(levelStateArr[levelId - 1] < state)
            {
                levelStateArr[levelId - 1] = state;
            }
        }

        //GamePlatform.sdk.setUserRankStorage("totalStar",this.totalStar);
    }

    public setLevel(mode:GameMode,level_max,level_min)
    {
        if(mode == GameMode.mode1)
        {
            this.level_max = level_max;
            this.level_min = level_min;

        }else if(mode == GameMode.mode2)
        {
            this.level_max2 = level_max;
            this.level_min2 = level_min;

        }else if(mode == GameMode.mode3)
        {
            this.level_max3 = level_max;
            this.level_min3 = level_min;
        }else if(mode == GameMode.mode4)
        {
            this.level_max4 = level_max;
            this.level_min4 = level_min;
        }
        
    }
    
    public addEnergy(value:number)
    {
        //this.energy = Mathf.clamp(this.energy + value,0,10)
        var diffvalue:number = 15 - this.energy;
        if(diffvalue >= 0)
        {
            this.energy += value > diffvalue ? diffvalue : value;
        }else
        {
            if(value < 0)
            {
                this.energy += value;
            }
        }

        if(this.energy < 0)
        {
            this.energy = 0;
        }

    }

    public addScore(value: number) {
        this.score += value;
    }

    public addCompGameTimes() {
        this.compGameTimes++;
    }

    public addShareTimes() {
        this.shareTimes++;
    }

    public addVideoTimes() {
        this.videoTimes++;
    }

    public addInviteFriendTimes() {
        this.inviteFriendTimes++;
    }
}

