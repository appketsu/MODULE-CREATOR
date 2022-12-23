import { ModuleManagerInterface } from "../../../model/module/interfaces";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { ViewsHolder } from "../../../model/viewsHolder/viewsHolder";
import { LeftMenuData, LeftMenuDataInterface } from "../interfaces";


export class LeftMenuMenuViewerController extends View implements ModuleManagerInterface {


    leftMenuDataInterface? : LeftMenuDataInterface;
    

    viewWasInserted() {
        super.viewWasInserted();
        window.mApp.moduleManager.moduleViewsExecutor[this.id] = this;
    }


    setUp(): this  {
        super.setUp();
        this.insertedViews.forEach((el) => {
            el.getView()?.finish();
        })

        let data = this.leftMenuDataInterface?.getLeftMenuDataArrray();

        if (data != undefined) {
            let viewsArray = data.map((el) => {
                return el.subMenuViewer.createView().id;
            })

            let active : string = "";
            for (var x of data) {
                if (x.selected) {
                    active = x.subMenuViewer.viewId
                    break;
                }
            }

            if (active == "" && data.length > 0 ) {
                data[0].selected = true;
                active = data[0].subMenuCell.viewId;
            }

            let viewsHolder : ViewsHolder = new ViewsHolder("leftMenuViewsHolder",viewsArray,active)

            this.insertNewView(new InsertedViewData(viewsHolder.id));
            viewsHolder.setConstraints({top: "0px",left: "0px",bottom: "0px",right: "0px"})
       
        }

        return this;
    }


    changeMenuView(data: LeftMenuData) {
        (this.getView("leftMenuViewsHolder") as ViewsHolder).showView(data.subMenuViewer.viewId);
    }



    moduleLoaded(): void {
        this.setUp();
    }

 

    finish(): void {
        this.leftMenuDataInterface = undefined;
        delete window.mApp.moduleManager.moduleViewsExecutor[this.id];
        super.finish();

    }

}