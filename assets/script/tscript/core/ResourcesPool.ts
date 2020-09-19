
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
export default class ResourcesPool extends cc.Component {

    private static _instance: ResourcesPool;


    private trash:{[key:string]:any[]}={};

    public static get instance(): ResourcesPool {
        if(this._instance == null)
        {
            this._instance = new ResourcesPool();
            this._instance.init();
            
            typeof(this);
            
        }
        return ResourcesPool._instance;
    }

    private init()
    {
     
    }

    public put(recycle:Recycle,len:number = 100)
    {
        var key:string = recycle.getKey();

        if(!this.trash[key])
        {
            this.trash[key] = [];
        }
        
        if(this.trash[key].length < len)
        {
            recycle.sleep();
            this.trash[key].push(recycle);

        }else
        {
            if(recycle instanceof cc.Component)
            {
                (<cc.Component>recycle).node.destroy();
            }else if(recycle instanceof cc.Object)
            {
                (<cc.Object>recycle).destroy(); 
            }else
            {
            }
            //销毁
        }
    }

    public get<T extends Recycle>(type:Function | string):T
    {
        var key;
        
        if(typeof type === 'function')
        {
            //key = (<Function>type).name;
            key = (<any>type).name;
        }else
        {
            key = <string>type;
        }

        if(!this.trash[key] || this.trash[key].length == 0)
            return null;
            
        var obj:T = this.trash[key].shift();
        obj.awake();

        return obj;
    }

    public remove(type:Function | string)
    {
        var key;
        
        if(typeof type === 'function')
        {
            //key = (<Function>type).name;
            key = (<any>type).name;
        }else
        {
            key = <string>type;
        }

        if(this.trash[key])
        {
            var len:number = this.trash[key].length;

            for(var i = 0 ; i < len ; i++)
            {
                var obj:any = this.trash[key][i];

                if(obj instanceof cc.Component)
                {
                    (<cc.Component>obj).node.destroy();
                }else if(obj instanceof cc.Object)
                {
                    (<cc.Object>obj).destroy(); 
                }else
                {
                }
            }
        }
        
        this.trash[key] = null;

    }

}

export interface Recycle {

    getKey():string;
    awake();
    sleep();
    destroySelf();
    
}