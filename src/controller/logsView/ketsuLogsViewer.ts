import { cond } from "lodash";
import { UICollectionView } from "../../model/collectionView/collectionView";
import { UICollectionViewCell } from "../../model/collectionView/collectionViewCell";
import GridElement, { GridElementWithView } from "../../model/grid/gridElement";
import MRsesizeObserver from "../../model/ResizeObserver/mResizeObserver";
import { ResizeConditions, ResizeObserverInterface } from "../../model/ResizeObserver/resizeObserverInterfaces";
import { LogsParser, LogsParserInterface } from "../../model/SocketsServer/logsParser";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { KetsuLogsViewerView } from "../../view/bottomViews/KetsuLogsViewerController";
import { basicHtml } from "../../view/defaultViews/basicHtml";
import { BaseGridController } from "../baseGrid/baseGridController";
import { ClickCellController } from "../../model/settingCells/clickCellController";
import { JSLogsCellController } from "../../model/settingCells/jsLogsCellController";
import { LogsCellController } from "../../model/settingCells/logsCellController";
import { SectionCellController } from "../../model/settingCells/sectionCellController";
import { SettingsCellController } from "../../model/settingCells/settingsCellController";
import { LogsGridController } from "./logsGridController";
import $ from "jquery";
import { BottomStatusController } from "../bottomStatusBar/bottomStatusController";



export class KetsuLogsViewerController extends View implements ResizeObserverInterface, LogsParserInterface {


    resizeObserver? : MRsesizeObserver;
    currentConditionName : string;
    settingsController: string = "";

    constructor(id: string = window.mApp.utils.makeId(), html: string = KetsuLogsViewerView) {
        super(id,html)
        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews")
        LogsParser.shared.logsInterfaces[this.id] = this

    }
 

    viewWasInserted(): void {
        super.viewWasInserted()
        this.resizeObserver = new MRsesizeObserver(new InsertedViewData(this.id,undefined),
         [{name:"small",condition(newSize) {
             if (newSize.blockSize <= 41  ) {
                return true;
             } else {
                return false
             }
         }},
         {name:"big",condition(newSize) {
            if (newSize.blockSize >= 50 && newSize.inlineSize > 100) {
               return true;
            } else {
               return false
            }
        }},
        {name:"closed",condition(newSize) {
           if (newSize.inlineSize <= 100) {
              return true;
           } else {
              return false
           }
       }}])
         this.resizeObserver.interface = this;
         this.resizeObserver.triggerManually();

         $(`[${this.id}] .button`).on('click', (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            if (this.currentConditionName == "closed") {
                (window.mApp.views.get("logsGridController") as LogsGridController)?.showKetsuLogs();
            } 

            if (this.currentConditionName == "small") {
                (window.mApp.views.get("baseGrid") as BaseGridController).setLogsViewSize(400);
            } 
 
            
            if (this.currentConditionName == "big")  {
                (window.mApp.views.get("baseGrid") as BaseGridController).setLogsViewSize(40);

            }
         })
         this.setUp();
    }



    updateButton() {
        if (this.currentConditionName == "closed") {
            $(`[${this.id}] img`).attr("src","./images/arrow-left.png");
            $(`[${this.id}]`).addClass('closed')
            return
        } 

        if (this.currentConditionName == "small") {
            $(`[${this.id}] img`).attr("src","./images/arrow-top.png");
        }

        if (this.currentConditionName == "big") {
            $(`[${this.id}] img`).attr("src","./images/arrow-bottom.png");
            $(`[${this.id}]`).removeClass('closed')

        }


    }

    

    setUp(): this {
        super.setUp();

        this.deleteSubviews();

        let cells : UICollectionViewCell[] = [

        ];

        for (let section  of LogsParser.shared.logsOrder) {
            let logsSection = LogsParser.shared.logs[section];
            if (logsSection.length > 0) {
                cells.push(new SectionCellController(logsSection[0].section))
            }

            for (let log of logsSection) {
                let cell =  new KetsuLogsCell(log.action,() => {
                    if ((log.content ?? "")  == "") {return}
                    LogsParser.shared.logSelected({sectionId : log.sectionId ?? "",logId: log.id})
                    let settingsController = (this.getView(this.settingsController) as SettingsCellController)
                    settingsController.getCollectionView()?.updateCellsWithoutRedrawing();
                },log.error,
                log.content != undefined,
                LogsParser.shared.selectedLog?.logId == log.id,
                log.content != undefined);
                cell.logId = log.id;
                cells.push(cell)
            }
        }

        if (cells.length == 0)  {
            cells.push(new JSLogsCellController("Logs are empty.",false))
        }


        let settingsController = new SettingsCellController(cells.map((cell) => {
            return cell.id;
        }));

        this.settingsController = settingsController.id;

        settingsController.interceptCollectionView = (cv) => {
            cv.style({"overflow-x" : "hidden"})
        }

        this.insertNewView(new InsertedViewData(settingsController.id,undefined));

        $(`[${settingsController.id}]`).addClass('bg-secondary');

        settingsController.setConstraints({top: "0px",bottom: "0px",left: "0px",right: "0px"});

        return this;
    }

    logsUpdated(): void {
        this.setUp();
    }

    logSelected(): void {
        
    }


    resizeTriggered(condition: ResizeConditions): void {
        this.currentConditionName = condition.name;
        this.updateButton();
        let bottomStatusBar = this.getView('bottomStatusBar') as BottomStatusController
        bottomStatusBar?.updateWindowButtons()
    }


    resizeFinished(entry: void): void {

    }

    observerFinished?(): void {

    }


    finish(): void {
        this.resizeObserver?.finished();
        this.resizeObserver = undefined;
        $(`[${this.id}] .button`).off()
        delete LogsParser.shared.logsInterfaces[this.id]
        super.finish();
    }




}


class KetsuLogsCell extends LogsCellController{

    logId: string = "";
    

    cellWasReloadedWithoutRedrawing(): void {
        super.cellWasReloadedWithoutRedrawing();
        if (LogsParser.shared.selectedLog?.logId == this.logId) {
            $(`[${this.id}]`).addClass("selected")
        } else {
            $(`[${this.id}]`).removeClass("selected")
        }
    }


}


export class KetsuLogsGridView extends GridElementWithView {

open(): void {
    (window.mApp.views.get("baseGrid") as BaseGridController).setLogsViewSize(350);

}

close(): void {
    (window.mApp.views.get("baseGrid") as BaseGridController).setLogsViewSize(40);

}

isClosed(): boolean {
    return this.getSize().height <= 40
}


}