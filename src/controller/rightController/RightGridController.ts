import MRsesizeObserver from "../../model/ResizeObserver/mResizeObserver";
import { ResizeConditions, ResizeObserverInterface } from "../../model/ResizeObserver/resizeObserverInterfaces";
import GridElement from "../../model/grid/gridElement";
import { MenuSelctor, MenuSelectorInterface } from "../../model/menuSelector/ menuSelector";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { viewDefaultViewsHolder } from "../../view/defaultViews/defatulViewsHolder";
import { BaseGridController } from "../baseGrid/baseGridController";
import { BottomStatusController } from "../bottomStatusBar/bottomStatusController";
import { MarkdownController } from "../markdownController/markdownController";
import { markdownViewer } from "../markdownController/markdownViewer";


export class RightGridElementController extends GridElement implements ResizeObserverInterface, MenuSelectorInterface {
 


    resizeObserver?: MRsesizeObserver;
    constructor(id:string,html?:string) {
        super(id,html)
        this.setInsertDefaultViews()
    }

viewWasInserted(): void {
    super.viewWasInserted()
    this.resizeObserver = new MRsesizeObserver(new InsertedViewData(this.id,undefined),[
        {name:"closed",condition(newSize) {
            if (newSize.inlineSize <= 1  ) {
               return true;
            } else {
               return false
            }
        }},
        {name:"opened",condition(newSize) {
           if (newSize.inlineSize >= 350) {
              return true;
           } else {
              return false
           }
       }}
    ])
    this.resizeObserver.interface = this


    let view1 = new MarkdownController();
    view1.viewName = "Markdown";

    let view2 = new View();
    view2.viewName = "World";
    

    let menuSelector = new MenuSelctor(window.mApp.utils.makeId(15),[view1.id,view2.id]);
    menuSelector.interface = this;
    
    this.insertNewView(new InsertedViewData(menuSelector.id));
    menuSelector.setConstraints({top:"0px",right : "0px", left: "0px",bottom: "0px"})
}

menuSelectorWasSelected(viewId: string): void {
    //throw new Error("Method not implemented.");
}

isClosed(): boolean {
    return this.getSize().width <= 0
}

resizeTriggered(condition: ResizeConditions): void {
    let bottomStatusBar = this.getView('bottomStatusBar') as BottomStatusController
        bottomStatusBar?.updateWindowButtons()
        }
resizeFinished(entry: void): void {
    throw new Error("Method not implemented.");
}
observerFinished?(): void {
    throw new Error("Method not implemented.");
}

open(): void {
    (window.mApp.views.get("baseGrid") as BaseGridController).setDocumnetationViewSize(500);

}

close(): void {
    (window.mApp.views.get("baseGrid") as BaseGridController).setDocumnetationViewSize(0);
}

finish(): void {
    this.resizeObserver?.finished()
    this.resizeObserver = undefined
    super.finish()
}



}