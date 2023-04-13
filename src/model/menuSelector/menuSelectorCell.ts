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
        this.updateTitle()
        if (this.selected){
            $(`[${this.id}]`).addClass("selected")

        }
        return this;
    }   

    updateTitle() {
        let name = this.getView(this.menuSelectorViewId)?.viewName ?? ""
        if (name == "") {name = "empty"}
        $(`[${this.id}] .one-line`).text(name);


    }

    cellWasReloadedWithoutRedrawing(): void {
        this.updateTitle()
    }

}