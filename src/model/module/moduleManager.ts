import { create, last, min } from "lodash";
import View from "../view/view";
import { ModuleSectionData } from "./moduleDataSection";
import { testModuleString } from "./testMoudle";
import { ModuleData } from "./moduleData";
import { ModuleManagerInterface } from "./interfaces";
import { parseModuleStructure } from "./moduleStructure";
import { Utils } from "../utils";
import { SocketMessage, SocketMessageCallback } from "../SocketsServer/SocketsConnectionHandler";
import { LogsParser, ModuleLogs } from "../SocketsServer/logsParser";
import { ModuleJavascriptGenerator } from "./jsGenerator";
import { LeftMenuSubMenuCellController } from "../../controller/leftMenu/subMenu/leftMenuSubMenuCellController";
import { LeftMenuSubMenuController } from "../../controller/leftMenu/subMenu/leftMenuSubMenuController";

export enum ModuleExecutionStatus {
    executing, 
    canceling,
    finished
}

export interface ModuleExecutionInterface {
    moduleExecutionUpdated() : void;
}

export class ModuleManager {

    moduleObject : any | undefined = undefined;

    moduleViewsExecutor: {[key:string] : ModuleManagerInterface } = {} 


    moudleParsed :  ModuleSectionData[] = [];

    moduleMap = new Map<string, ModuleData>();

    getModuleOptions(): any {
        // If the global options dont exist we create them.+

        if (this.moduleObject == undefined) {return {}}

        let defaultOptions : {[key:string] : any} = {
            "selected" : "",
            "notesData" : {
                "openedNotes" : ["oFwjzvDpdfxlaKQrGUwc"],
                "activeNote" : "oFwjzvDpdfxlaKQrGUwc",
                "notes" : {}
            },
            "hideViews" : [],
            "id" : window.mApp.utils.makeId(15),
            "projectName" : "New Project"
        }

        
        let options = this.moduleObject["moduleCreatorGlobalOptions"]

        if (options == undefined) {
            this.moduleObject["moduleCreatorGlobalOptions"] = defaultOptions;
        }

        for (var x of Object.keys(defaultOptions)) {
            if (this.moduleObject["moduleCreatorGlobalOptions"][x] == undefined) {
                this.moduleObject["moduleCreatorGlobalOptions"][x] = defaultOptions[x];
            }
        }

        return this.moduleObject["moduleCreatorGlobalOptions"];
    }

    getDebugModule() : string {
        let moduleDuplicate  = window.mApp.utils.deepCopy(this.moduleObject);
        let headerPaths = window.mApp.utils.getPathsThatMatchKey("moduleCreatorHeaderisActive",[],window.mApp.moduleManager.moduleObject);

        for (var path of headerPaths) {
            window.mApp.utils.deleteFromArray(path.length - 1,path);
            let headerObject = window.mApp.utils.getObjectFromPath(path,moduleDuplicate);
            if (!headerObject["moduleCreatorHeaderisActive"]) {
                headerObject["key"] = "";
                headerObject["value"] = "";
            }
        }

        let jsGenerator = new ModuleJavascriptGenerator();

        let moduleSections : ModuleSectionData[] = [];

        for (let current of Array.from(this.moduleMap.values())) {
            if (!(current instanceof ModuleSectionData)) {
                continue;
            }
            let fixed = current as ModuleSectionData;
            if (fixed.cells.length <= 0) {continue}
            if (!(fixed.cells[0] instanceof ModuleSectionData)) {
                if (fixed.cells[0].getObject()["request"] == undefined) {continue;}
                moduleSections.push(fixed);
            }
        }

        for (let moduleSectionData of moduleSections) {
            let previousModuleData : ModuleData | undefined = undefined;
            for (let x = 0; x < moduleSectionData.cells.length; x++) {

                let moduleData = moduleSectionData.cells[x];
                let currentOptions = moduleData.getOptions();
                let currentRequest = window.mApp.utils.getObjectFromPath(moduleData.jsonPath,moduleDuplicate) ;
                if (currentRequest?.javascriptConfig?.javaScript == undefined) {continue;}
                
                currentRequest.javascriptConfig.javaScript = jsGenerator.addJsIndicators(currentRequest.javascriptConfig.javaScript);

                if ((currentOptions?.async ?? false) == true) {
                    currentRequest.javascriptConfig.javaScript = jsGenerator.setAsync(currentRequest.javascriptConfig.javaScript);
                }

                if (moduleSectionData.cells.length == 1) {
                    currentRequest.javascriptConfig.javaScript = jsGenerator.setDebug(currentRequest.javascriptConfig.javaScript);
                }

                if (previousModuleData == undefined) { 
                    previousModuleData = moduleData;
                    continue; 
                }

                let previousRequest = window.mApp.utils.getObjectFromPath(previousModuleData?.jsonPath,moduleDuplicate);

                if (previousRequest?.javascriptConfig?.javaScript == undefined) {continue;}

                let generatedJs = jsGenerator.generateUpdatedJs(previousRequest.javascriptConfig.javaScript,btoa(JSON.stringify(currentRequest["request"] ?? "")),currentOptions.forceRequest ?? false,currentRequest?.javascriptConfig?.removeJavascript ?? false,currentRequest?.javascriptConfig?.loadInWebView ?? false);
                previousRequest.javascriptConfig.javaScript = generatedJs;
                previousRequest.javascriptConfig.javaScript = jsGenerator.setDebug(previousRequest.javascriptConfig.javaScript);
                if (x == moduleSectionData.cells.length - 1) {
                    currentRequest.javascriptConfig.javaScript = jsGenerator.setDebug(currentRequest.javascriptConfig.javaScript);
                }
                console.log(previousRequest.javascriptConfig.javaScript)
                previousModuleData = moduleData;
            }

        }

        return JSON.stringify(moduleDuplicate);
    }

