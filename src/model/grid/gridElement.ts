import {MBoundsLimit, GridElementPosition} from "./gridInterfaces";
import View from "../view/view";
import { AppInterface } from "../base";
import { viewBaseGridElement } from "../../view/baseGrid/baseGridElementView";
import { InsertedViewData } from "../view/insertView";
import { basicHtml } from "../../view/defaultViews/basicHtml";
import $ from "jquery";



export default class GridElement extends View  {

    position? : GridElementPosition;

    constructor(id: string  = window.mApp.utils.makeId(15),html: string = viewBaseGridElement) {
        super(id,html)

        
    }

    setUp() : this { // this will be called when the view has been inserted.
        super.setUp();
        return this;
    }

    setPostion(position: GridElementPosition) { // update the html;
        this.position = position;
        $(`[${this.id}]`).css({'grid-column':`${position.column.from} / ${position.column.to}`,'grid-row':`${position.row.from} / ${position.row.to}`})
    }

    open() {

    }

    close() {

    }

    isClosed() : boolean {
        let size = this.getSize();
        return size.height == 0 || size.width == 0
    }

    finish(): void {
        super.finish();
    }
}

export class GridElementWithView extends GridElement {

    addView : string;

    constructor(view:string,id: string ,html: string = basicHtml) {
        super(id,html)
        this.addView = view;
        this.setInsertDefaultViews();
    }

    viewWasInserted(): void {
        super.viewWasInserted()
        this.setUp();
    }


    setUp(): this {
        super.setUp();
        let view = this.getView(this.addView);
        this.insertNewView(new InsertedViewData(this.addView,undefined));
        view?.clipToParent()

        return this;
    }

}