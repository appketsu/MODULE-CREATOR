import { javascript } from "@codemirror/lang-javascript";
import { MenuSelctor, MenuSelectorInterface} from "../../model/menuSelector/ menuSelector";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { javascriptControllerView } from "../../view/centerViews/javascriptControllerView";
import {  viewRequestController } from "../../view/centerViews/requestControllerView";
import { JavascriptController } from "./jsEditorController/javascriptController";
import { RouteViewController } from "../routeView/routeViewController";
import { DataRequestController } from "./dataRequestController/dataRequestController";
import { viewDataRequestController } from "../../view/centerViews/dataRequestControllerView";
import { ModuleData } from "../../model/module/moduleData";
import { RequestSettingsController } from "./dataRequestController/settingsController";



export class RequestController extends View implements MenuSelectorInterface {

    jsonId : string = "";

    constructor(id:string,jsonId:string,html:string = viewRequestController) {
        super(id,html)
        this.jsonId = jsonId;

        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews")
    }


    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();

       
    }


    setUp(): this { 
        super.setUp();

        let routeView = new RouteViewController(window.mApp.utils.makeId(15),this.jsonId);

        this.insertNewView(new InsertedViewData(routeView.id));

        routeView.setConstraints({top:"0px",right : "0px", left: "0px",height:"40px"})
        
        let view1 = new DataRequestController("view1",this.jsonId,viewDataRequestController);
        view1.viewName = "Request";
        let view2 = new JavascriptController(this.jsonId);
        view2.viewName = "Javascript";
        let view3 = new RequestSettingsController(this.jsonId);
        view3.viewName = "Settings";

        let menuSelector = new MenuSelctor(window.mApp.utils.makeId(15),[view1.id,view2.id,view3.id]);
        menuSelector.interface = this;
        
        this.insertNewView(new InsertedViewData(menuSelector.id));

        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let options = moduleData.getOptions();

        menuSelector.selectByViewName(options["openedMenu"]);

        menuSelector.setConstraints({top:"40px",right : "0px", left: "0px",bottom: "0px"})

        return this;
    }

    menuSelectorWasSelected(viewId: string): void {
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let options = moduleData.getOptions();
        options["openedMenu"] = this.getView(viewId)?.viewName ?? "";
    }

}