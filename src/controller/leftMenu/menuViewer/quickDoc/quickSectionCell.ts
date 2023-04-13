import { UICollectionVievSectionCell } from "../../../../model/collectionView/collectionViewSectionCell";
import { leftMenuViewerModuleSectionView } from "../../../../view/leftMenu/menuViewer/module/leftMenuViewerModuleSectionView";
import $ from "jquery"

export class QuickDocSectionCell extends UICollectionVievSectionCell {

    title : string;

    constructor(title:string,html:string ) {
       super(html)
        this.title = title;
        
    }


    viewWasInserted(): void {
        super.viewWasInserted()
        $(`[${this.id}] .text`).text(this.title);
        $(`[${this.id}] .section-controller`).css({"display" : "none"})
        $(`[${this.id}] .text`).css({"left" : "0.5rem"})
        $(`[${this.id}] .section-distr`).css({"grid-template-columns" : "1fr 0.5rem"})
        $(`[${this.id}] .button-holder`).css({"display" : "none"})
        $(`[${this.id}] `).removeClass("pointer")
        $(`[${this.id}] `).removeClass("tc-t-primary-hover")
    }
}