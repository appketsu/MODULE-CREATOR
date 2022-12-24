import * as _ from 'lodash';
import $ from "jquery";
import View from './model/view/view';
import { BaseGridController } from './controller/baseGrid/baseGridController';
import { TestGrab } from './controller/testGrab';
import { AppInterface } from './model/base';
import { viewBaseGridHtml } from './view/baseGrid/baseGridView';
import { InsertedViewData } from './model/view/insertView';
import { Utils } from './model/utils';
import { ModuleManager } from './model/module/moduleManager';
import { testModuleString } from './model/module/testMoudle';
import { TestModalView } from './controller/testModalView';
import { minify } from "terser";
import { SocketsConnectionHandler } from './model/SocketsServer/SocketsConnectionHandler';
import { ConnectionChecker } from './model/SocketsServer/connectionChecker';
import { AutoSave } from './model/module/autoSave';
import { PopUpView } from './model/view/viewTemplates/popUpView';
import { NewProjectController } from './controller/popUpControllers/newProjectController';



export default class App implements AppInterface {


    views = new Map<string, View>(); // Holds all the active views references.

    utils = new Utils();

    moduleManager = new ModuleManager();

    sockets : SocketsConnectionHandler = new SocketsConnectionHandler();


    async start(){
        this.configApp();

        new BaseGridController("baseGrid",viewBaseGridHtml).setUp();
        let savedModule = this.moduleManager.getLocalStotrageModule() ?? this.moduleManager.getDefaultModule();

        if (window.mApp.moduleManager.getLocalStotrageModule() == undefined) {
            let newProjectView = new NewProjectController()
            newProjectView.disableExit();
            let popUp = PopUpView.showPopUpViewOnBody(newProjectView.id,false); 
        } else {
            this.moduleManager.loadNewModule(savedModule);

        }
        
        ConnectionChecker.shared.setUp();
        this.sockets.setUp(this.sockets.getCurrentIp());
        AutoSave.shared.start();
        
        //this.configApp()
        //new TestModalView(undefined,undefined).setUp();

    }

    configApp() {
        /*$("body").on("contextmenu", function(e) {
            return false;
        });*/
        /*window.onbeforeunload = function (e) {
            e = e || window.event;
        
            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = 'Sure?';
            }
        
            // For Safari
            return 'Sure?';
        };*/
    }


    getApp(): App {
        return this;
    }
}

