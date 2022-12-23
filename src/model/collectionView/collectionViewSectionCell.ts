import { UICollectionViewCell } from "./collectionViewCell";
import { UICollectionViewSectionCellType } from "./interfaces";






export class UICollectionVievSectionCell extends UICollectionViewCell {

    sectionCellType: UICollectionViewSectionCellType;
    
    constructor(
    html?:string) {
        super(html)
    }

    htmlInsertionInterceptor(html: Element | undefined): Element | undefined {
        let newHtml =  super.htmlInsertionInterceptor(html);
        if (newHtml == undefined) {return undefined}
         newHtml.setAttribute("UICVCellType",`${this.sectionCellType}`);
        return newHtml;
     }

    

 

    finish(): void {
        this.removeDelegatesFromCell();
        super.finish();
    }
}