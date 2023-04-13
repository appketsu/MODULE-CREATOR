import { ModuleManagerInterface } from "../../model/module/interfaces";
import { ModuleExecutionInterface, ModuleExecutionStatus, ModuleManager } from "../../model/module/moduleManager";
import { LogsParser, ModuleLogs } from "../../model/SocketsServer/logsParser";
import { SocketMessageCallback, SocketMessage } from "../../model/SocketsServer/SocketsConnectionHandler";
import View from "../../model/view/view";
import { PopUpView } from "../../model/view/viewTemplates/popUpView";
import { viewRoute } from "../../view/centerViews/routeView";
import { BaseGridController } from "../baseGrid/baseGridController";
import { JSLogs } from "../logsView/logsViewer/jsLogs";
import { LogsViewerHolderController } from "../logsView/logsViewer/logsViewerHolderController";
import { ConnectSocketController } from "../popUpControllers/connectSocketController";
import {Spinner} from 'spin.js'
import $ from "jquery";
import { DropDown } from "../../model/dropDownMenu/dropDown";
import { DefaultDropDownCell } from "../../model/dropDownMenu/dropDownCell";
import { InsertedViewData } from "../../model/view/insertView";
import { viewDropDownRequestType } from "../../view/centerViews/dataRequestControllerView";
import { ElemModalDirection, ElementModalPos } from "../../model/elementModalView/elementModalView";
import { viewDefaultDropDownCell } from "../../view/defaultViews/defaultDropDownCellView";
import { WindowExecutor } from "../../model/module/windowExecutor";
import { KeyCodesInterface, KeyShortcuts, keyCodesManager } from "../../model/keyCodesShortcouts/keyCodesManager";


export class RouteViewController extends View implements ModuleManagerInterface,ModuleExecutionInterface,KeyCodesInterface {

    jsonId : string = "";
    

    spinner?: Spinner;
    spinnerOptions  = {
        lines: 9, // The number of lines to draw
        length: 38, // The length of each line
        width: 17, // The line thickness
        radius: 30, // The radius of the inner circle
        scale: 0.1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#ffffff', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
      };
      

