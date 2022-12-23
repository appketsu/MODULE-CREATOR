import { matches, values } from "lodash";
import { DropDown } from "../../../model/dropDownMenu/dropDown";
import { DefaultDropDownCell } from "../../../model/dropDownMenu/dropDownCell";
import { ElementModalPos, ElemModalDirection } from "../../../model/elementModalView/elementModalView";
import { NotificationData } from "../../../model/interfaces";
import { MenuSelctor,  MenuSelectorInterface} from "../../../model/menuSelector/ menuSelector";
import { MenuSelectorLayout2 } from "../../../model/menuSelector/menuSelectorLayout";
import { ModuleData } from "../../../model/module/moduleData";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { viewDropDownRequestType } from "../../../view/centerViews/dataRequestControllerView";
import { javascriptControllerView } from "../../../view/centerViews/javascriptControllerView";
import { NotificationView } from "../../notification";
import { RouteViewController } from "../../routeView/routeViewController";
import { JavascriptController } from "../jsEditorController/javascriptController";
import { HeadersView } from "./headersView";
import { HttpBodyView } from "./httpBodyView";
import $ from "jquery";
import { SettingsCellController } from "../../../model/settingCells/settingsCellController";
import { ParamEditorCellController } from "../../../model/settingCells/paramEditorCellController";


export class DataRequestController extends View implements MenuSelectorInterface {

    jsonId : string = "";

    constructor(id:string,jsonId:string,html?:string) {
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

        //let notification  = new NotificationView({message : `- This is a notification, this notification explains certain importan t stuff about differet things<br>- I dont know what to put on this line but its very important that is long afs.`})
        
        //this.insertNewView( new InsertedViewData(notification.id, new InsertedViewData(this.id,"$idnotification").getTag() ));


        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let moudleObject = moduleData.getObject();
        this.setMethod(moudleObject.request.method);

        $(`[${this.id}] #requesttype`).off().on('click', (el) => {
            el.preventDefault();
            el.stopImmediatePropagation();
            let modal = new DropDown();

            let requestMethods : string[] = ["GET","POST","HEAD","PUT","DELETE","CONNECT","OPTIONS","TRACE","PATCH"];
    
            requestMethods.forEach((method) => {
                let dropDownCell = new DefaultDropDownCell(method,undefined,undefined,true,viewDropDownRequestType);
                dropDownCell.viewWasInsertedCallback = (id) => {
                    $(`[${id}]`).addClass(["bg-t-contrary-hover"])
                }
                modal.addCell(dropDownCell,(index,dropwDown) => {
                    dropwDown.finish();
                    this.setMethod(method)
                })
            }) 

            modal.insertInto( new InsertedViewData(undefined,"body"))
            modal.setUpWithElement(0,10,
                ElementModalPos.center,
                ElemModalDirection.bottom,
                el.target,
                $(el.target).width())

        })

         $(`[${this.id}] .request-input`).val(moudleObject.request.url);

        $(`[${this.id}] .request-input`).off().on("input", (ev)=> {
            this.setUrl(($(`[${this.id}] .request-input`).val() as string) ?? "")
        })

        this.setUpSubViews();

        return this;
    }

    setUpSubViews() {
        let view1 = new HeadersView(this.jsonId);
        view1.viewName = "Headers"
        let view3 = new HttpBodyView(this.jsonId)
        view3.viewName = "Http Body"

        let views = [view1.id,view3.id];

        let search = this.getSearchSettings();
        if (search != undefined) {
            views.push(search);
        }

        let menuSelector = new MenuSelctor(window.mApp.utils.makeId(15),views)
        menuSelector.interface = this;
        menuSelector.layout = new MenuSelectorLayout2();
        
        this.insertNewView(new InsertedViewData(menuSelector.id));

        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let options = moduleData.getOptions();

        menuSelector.selectByViewName(options["openedRequestMenu"])

        menuSelector.setConstraints({top:"0px",right : "0px", left: "0px",bottom: "0px"})
    }

    getSearchSettings() : string | undefined {
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let moduleObject = moduleData.getObject();
        if (moduleObject?.separator == undefined) {return undefined} 
        if (moduleData.jsonPath.length < 2) { return undefined;}
        if (moduleData.jsonPath[0] == "search" && moduleData.jsonPath[1] == '0') {
            let settingsController = new SettingsCellController([
                new ParamEditorCellController("Searched Separator",undefined,moduleObject["separator"] ?? "",false, (value) => {
                    moduleObject["separator"] = value;
                },() => {

                }).id
            ])
            settingsController.viewName = "Search Parameters";
            settingsController.viewWasInsertedCallback = () => {
                $(`[${settingsController.id}]`).addClass('bg-primary')
            }

            settingsController.interceptCollectionView = (cv) => {
        
                $(`[${cv.grid.getTag()}]`).addClass('border-bottom')
            }

            return settingsController.id
        }
        return undefined
    }

    setMethod(method:string) {
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let moudleObject = moduleData.getObject();
        moudleObject.request.method = method;
        $(`[${this.id}] #requesttype`).text(method.toUpperCase());
    }

    setUrl(url: string) {
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let moudleObject = moduleData.getObject();
        moudleObject.request.url = url;
    }

    menuSelectorWasSelected(viewId: string): void {
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let options = moduleData.getOptions();
        options["openedRequestMenu"] = this.getView(viewId)?.viewName ?? "";
    }


    finish(): void {
        $(`[${this.id}] #requesttype`).off();
        $(`[${this.id}] .request-input`).off()
        super.finish();
    }

}