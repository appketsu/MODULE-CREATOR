import { viewDefaultDropDownCell } from "../../view/defaultViews/defaultDropDownCellView";
import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { IndexPath } from "../collectionView/interfaces";
import $ from "jquery";




export class DefaultDropDownCell extends UICollectionViewCell {

    title: string;

    constructor(
        title: string | undefined = undefined,
        image: string | undefined = undefined,
        arrow: string | undefined = undefined,
        selected: boolean = false,
        html: string = viewDefaultDropDownCell) {
            super(html)
            this.title = title ?? "";
    }



    viewWasInserted() {
        super.viewWasInserted()
        this.setUp();
    }

    setUp() : this {
        super.setUp()
        $(`[${this.id}] .title`).text(this.title);
        return this;
    }
}