import View from "../view/view";
import { IndexPath } from "./interfaces";
import $ from "jquery";



export class UICollectionViewCell extends View {

    indexPath?: IndexPath;
    collectionViewId: string;
        
    constructor(html?:string) {
        super(window.mApp.utils.makeId(),html)
    }

 
    htmlInsertionInterceptor(html: Element | undefined): Element | undefined {
       let newHtml =  super.htmlInsertionInterceptor(html);
        
       if (newHtml == undefined) {return undefined}
        newHtml.setAttribute("UICVSection",`${this.indexPath?.section ?? ""}`);
        newHtml.setAttribute("UICVItem",`${this.indexPath?.item ?? ""}`);
        newHtml.setAttribute("UICVID",this.collectionViewId);
        newHtml.setAttribute("UICVViewId",this.id);
        newHtml.setAttribute("UICVCellType",`cell`);
       return newHtml;
    }
    
    cellWasReloadedWithoutRedrawing() {
        
    }

    removeDelegatesFromCell() {
        $(`[${this.id}]`).off()
    }

    finish(): void {
        this.removeDelegatesFromCell();
        this.indexPath = undefined;
        super.finish();
    }


}


