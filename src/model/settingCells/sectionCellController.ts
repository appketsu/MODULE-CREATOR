import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import View from "../view/view";
import { sectionCellView } from "../../view/settingsCells/sectionCellView";
import $ from "jquery";



export class SectionCellController extends UICollectionViewCell {

    title:string;

    constructor(title:string,html:string = sectionCellView) {
        super(html)
        this.title = title;

    }

    

    viewWasInserted(): void {
        super.viewWasInserted();
        $(`[${this.id}] .title`).text(this.title)
    }

}