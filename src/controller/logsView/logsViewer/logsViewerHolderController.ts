import GridElement from "../../../model/grid/gridElement";
import { MenuSelctor, MenuSelectorInterface } from "../../../model/menuSelector/ menuSelector";
import { MenuSelectorLayout2 } from "../../../model/menuSelector/menuSelectorLayout";
import { LogsParser, LogsParserInterface } from "../../../model/SocketsServer/logsParser";
import { WindowExecutor } from "../../../model/module/windowExecutor";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { ButtonView } from "../../../model/view/viewTemplates/buttonView";
import { basicHtml } from "../../../view/defaultViews/basicHtml";
import { buttonView } from "../../../view/defaultViews/buttonView";
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
    loadInWindowButton : string;


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

        let buttonView = new ButtonView();
        this.loadInWindowButton = buttonView.id;
        this.insertNewView(new InsertedViewData(buttonView.id));

        buttonView.setImage('internet.png');
        buttonView.setConstraints({top:"0px",right : "0px",width : "40px", height: "40px"});
        buttonView.addClickListener( () => {
            let currentLog = LogsParser.shared.selectedLog;
            if (currentLog == undefined) {    return } 
            let content = LogsParser.shared.getLog(currentLog)?.content ?? "";
            if (content == "") {return}
            WindowExecutor.executeFromLog(content)

        })
        this.shouldDisplayLoadInWindow();
        return this;
    }

    shouldDisplayLoadInWindow() {
        let loadInWindowButton = this.getView(this.loadInWindowButton ?? "") as ButtonView
        if (loadInWindowButton == undefined) {return}
        let menuSelector = this.getView(this.menuSelector) as MenuSelctor;
        if (menuSelector == undefined) {
            loadInWindowButton.isHidden(true)
            return
        }
        let viewName = this.getView(menuSelector.selectedView)?.viewName ?? "";
        if (viewName != "Selected Log") {
            loadInWindowButton.isHidden(true)
            return
        }
        let currentLog = LogsParser.shared.selectedLog;
        if (currentLog == undefined) {
            loadInWindowButton.isHidden(true)
            return
        } 
        let currentLogAction = LogsParser.shared.getLog(currentLog)?.action ?? "";
        if (currentLogAction == 'Parsing Superficial Response' || currentLogAction == "Executing FixedHtml") {
            loadInWindowButton.isHidden(false)
        } else {
            loadInWindowButton.isHidden(true)
        }
        // if its on selected log
        // if the current log is either
    }


    menuSelectorWasSelected(viewId: string): void {
        this.shouldDisplayLoadInWindow();
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
        this.shouldDisplayLoadInWindow();
    }

    finish(): void {
        delete LogsParser.shared.logsInterfaces[this.id]
        super.finish();
    }
}