import { basicHtml } from "../../../view/defaultViews/basicHtml";
import { viewPopUp } from "../../../view/popUpViews/viewPopUpView";
import { RectNumber } from "../../interfaces";
import { KeyCodesInterface, KeyShortcuts, keyCodesManager } from "../../keyCodesShortcouts/keyCodesManager";
import { InsertedViewData } from "../insertView";
import View from "../view";
import $ from "jquery";



export class PopUpView extends View implements KeyCodesInterface {

    view:string;

    disableExitWithEscape : boolean = false

    constructor(view:string,id:string = window.mApp.utils.makeId(),html:string = viewPopUp) {
        super(id,html)
        this.setInsertDefaultViews();
        this.view = view;
        keyCodesManager.shared.delegates[this.id] = this;
    }

    canExit = true;
    disableExit() {
        this.canExit = false;
    }

    viewWasInserted(): void {
        super.viewWasInserted()
        this.insertNewView(new InsertedViewData(this.view,undefined));
        let insertedV = this.getView(this.view);
        if (insertedV != undefined) {
            insertedV.viewWasFinishedCallback = (id) => {
                this.finish();
            }
        }
        if (!this.canExit) {return}
        $(`[${this.id}]`).off().on('click', (el) => {
            el.preventDefault();
            el.stopImmediatePropagation();
            let viewFrame = this.getView(this.view)?.getFrame();
            if (viewFrame == undefined) {return}
            if (el.clientX < viewFrame.x ||
                el.clientX > viewFrame.x + viewFrame.width ||
                el.clientY < viewFrame.y ||
                el.clientY > viewFrame.y + viewFrame.height ) {
                    this.finish();
                    return;
                }

        })
    }

    disableEscape() : PopUpView {
        this.disableExitWithEscape = true
        return this
    }
    
    static showPopUpViewOnBody(view:string,canExit:boolean = true): PopUpView {
    let pop = new PopUpView(view);
    if (!canExit) { pop.disableExit()}
    pop.insertInto( new InsertedViewData(undefined,"body"))
    pop.setConstraints({ top: "0px",bottom: "0px",left: "0px",right: "0px"})
    pop.clipToParent()
    return pop;
    }

    keyUp(key: string): void {
        if (key == "Escape" && !this.disableExitWithEscape) {
            this.finish();
        }
    }
    

    finish(): void {
        $(`[${this.id}]`).off();
        let insertedV = this.getView(this.view);
        if (insertedV != undefined) {
            insertedV.viewWasFinishedCallback = undefined;
        }
        delete keyCodesManager.shared.delegates[this.id];
        super.finish();
    }

}  