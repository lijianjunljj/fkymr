import Loading from "./Loading";
import SystemManager from "./system/SystemManager";
import DataManager from "./core/DataManager";
import GlobalDataManager from "./core/GlobalDataManager";
import { GameMode } from "./core/GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Launch extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {


        Loading.loadScene("main");

    }


    
}
