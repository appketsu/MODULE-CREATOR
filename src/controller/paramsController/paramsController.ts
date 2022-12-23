import { type } from "jquery";
import { isNumber, values } from "lodash";
import { UICollectionViewCell } from "../../model/collectionView/collectionViewCell";
import { ParamEditorCellController } from "../../model/settingCells/paramEditorCellController";
import { SettingsCellController } from "../../model/settingCells/settingsCellController";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { basicHtml } from "../../view/defaultViews/basicHtml";
import { RouteViewController } from "../routeView/routeViewController";
import $ from 'jquery'


export class ParamsContoller extends View {

    settingsController: string = "";
    jsonId: string;

constructor(jsonId:string,html: string = basicHtml) {
    super(window.mApp.utils.makeId(),html)
    this.setInsertDefaultViews();
    this.jsonId = jsonId;
}


viewWasInserted(): void {
    super.viewWasInserted()
    this.setUp();
}

setUp(): this {
    super.setUp()

    let routeView = new RouteViewController(window.mApp.utils.makeId(15),this.jsonId);

    this.insertNewView(new InsertedViewData(routeView.id));

    routeView.setConstraints({top:"0px",right : "0px", left: "0px",height:"40px"})
    
    let cells : UICollectionViewCell[] = [
   ];

    let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId);
    
    let object = moduleData?.getObject();
    let options = window.mApp.moduleManager.getModuleOptions();
    if (object == undefined) {
        return this;
    }

    if (moduleData?.jsonPath[0] == 'moduleInfo') {
        cells.push(new ParamEditorCellController("Project Name",
            undefined,
        options["projectName"] ?? "",false ,
        (value) =>{
            options["projectName"] = value
            Object.values(window.mApp.moduleManager.moduleViewsExecutor).forEach((el) =>  {
                el.moduleProjectNameChanged?.()});
        },() => {

        }))
    }

    let current = 0;

    for (const [key, value] of Object.entries(object)) {
        //console.log(`${key} ${value}`); 

        if (key.includes('moduleCreator')) {continue;}

        let mValue : string | number | boolean | string[] | undefined= undefined ;

        console.log(typeof value)


        if (typeof value == 'boolean') {
            mValue = value as boolean; 

        }

        if (typeof value == 'string') {
            mValue = value as string;
        }
 
        if (Array.isArray(value)) {
            let parsedArray = Array.from(value);
            if (parsedArray.length > 0 ) {
                if (typeof parsedArray[0] == 'string') {
                    mValue = parsedArray as string[];
                }
            } else {
                mValue = [] as string[]
            }
        }
        
        if (typeof value == 'number') {
            mValue = Number(value);
        }
        

        if (mValue == undefined) {
            continue;
        }


        cells.push(new ParamEditorCellController(key,
            undefined,
        mValue,current % 2 != 1 ,
        (value) =>{
            object[key] = value;
        },() => {

        }))
       
        current += 1;
      }

    let cellsIds: string[] = cells.map(el => el.id);

    let settingsController = new SettingsCellController(cellsIds);

    settingsController.interceptCollectionView = (cv) => {
        
        $(`[${cv.grid.getTag()}]`).addClass('border-bottom')
    }

    this.settingsController = settingsController.id;

    this.insertNewView(new InsertedViewData(settingsController.id));

    settingsController.setConstraints({top:"40px",right : "0px", left: "0px",bottom:"0px"})

    return this;
}




}