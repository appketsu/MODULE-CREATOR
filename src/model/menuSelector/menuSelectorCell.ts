import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { IndexPath } from "../collectionView/interfaces";
import $ from "jquery";


export class ModuleSelectorCell extends UICollectionViewCell {

    menuSelectorViewId: string;
    selected: boolean = false;
    
    constructor(indexPath:IndexPath,collectionViewId: string,menuSelectorViewId:string,selected:boolean,html?:string) {
        super(html)
        this.menuSelectorViewId = menuSelectorViewId;
        this.selected = selected;
    }

    
    viewWasInserted() {
        super.viewWasCreated();
        this.setUp();
    }

    setUp() : this{
        super.setUp();
        $(`[${this.id}] .one-line`).text(this.getView(this.menuSelectorViewId)?.viewName ?? "")

        if (this.selected){
            $(`[${this.id}]`).addClass("selected")

        }
        return this;
    }   

}