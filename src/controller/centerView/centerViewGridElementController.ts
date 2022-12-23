import GridElement from "../../model/grid/gridElement";
import { ModuleManagerInterface } from "../../model/module/interfaces";

import {EditorView, basicSetup} from "codemirror"
import {javascript,javascriptLanguage, scopeCompletionSource} from "@codemirror/lang-javascript"
import {autocompletion} from "@codemirror/autocomplete"
import { dracula } from "../../model/codeMirror/dracula";
import View from "../../model/view/view";
import { RequestController } from "../requestView/requestController";
import { InsertedViewData } from "../../model/view/insertView";
import $ from "jquery";
import { ParamsContoller } from "../paramsController/paramsController";


export interface CenterViewViewsIdentifier {
    pathMatches: string[],
    createView(moduleDataId:string) : View
}

export class CenterViewGridElementController extends GridElement implements ModuleManagerInterface  {

    currentModuleDataId : string = ""

    constructor(id:string,html?:string) {
        super(id,html)
        window.mApp.moduleManager.moduleViewsExecutor[this.id] = this;

        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews");
    }

   viewTypes : CenterViewViewsIdentifier[] = [
    {
        pathMatches : ["chapters"],
        createView(modulePartId) {
            return new RequestController(window.mApp.utils.makeId(15),modulePartId,"<div>hello world</div>")
        }
    }
   ]

    viewWasInserted() {
        this.setUp();
    }

    setUp(): this  {
        super.setUp();
 
        return this;
    }
    

    moduleLoaded(): void {
        // This will load the current selection as a new view.
        this.modulePartWasSelected(window.mApp.moduleManager.getModuleOptions()["selected"] ?? "")
    }


    moduleDataUpdated?(): void {
        // check if the data that has been removed is related to the current view.
        // If so we remove it from the view.

        if (window.mApp.moduleManager.moduleMap.get(this.currentModuleDataId) == undefined) {

            for (var x of this.insertedViews) {
                x.getView()?.finish();
            }
            return;
        }

    }
    
    modulePartWasSelected(jsonId: string) {
        // this function will load the current view.

        for (var x of this.insertedViews) {
            x.getView()?.finish();
        }

        if (jsonId == "") {return}

        this.currentModuleDataId = jsonId;

        //$(`[${this.id}]`).text(this.currentModuleDataId)

        let fixedPath = window.mApp.utils.deepCopy(window.mApp.moduleManager.moduleMap.get(this.currentModuleDataId)?.jsonPath ?? []).filter((el) => {
            if (window.mApp.utils.getNumberFromString(el) == undefined) return el
        }).join();

        let moduleData = window.mApp.moduleManager.moduleMap.get(jsonId);
        if (moduleData == undefined) {return}

        let isRequest = false;
        if (window.mApp.utils.getNumberFromString(moduleData.jsonPath[moduleData.jsonPath.length - 1]) != undefined) {
            isRequest = true;
        }

        let innerView : View | undefined = undefined;

        if (isRequest) {
            innerView = new RequestController(window.mApp.utils.makeId(15),jsonId);
        } else {
            innerView = new ParamsContoller(jsonId)
        }

        this.insertNewView(new InsertedViewData(innerView.id));

        innerView.setConstraints({top:"0px",bottom: "0px",left: "0px",right:"0px"})

    }

    finish() {
        super.finish()

    }
 
    
}