    loadNewModule(module:string, projectName:string | undefined = undefined) {
        if (this.moduleObject != undefined) {
            let subMenu = window.mApp.views.get("leftMenuSubMenu");
            if (subMenu != undefined) {
                (subMenu as LeftMenuSubMenuController)?.viewWasSelected("leftSubMenuModule")
            }
        }
  
        
        for (var s of this.moudleParsed) {
            s.finish();
        }

        this.moduleObject = JSON.parse(module);

        this.parseModule(projectName);
    }

    moduleUpdatedJavascript() {
        // We need to get all the request arrays.
        // We need to go through all of them and in case is above the first one update the:
        // - Request : Force Request
        // - Add the KETSU_ASYNC variable
        // - Load in webview | Remove Scripts 
    }

    getDefaultModule() : string {
        return atob(testModuleString);
    }

    saveModuleToLocalStorage() {
        window.localStorage.setItem("savedModule",JSON.stringify(this.moduleObject));
    }

    getLocalStotrageModule() : string | undefined {
        return window.localStorage.getItem("savedModule") as string ?? undefined
    }
   
    exportModule() {
        let options = this.getModuleOptions();
        var jsonse = this.getDebugModule();
        var blob = new Blob([jsonse], {type: "application/json"});
        var url  = URL.createObjectURL(blob);
        
        var a = document.createElement('a');
        a.href        = url;
        a.download    = `${(options["projectName"] ?? "module").replace(" ","")}.json`;
        
        document.body.appendChild(a);

        a.click();

        // Remove anchor from body
        document.body.removeChild(a);
    }

    parseModule(projectName: string | undefined = undefined) {

        let isLoadedFirstTime = false;

        if (this.moduleObject["moduleCreatorGlobalOptions"] == undefined) {
            isLoadedFirstTime = true;
        }

        let options = this.getModuleOptions();

        if ( projectName != undefined) {
            options["projectName"] = projectName;
        }

        this.moudleParsed = window.mApp.utils.deepCopy(parseModuleStructure).filter((el) => {
            if (!(options["hideViews"] as Array<string>).includes(window.mApp.utils.deepCopy(el.jsonPath).pop() ?? "")) {return el}
        });
    

        for (var x of this.moudleParsed) {
            x.setUp(this.moduleObject);
        }

        if (isLoadedFirstTime) {
            this.disableOptionsFirstReadModules();
        }

        this.filterJavascriptFromRequests();

        Object.entries(this.moduleViewsExecutor).forEach( ([key, value]) => {
                
            value.moduleLoaded();

            }
        );
        
    }

    disableOptionsFirstReadModules() {

        let moduleSections : ModuleSectionData[] = [];

        for (let current of Array.from(this.moduleMap.values())) {
            if (!(current instanceof ModuleSectionData)) {
                continue;
            }
            let fixed = current as ModuleSectionData;
            if (fixed.cells.length <= 0) {continue}
            if (!(fixed.cells[0] instanceof ModuleSectionData)) {
                if (fixed.cells[0].getObject()["request"] == undefined) {continue;}
                moduleSections.push(fixed);
            }
        }

        for (let moduleSectionData of moduleSections) {
            for (let x = 0; x < moduleSectionData.cells.length; x++) {
                if (x == 0) {continue;}
                let moduleData = moduleSectionData.cells[x];
                let requestObject = moduleData.getObject();
                requestObject["javascriptConfig"]["removeJavascript"] = false
                requestObject["javascriptConfig"]["loadInWebView"] = false
            }
        }
    }

