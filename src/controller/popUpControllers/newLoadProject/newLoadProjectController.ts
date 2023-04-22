import { first } from "lodash";
import { MenuSelctor, MenuSelectorInterface } from "../../../model/menuSelector/ menuSelector";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { newLoadProjectView } from "../../../view/popUpViews/newLoadProjectView";
import { LogsMenuSelectorLayout } from "../../logsView/logsViewer/logsViewerHolderController";
import { LoadFileController } from "./LoadFileController";
import { LoadFileUrlController } from "./LoadFileUrlController";
import { NewProjectViewController } from "./newProjectViewController";
import $ from "jquery"


export class NewLoadProjectController extends View implements MenuSelectorInterface {

menuSelector : string = ""
firstView : string;
closeEnabled : boolean = true

constructor(html:string = newLoadProjectView,firstView:string,closeEnabled : boolean = true) {
    super(undefined,html)
    this.firstView = firstView;
    this.closeEnabled = closeEnabled;
}


viewWasInserted(): void {
    super.viewWasInserted()

    let view1 = new NewProjectViewController();
    view1.viewName = "New"

    view1.viewWasFinishedCallback = () => {
        this.finish()
    }
    let view2 = new LoadFileController()
    view2.viewName = "Load File"

    view2.viewWasFinishedCallback = () => {
        this.finish()
    }

    let view3 = new LoadFileUrlController()
    view3.viewName = "Load URL"

    view3.viewWasFinishedCallback = () => {
        this.finish()
    }

    let menuSelector = new MenuSelctor(window.mApp.utils.makeId(15),[view1.id,view2.id,view3.id])
    this.menuSelector = menuSelector.id;
    menuSelector.interface = this;
    menuSelector.layout = new LogsMenuSelectorLayout();
    
    this.insertNewView(new InsertedViewData(menuSelector.id));

    menuSelector.selectByViewName(this.firstView)

    menuSelector.setConstraints({top:"0px",right : "0px", left: "0px",bottom: "0px"})


    if (this.closeEnabled) {
        $(`[${this.id}] .close`).off().on('click', () => {
            this.finish()
        })
    } else {
        $(`[${this.id}] .close`).css("display" , "none")
    }
 
}






menuSelectorWasSelected(viewId: string): void {

}








finish(): void {
    $(`[${this.id}] .close`).off()
    super.finish()
}








}