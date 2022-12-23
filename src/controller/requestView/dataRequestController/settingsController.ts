import { UICollectionViewCell } from "../../../model/collectionView/collectionViewCell";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { basicHtml } from "../../../view/defaultViews/basicHtml";
import { ClickCellController } from "../../../model/settingCells/clickCellController";
import { SettingsCellController } from "../../../model/settingCells/settingsCellController";
import { TitleMessage } from "../../../model/interfaces";
import { sectionCellView } from "../../../view/settingsCells/sectionCellView";
import { SectionCellController } from "../../../model/settingCells/sectionCellController";
import { ModuleData } from "../../../model/module/moduleData";
import { UICollectionVievSectionCell } from "../../../model/collectionView/collectionViewSectionCell";
import { ModuleManagerInterface } from "../../../model/module/interfaces";
import $ from "jquery";


export class RequestSettingsController extends View implements ModuleManagerInterface {

    jsonId : string;

    constructor(jsonId:string,id:string = window.mApp.utils.makeId(),html: string = basicHtml) {
        super(id,html)
        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews")
        this.jsonId = jsonId;
        window.mApp.moduleManager.moduleViewsExecutor[this.id] = this;
    }

    viewWasInserted(): void {
        super.viewWasInserted();

        this.setUp();
    }

    setUp(): this {
        super.setUp();

        if (this.finished) {return this;}

        this.deleteSubviews();

        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        console.log(moduleData)
        if (moduleData == undefined) {
            return this;
        }
        let moduleObject = moduleData.getObject();

        if (moduleObject == undefined) {
            return this;
        }

        let moduleOptions = moduleData.getOptions();


        let cells : UICollectionViewCell[] = [

            new SectionCellController("Javascript Settings"),

            new ClickCellController({title: "Remove Scripts",message: "Loads the html website without executring the javascript, all the &lt;script&gt; tags become &lt;p&gt; tags. The loading time is faster if its enabled."},moduleObject?.javascriptConfig?.removeJavascript ?? false ,(selected) => {
                if (selected) {
                    moduleObject.javascriptConfig.loadInWebView = false;
                    //moduleOptions["async"] = false;
                }
                moduleObject.javascriptConfig.removeJavascript = selected;
                this.setUp();
                return true;
            }),

            new ClickCellController({title: "Load in WebView",message: "The javascript is injected on the website directly, loading times are slower because the website needs to load, if this option is enabled the *Remove Scripts* options wont work."},moduleObject?.javascriptConfig?.loadInWebView ?? false,(selected) => {
                moduleObject.javascriptConfig.loadInWebView = selected;
                if (selected) {
                    moduleObject.javascriptConfig.removeJavascript = false;
                }

                if (!selected) {
                    //moduleOptions["async"] = false;
                }
                this.setUp();
                return true;
            }),

        ];

        this.getRequestSettings().forEach((el) => {
            cells.push(el);
        })

        let settingsController = new SettingsCellController(cells.map((cell) => {
            return cell.id;
        }));

        if (this.finished ) {
            settingsController.finish();
            cells.forEach(el => el.finish())
            return this;
        }

        this.insertNewView(new InsertedViewData(settingsController.id,undefined));

        $(`[${settingsController.id}]`).addClass('bg-primary');

        settingsController.setConstraints({top: "0px",bottom: "0px",left: "0px",right: "0px"});

        return this;
    }

 


    getRequestSettings() : UICollectionViewCell[] {

        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let moduleOptions = moduleData.getOptions();
        let moduleObject = moduleData.getObject();
        let route = moduleData.jsonPath;
    

        let requestCells: UICollectionViewCell[] = [ new SectionCellController("Request Settings"),

        new ClickCellController({title: "Force Request",message: "Overrides the request data set on the javascript from the previous request to the one you set on this request tab. This option is usefull to do request to static urls."},moduleOptions?.forceRequest ?? false,(selected) => {
            moduleOptions["forceRequest"] = selected;
            return true;
        }),

        new ClickCellController({title: "Async Request",message: "Instead of finishing the request when the website loads, manually finish the request using the code below.<br><br>window.webkit.messageHandlers.EXECUTE_KETSU_ASYNC.postMessage('');"},moduleOptions?.async ?? false,(selected) => {
            moduleOptions["async"] = selected;
            if (selected) {
                //moduleObject.javascriptConfig.loadInWebView = true;
                //moduleObject.javascriptConfig.removeJavascript = false;
            }
            this.setUp();
            return true;
        }),
       ]

       if (route[route.length - 1] == '0') {
        return [requestCells[0], requestCells[2]];
    }

        return requestCells;
    }


    moduleLoaded(): void {

    }

    
    moduleDataUpdated?() {
        this.setUp();
    }


    finished = false;
    finish(): void {
        this.finished = true;
        delete window.mApp.moduleManager.moduleViewsExecutor[this.id];
        super.finish();
    }

}