    filterJavascriptFromRequests() {
        let moduleSections : ModuleSectionData[] = [];

        for (let current of Array.from(this.moduleMap.values())) {
            if (!(current instanceof ModuleSectionData)) {
                continue;
            }
            let fixed = current as ModuleSectionData;
            if (fixed.cells.length <= 0) {continue}
            if (!(fixed.cells[0] instanceof ModuleSectionData)) {
                if (fixed.cells[0].getObject()["request"] == undefined) {continue;}
                moduleSections.push(fixed);
            }
        }

        for (let moduleSectionData of moduleSections) {
            for (let x = 0; x < moduleSectionData.cells.length; x++) {
                let moduleData = moduleSectionData.cells[x];
                let requestObject = moduleData.getObject();
                let js = requestObject?.javascriptConfig?.javaScript
                if (js != undefined) {
                    let regex = /\/\* JAVASCRIPT STARTS \*\/(?<result>(.|\n)*)\/\* JAVASCRIPT ENDS \*\//;
                    let found = js.match(regex)?.groups?.result;
                    if (found != undefined) {
                        requestObject["javascriptConfig"]["javaScript"] = found;
                    }
                }
            }
        }
    }


    moduleDataUpdated() {

        Object.entries(this.moduleViewsExecutor).forEach( ([key, value]) => {
                
            value.moduleDataUpdated?.();

            }
        );
    }


    executionStatus : ModuleExecutionStatus = ModuleExecutionStatus.finished;
    moduleExecutionInterfaces : {[key:string] : ModuleExecutionInterface} = {};
    currentExecutionId : string = "";

    cancelCurrentExecution() {
        this.executionStatus = ModuleExecutionStatus.canceling;
        this.updateModuleExecutionInterfaces();
        this.currentExecutionId = window.mApp.utils.makeId();
        let currentId = this.currentExecutionId;

        let message = {id:window.mApp.utils.makeId(),functionName :"CancelExecution",
        logs : LogsParser.shared.getModuleLogsToSend()
        ,sentCallback: false,completionCallback : false}

                
        let messageCallback =new SocketMessageCallback((data,error) => {
            if (error && currentId == this.currentExecutionId) {
                this.executionStatus = ModuleExecutionStatus.finished
                this.updateModuleExecutionInterfaces();
            }
        }, (data,error) => {
            if (currentId != this.currentExecutionId) {return}
            this.executionStatus = ModuleExecutionStatus.finished;
            this.updateModuleExecutionInterfaces();
            let logs = data["logs"] as ModuleLogs;
            if (logs == undefined) { return}
            LogsParser.shared.logsUpdated(logs);
        });
        window.mApp.sockets.sendMessage(message,messageCallback);
    }

    executeModule(route:string[]) {
        this.currentExecutionId = window.mApp.utils.makeId();
        let currentId = this.currentExecutionId;
        this.executionStatus = ModuleExecutionStatus.executing
        this.updateModuleExecutionInterfaces();
        let message = {id:window.mApp.utils.makeId(),functionName :"ExecuteModule",data: {
            moduleEncoded: this.getDebugModule(),
            executePath : route
        },
        logs : LogsParser.shared.getModuleLogsToSend()
        ,sentCallback: false,completionCallback : false}
        
        let messageCallback =new SocketMessageCallback((data,error) => {
            if (error && currentId == this.currentExecutionId) {
                this.executionStatus = ModuleExecutionStatus.finished
                this.updateModuleExecutionInterfaces();
            }
        }, (data,error) => {
            if (currentId != this.currentExecutionId) {return}
            this.executionStatus = ModuleExecutionStatus.finished;
            this.updateModuleExecutionInterfaces();
            let logs = data["logs"] as ModuleLogs;
            if (logs == undefined) { return}
            LogsParser.shared.logsUpdated(logs);
        })

        window.mApp.sockets.sendMessage(message,messageCallback);
    }

    updateModuleExecutionInterfaces() {
        for (let inter of Object.values(this.moduleExecutionInterfaces)) {
            inter.moduleExecutionUpdated();
        }
    }


}


