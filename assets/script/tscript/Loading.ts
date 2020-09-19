
import SoundManager from "./core/SoundManager";
import { BgSoundClipType } from "./audio/BgSoundClip";
import GlobalDataManager from "./core/GlobalDataManager";
import DataManager from "./core/DataManager";

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



export enum LoadingStatus
{
    /// <summary>
    /// 没有进行加载
    /// </summary>
    none = 0,
    /// <summary>
    /// 准备加载
    /// </summary>
    prepareLoading = 1,
    /// <summary>
    /// 加载中
    /// </summary>
    loading = 2,

    complete = 3,
}

@ccclass
export default class Loading extends cc.Component {


    public static status:LoadingStatus = LoadingStatus.none;

    public static sceneName:string = null;

    public static onError:Function = null;

    @property(cc.Sprite)
    bar: cc.Sprite = null;

    @property(cc.Label)
    progressTxt: cc.Label = null;

    public currentLoad:number = 0;

    public alreadyLoad:number = 0;

    private loadScale:number = 1;

    private totalLoad:number = 100;

    private isShowModal:boolean = false;

    private _progress: number = 0;
    public get progress(): number {
        return this._progress;
    }
    public set progress(value: number) {

        if(this._progress == value)
            return;

        this._progress = value;

        this.bar.fillRange = this._progress;
        this.progressTxt.string = Math.floor(this._progress * 100) + "%"

    }

    // LIFE-CYCLE CALLBACKS:


    /**
     * 加载场景
     * @param sceneName 
     */
    public static loadScene(sceneName)
    {
        if(this.status == LoadingStatus.loading)
            return;
        this.sceneName = sceneName;
        this.status = LoadingStatus.loading;
        cc.director.loadScene("loading");
    }

    /**
     * 重新加载当前场景
     */
    public static reloadScene()
    {
        this.status = LoadingStatus.none;
        this.loadScene(this.sceneName);
    }


    // onLoad () {}

    start () {

        if(SoundManager.instance)
        {
            SoundManager.instance.StopBgSound();
        }

        this.bar.fillRange = 0;

        this.currentLoad = 0;
        this.alreadyLoad = 5;

        if(Loading.sceneName)
        {
            Loading.status = LoadingStatus.loading;

            this.loadSceneRes(()=>
            {
                /*cc.director.preloadScene(Loading.sceneName,(error)=>{
                
                    if(!error)
                    {
                        Loading.status = LoadingStatus.complete;
                        this.alreadyLoad = this.totalLoad;
                        //cc.loader.onProgress = null;
                    }else
                    {
                        console.log("场景加载异常：sceneName",Loading.sceneName," error ",error);
    
                        this.showModal();
    
                        if(Loading.onError)
                        {
                            Loading.onError(error);
                            Loading.onError = null;
                        }
                    }
                });*/

                Loading.status = LoadingStatus.complete;
                this.alreadyLoad = this.totalLoad;
                this.loadScale = 2.5;

            });
    
            /*cc.loader.onProgress = (completeCount,totalCount,item)=>{
                //cc.log(" 进度 " ,completeCount,totalCount,item);
            }*/
        }



        this.scheduleOnce(()=>{

            if(Loading.status == LoadingStatus.loading || Loading.status == LoadingStatus.complete)
            {
                console.error("场景加载超时！");
                this.showModal();
            }

        },18);

    }

    private loadSceneRes(success:Function)
    {
        var loadingNextStep:number = 0;

        let sceneName: string = Loading.sceneName
        //let info = cc.director._getSceneUuid(sceneName);
        let info = cc.director["_getSceneUuid"](sceneName);
        if (info) {
            cc.director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            cc.loader.load({ uuid: info.uuid, type: 'uuid' }, (completedCount, totalCount, item) => {
                // cc.log("已完成Items:" + completedCount);
                // cc.log("全部Items:" + totalCount);
                // cc.log("当前Item:" + item.url);
                let curpro = Number((completedCount / totalCount).toFixed(10))
                if (curpro > loadingNextStep) {

                    loadingNextStep = curpro;
                    //cc.log("加载进度:" + loadingNextStep,curpro);
                    //this.Progress.progress = this._loadingNextStep
                }

            }, (error, asset) => {
                if (error) {
                    // cc.errorID(1210, this.sceneName, error.message);
                    //cc.director.loadScene("Loading"); //重新加载
                    Loading.reloadScene();
                } else {
                    cc.log("加载完成");
                    //cc.director.loadScene(sceneName)
                    success();
                }
            });
        }
    }

    private showModal()
    {
        if(this.isShowModal)
        {
            return;
        }

        this.isShowModal = true;

        /*GamePlatform.sdk.aldSdkSendEvent(`点击重新加载的人数`,{});

        GamePlatform.sdk.showModal({
            title: '警告',
            showCancel:false,
            confirmText:"确定",
            content: '游戏加载错误，请重试',//'游戏加载错误，请退出后重进',
            success:(res)=>
            {
                if (res.confirm)
                {
                    //window["wx"].exitMiniProgram({});
                    Loading.reloadScene();
                }else
                {
                    Loading.reloadScene();
                    //window["wx"].exitMiniProgram({});
                    //Loading.reloadScene();
                }
            }
        });*/

        console.log("游戏加载失败,尝试重新加载");

        Loading.reloadScene();

    }


    update (dt) 
    {

        if(this.currentLoad < this.alreadyLoad)
        {
            this.currentLoad += dt * (50 * (this.alreadyLoad - this.currentLoad) / this.totalLoad + 50) * this.loadScale;

            if(this.currentLoad >= this.alreadyLoad)
            {
                this.currentLoad = this.alreadyLoad;

                var limitLoad = this.totalLoad * 0.8;

                if(this.alreadyLoad < limitLoad)
                {
                    this.alreadyLoad = this.alreadyLoad + (limitLoad - this.alreadyLoad) * (Math.random() * 0.005);
                    
                    if(this.alreadyLoad > limitLoad)
                    {
                        this.alreadyLoad = limitLoad;
                    }
                }
                
            }

            this.progress = this.currentLoad / this.totalLoad;

            if(this.currentLoad >= this.totalLoad)
            {
                this.scheduleOnce(this.loadSceneComp,0.1);
            }

        }
    }

    loadSceneComp()
    {
        //cc.log("加载完成");
        cc.director.loadScene(Loading.sceneName,()=>{
            console.log("场景" + Loading.sceneName + "加载完成");
            Loading.status = LoadingStatus.none;
        });
    }

}
