import { viewStateManager } from "../../../view/defaultViews/viewStateManager";
import View from "../view";
import $ from "jquery";


interface StateManagerInterface {
    finished?: () => void;
}


export class StateManagerController extends View {

    mInterface : StateManagerInterface;
    title: string;

    constructor(title:string,mInterface: StateManagerInterface) {
        super(window.mApp.utils.makeId(),viewStateManager )
        this.mInterface = mInterface;
        this.title = title;
    }

    canExit = true;
    disableExit() {
        this.canExit = false;
    }


    viewWasInserted(): void {
        super.viewWasInserted();
        $(`[${this.id}] .title`).text(this.title)

        if (!this.canExit) {
            $(`[${this.id}] img`).css('display', 'none')
            return
        }

        $(`[${this.id}] .button`).off().on('click', (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            if (this.mInterface.finished != undefined) {
                this.mInterface.finished();
            }
        })
    }


    finish(): void {
        $(`[${this.id}] .button`).off();
        super.finish();
    }


}