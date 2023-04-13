import { KeyCodesInterface, keyCodesManager } from "../../model/keyCodesShortcouts/keyCodesManager";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { StateManagerController } from "../../model/view/viewTemplates/stateManagerController";
import { basicHtml } from "../../view/defaultViews/basicHtml";
import { newProjectView } from "../../view/popUpViews/newProjectView";
import $ from 'jquery'

export class NewProjectController extends View implements KeyCodesInterface{


    constructor(html: string = newProjectView) {
        super(window.mApp.utils.makeId(),html)
        keyCodesManager.shared.delegates[this.id] = this;
    }

    canExit = true;
    disableExit() {
        this.canExit = false;
    }


    viewWasInserted(): void {
        super.viewWasInserted();
        $(`[${this.id}] input`).trigger("focus")
        $(`[${this.id}] .create-button`).on('click', () => {
            let value = $(`[${this.id}] input`).val() as string ?? "";
            if (value == "") {return}
            window.mApp.moduleManager.loadNewModule(window.mApp.moduleManager.getDefaultModule(), value)
            this.finish()
        });
    
        let stateManagerCont = new StateManagerController("New Project",{finished : () => {
            this.finish();
        }});
        
        if (!this.canExit) {
            stateManagerCont.disableExit();
        }

        let ivd = new InsertedViewData(stateManagerCont.id, "$idstatemanager")
        this.insertNewView(ivd);
        stateManagerCont.clipToParent();
    }

keyUp(key: string): void {
    let value = $(`[${this.id}] input`)?.val() as string ?? "";
    if (key == "Enter" && (value) != "") {
        
        window.mApp.moduleManager.loadNewModule(window.mApp.moduleManager.getDefaultModule(), value)
        this.finish()
        
    }
}


finish(): void {
    $(`[${this.id}] .create-button`).off()
    delete keyCodesManager.shared.delegates[this.id];

    super.finish();
}









}