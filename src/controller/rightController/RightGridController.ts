import MRsesizeObserver from "../../model/ResizeObserver/mResizeObserver";
import { ResizeConditions, ResizeObserverInterface } from "../../model/ResizeObserver/resizeObserverInterfaces";
import GridElement from "../../model/grid/gridElement";
import { MenuSelctor, MenuSelectorInterface } from "../../model/menuSelector/ menuSelector";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { viewDefaultViewsHolder } from "../../view/defaultViews/defatulViewsHolder";
import { BaseGridController } from "../baseGrid/baseGridController";
import { BottomStatusController } from "../bottomStatusBar/bottomStatusController";



export class RightGridElementController extends GridElement implements ResizeObserverInterface, MenuSelectorInterface {
 


    resizeObserver?: MRsesizeObserver

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


    let view1 = new View(undefined,'<div class="padding tc-t-primary" $id>Here will go the Module Notes, the documentation and the interactive tutorials using markdown.</div>');
    view1.viewName = "Hello";



    let view2 = new View();
    view2.viewName = "World";
    

    let menuSelector = new MenuSelctor(window.mApp.utils.makeId(15),[view1.id,view2.id]);
    menuSelector.interface = this;
    
    this.insertNewView(new InsertedViewData(menuSelector.id));

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