import View from "../../../model/view/view";
import { searchBarView } from "../../../view/leftMenu/menuViewer/searchBarView";
import $ from "jquery"

export interface NotesSearchBarInterface {
    didSearch(searched: string) : void  
    didClickAdd() : void
}

export class NotesSearchBarController extends View {

    delegate?: NotesSearchBarInterface;

    constructor(html: string = searchBarView) {
        super(undefined,html)
    }


    viewWasInserted(): void {
        super.viewWasInserted()
        $(`[${this.id}] .add-button`).off().on('click',(ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            this.delegate?.didClickAdd()
        })

    }


    disableAddButton() {
        $(`[${this.id}]`).css("grid-template-columns","1fr 0px 0px")
    }



    finish(): void {
        $(`[${this.id}] .add-button`).off()
        super.finish()
    }




}