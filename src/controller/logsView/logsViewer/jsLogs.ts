import { last } from "lodash";
import { UICollectionView } from "../../../model/collectionView/collectionView";
import { UICollectionViewCell } from "../../../model/collectionView/collectionViewCell";
import { LogsParser, LogsParserInterface } from "../../../model/SocketsServer/logsParser";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { basicHtml } from "../../../view/defaultViews/basicHtml";
import { JSLogsCellController } from "../../../model/settingCells/jsLogsCellController";
import { LogsCellController } from "../../../model/settingCells/logsCellController";
import { SectionCellController } from "../../../model/settingCells/sectionCellController";
import { SettingsCellController } from "../../../model/settingCells/settingsCellController";
import { CurrentLog } from "./currentLog";
import $ from "jquery";




export class JSLogs extends View implements LogsParserInterface {

    
    collectionView: string;

    constructor(id: string = window.mApp.utils.makeId(), html: string = basicHtml) {
        super(id,html)
        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews")
        LogsParser.shared.logsInterfaces[this.id] = this;
    }
 
  


    viewWasInserted(): void {
        super.viewWasInserted()
        this.setUp();
    }



    setUp(): this {
        super.setUp();

        this.deleteSubviews();

     
        let cells : UICollectionViewCell[] = [
         
        ];

        let lastLogs = LogsParser.shared.logs[LogsParser.shared.logsOrder[0]];

        let current = 0;
        for (let log of lastLogs ?? []) {
            if (log.action == "Javascript Logs")  {
                current += 1
                let parsed = JSON.parse(log.content ?? "[]")
                if (parsed.length > 0) {
                    cells.push(new JSLogsCellController(`${current}. Logs:`))
                }
                for (let jsLog of parsed) {
                    console.log(jsLog["value"])
                    if (jsLog["value"] == "" || jsLog["value"] == undefined) {continue;}
                    cells.push(new JSLogsCellController(jsLog["value"], jsLog["type"] == "error"))
                }
            }
        }
        if (cells.length == 0) {
            cells.push(new JSLogsCellController("No javascript logs were found.",false))
        }

        let settingsController = new SettingsCellController(cells.map((cell) => {
            return cell.id;
        }));
        this.collectionView = settingsController.id;
        settingsController.interceptCollectionView = (cv) => {
            cv.style({"overflow-x" : "hidden"})
        }

        this.insertNewView(new InsertedViewData(settingsController.id,undefined));

        $(`[${settingsController.id}]`).addClass('bg-primary');

        settingsController.setConstraints({top: "0px",bottom: "0px",left: "0px",right: "0px"});
        return this;
    }


    logsUpdated(): void {
        this.setUp();
        let settingsCV = (this.getView(this.collectionView) as SettingsCellController);
         let cv = settingsCV?.getCollectionView()
         console.log(cv)
         cv?.scrollTo({section:0,item: settingsCV.cells.length - 1})
    } 

    logSelected(): void {

    }

    finish(): void {
        super.finish();
        delete LogsParser.shared.logsInterfaces[this.id];

    }

}