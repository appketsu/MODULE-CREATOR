
import { UICollectionView } from "../../../model/collectionView/collectionView";
import { UICollectionViewCell } from "../../../model/collectionView/collectionViewCell";
import { testModuleString } from "../../../model/module/testMoudle";
import { LogsParser, LogsParserInterface } from "../../../model/SocketsServer/logsParser";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { basicHtml } from "../../../view/defaultViews/basicHtml";
import { JSLogsCellController } from "../../../model/settingCells/jsLogsCellController";
import { LogsCellController } from "../../../model/settingCells/logsCellController";
import { SectionCellController } from "../../../model/settingCells/sectionCellController";
import { SettingsCellController } from "../../../model/settingCells/settingsCellController";
import $ from "jquery";




export class CurrentLog extends View implements LogsParserInterface {

    collectionView: string;

    constructor(id: string = window.mApp.utils.makeId(), html: string = basicHtml) {
        super(id,html)
        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews")
        LogsParser.shared.logsInterfaces[this.id] = this;
    }
 



    viewWasInserted(): void {
        super.viewWasInserted()
        $(`[${this.id}]`).addClass("bg-primary")
        this.setUp();
    }



    setUp(): this {
        super.setUp();

        this.deleteSubviews();

        let log = LogsParser.shared.getLog(LogsParser.shared.selectedLog ?? {logId : "",sectionId : ""})

        let cells : UICollectionViewCell[] = []

        if (log == undefined) {
            
            cells.push(
                new JSLogsCellController( "No log selected.", false),
            )

        } else {
            cells.push(
                new JSLogsCellController(log.content ?? "", log.error),
            )
        }

        let settingsController = new SettingsCellController(cells.map((cell) => {
            return cell.id;
        }));


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
    }

    logSelected(): void {
      this.setUp();
    }

    finish(): void {

        delete LogsParser.shared.logsInterfaces[this.id];
        super.finish()

    }
}