    constructor(id:string,jsonId:string,html:string = viewRoute) {
        super(id,html)
        this.jsonId = jsonId;
        window.mApp.moduleManager.moduleViewsExecutor[this.jsonId] = this;
        window.mApp.moduleManager.moduleExecutionInterfaces[this.id] = this;
        keyCodesManager.shared.delegates[this.id] = this;

    }


    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();
        let el = document.querySelector(`[${this.id}] .spinner-holder`) as HTMLElement
        if (el != undefined)  {
            this.spinner = new Spinner(this.spinnerOptions).spin(el);
            //this.spinner.spin();
        }

    }
 

    setUp(): this {
        super.setUp();

        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId);
        $(`[${this.id}] .sub-menu`).off().on('click' , (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            return
            let modal = new DropDown();

            let dropDownCell = new DefaultDropDownCell("Execute in iframe",undefined,undefined,true,viewDefaultDropDownCell);
            dropDownCell.viewWasInsertedCallback = (id) => {
                $(`[${id}] .title`).addClass([ "fw-medium", "fs-callout", "tc-t-primary"])


                $(`[${id}]`).addClass(["bg-accent-alpha","bg-accent-hover", "pointer" ])
            }
            modal.addCell(dropDownCell,(index,dropwDown) => {
                WindowExecutor.executeFromModuleData(moduleData)
                dropwDown.finish();
            })
            modal.insertInto( new InsertedViewData(undefined,"body"))
           let frame = window.mApp.utils.getFrameFromElement(document.querySelector(`[${this.id}] .execute-button`)!)
            modal.generalSetUp(0,0,  
                ElementModalPos.center,
                ElemModalDirection.bottom,
                {x: frame.x,y : frame.y,width: frame.width + 30, height: 40}
                );
      
        })

        $(`[${this.id}] .execute-button`).off().on('click' , (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            this.didClickExecute()

        });


        $(`[${this.id}] .route`).html("")


        // BUTTON
        if (window.mApp.utils.getNumberFromString(moduleData?.jsonPath[(moduleData?.jsonPath ?? []).length -1] ?? "") == undefined) {
            $(`[${this.id}] .execute-button`).css({"display": "none"})
            $(`[${this.id}] .sub-menu`).css({"display": "none"})

        }


        this.updateButtonStatus()
        this.showHideExtendButton();

        // ROUTE 
        let pathString = '<div class="r-text">$name</div>'
        let separator = '<div class="r-separator">/</div>'
        let finalHtml = ""

        for (var x = 0; x < (moduleData?.jsonPath ?? []).length; x++) {
            let current = window.mApp.utils.capitalizeFirstLetter(moduleData?.jsonPath[x] ?? "");
            if (current == ""){continue;}
            finalHtml+= pathString.replace('$name',current);
            if (x < (moduleData?.jsonPath ?? []).length - 1) {
                finalHtml += separator;
            }
        }

        $(`[${this.id}] .route`).html(finalHtml)

        return this;
    }


    didClickExecute() {
        if (!window.mApp.sockets.isConnected()) {

            let popUp = PopUpView.showPopUpViewOnBody(new ConnectSocketController(() => {
                this.didClickExecute()
            }).id); 
            
            return;
           }

           if (window.mApp.moduleManager.executionStatus == ModuleExecutionStatus.executing) {
            window.mApp.moduleManager.cancelCurrentExecution();
            return
           }
           
           if ((window.mApp.views.get("LogsViewerHolderController") as LogsViewerHolderController).getSize().height == 40) {
            (window.mApp.views.get("baseGrid") as BaseGridController).setLogsViewSize(400);
           }
           window.mApp.moduleManager.executeModule(this.getExecuteRoute())
    }

    updateButtonStatus() {

        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId);

        let section = moduleData?.getSection()?.getSection();

        if (section == undefined) {
            section = moduleData?.getSection();
        }

        let status = window.mApp.moduleManager.executionStatus;
        
        switch (status) {
            case ModuleExecutionStatus.finished:
                $(`[${this.id}] .title`).text(`Execute ${section?.options?.name}`)
                this.stopLoading();
                break;
        
            case ModuleExecutionStatus.executing:
                $(`[${this.id}] .title`).text('Cancel')
                this.startLoading();

                break;

            case ModuleExecutionStatus.canceling:
                $(`[${this.id}] .title`).text('Canceling...')
                this.startLoading()
                break;
        }
    }

    showHideExtendButton() {
        $(`[${this.id}] .route-view`).css({"grid-template-columns" : "auto  min-content 0px"})
        return

        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId);
        let object = moduleData?.getObject();
        console.log(object)
        if (object?.javascriptConfig?.loadInWebView ?? false){
            $(`[${this.id}] .route-view`).css({"grid-template-columns" : "auto  min-content 25px"})
        } else {
            $(`[${this.id}] .route-view`).css({"grid-template-columns" : "auto  min-content 0px"})
        }
        //if (options)

        /*
        .route-view {
            display:  grid;
            grid-auto-flow: column;
            grid-template-columns: auto  min-content 25px;
        */


    }

    startLoading() {
        $(`[${this.id}] .execute-button`).addClass("loading")
        //this.spinner?.spin();
        
    }

    stopLoading() {
        $(`[${this.id}] .execute-button`).removeClass("loading")

    }

    getExecuteRoute() : string[] {
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId);
        let path = moduleData?.jsonPath ?? undefined;
        if (path == undefined) {return []}
        if (path.length > 2) {
            return [path[0], path[1]]
        } else {
            return [path[0]];
        }
    }

    moduleExecutionUpdated(): void {
        this.updateButtonStatus();
    }


    moduleLoaded(): void {

    }


    moduleDataUpdated?() {
        this.setUp();
    }

    keyCombinationExecuted(shortcut: KeyShortcuts): void {
        if (shortcut == KeyShortcuts.executeModule && !ConnectSocketController.socketsIsOnView) {
            this.didClickExecute()
        }
    }


    finish(): void {
        delete  window.mApp.moduleManager.moduleViewsExecutor[this.jsonId];
        delete window.mApp.moduleManager.moduleExecutionInterfaces[this.id];
        this.spinner?.stop();
        this.spinner = undefined;
        delete keyCodesManager.shared.delegates[this.id]
        $(`[${this.id}] .execute-button`).off();
        super.finish()
    }
  

}