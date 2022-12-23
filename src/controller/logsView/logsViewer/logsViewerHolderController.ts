import GridElement from "../../../model/grid/gridElement";
import { MenuSelctor, MenuSelectorInterface } from "../../../model/menuSelector/ menuSelector";
import { MenuSelectorLayout2 } from "../../../model/menuSelector/menuSelectorLayout";
import { LogsParser, LogsParserInterface } from "../../../model/SocketsServer/logsParser";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { basicHtml } from "../../../view/defaultViews/basicHtml";
import { BaseGridController } from "../../baseGrid/baseGridController";
import { CurrentLog } from "./currentLog";
import { JSLogs } from "./jsLogs";


class LogsMenuSelectorLayout extends MenuSelectorLayout2 {

    styleCellsHolder(view:View) {
        view.style({
            "line-height": "1",
            "box-sizing": "border-box",
            "border-bottom" : "1px solid rgba(255,255,255,.1)",
            "padding-left" : "0.5rem",
            "background-color" : "#262626"
        })
    }


}




export class LogsViewerHolderController extends View implements MenuSelectorInterface, LogsParserInterface {


    menuSelector : string;



    constructor(id: string = window.mApp.utils.makeId(), html: string = basicHtml) {
        super(id,html)
        LogsParser.shared.logsInterfaces[this.id] = this;

    }



    viewWasInserted(): void {
        super.viewWasInserted()
        this.setUp();
    }



    setUp(): this {
        super.setUp();

        if (this.menuSelector == undefined) {
            this.getView(this.menuSelector)?.finish();
        }
        
        let view1 = new JSLogs();
        view1.viewName = "JS Logs"
        let view3 = new CurrentLog()
        view3.viewName = "Selected Log"

        let menuSelector = new MenuSelctor(window.mApp.utils.makeId(15),[view1.id,view3.id])
        this.menuSelector = menuSelector.id;
        menuSelector.interface = this;
        menuSelector.layout = new LogsMenuSelectorLayout();
        
        this.insertNewView(new InsertedViewData(menuSelector.id));

        menuSelector.selectByViewName("JS Logs")

        menuSelector.setConstraints({top:"0px",right : "0px", left: "0px",bottom: "0px"})

        return this;
    }




    menuSelectorWasSelected(viewId: string): void {
        if (this.getSize().height == 40) {
            (window.mApp.views.get("baseGrid") as BaseGridController).setLogsViewSize(400);
        }
    }

    showJSLogs() {
        let menu = this.getView(this.menuSelector) as MenuSelctor
        menu.selectByViewName("JS Logs")

    }


    showCurrentLog()  {
        let menu = this.getView(this.menuSelector) as MenuSelctor
        menu.selectByViewName( "Selected Log")
       
    }

    logsUpdated(): void {

    }

    logSelected(): void {
        this.showCurrentLog();
    }

    finish(): void {
        delete LogsParser.shared.logsInterfaces[this.id]
        super.finish();
    }
}