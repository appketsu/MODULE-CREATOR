import { KeyCodesInterface, keyCodesManager } from "../../../model/keyCodesShortcouts/keyCodesManager";
import View from "../../../model/view/view";
import { ViewsHolderViewInterface } from "../../../model/viewsHolder/viewsHolder";
import { newProjectView2 } from "../../../view/popUpViews/newLoadProjectView";
import { newProjectView } from "../../../view/popUpViews/newProjectView";
import $ from "jquery"

export class NewProjectViewController extends View implements ViewsHolderViewInterface, KeyCodesInterface {

    isOnTopViewsHolder: boolean;


     constructor(html:string = newProjectView2) {
        super(undefined,html)
       keyCodesManager.shared.delegates[this.id] = this
     }
    

    viewWasInserted(): void {
        super.viewWasInserted()

        //$(`[${this.id}] input`)

        $(`[${this.id}] .option-type`).off().on('click', (ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            $(`[${this.id}] .option-type`).removeClass("selected")
            
            $(ev.currentTarget).addClass("selected")
        })

        $(`[${this.id}] .create-button`).off().on('click', (ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            this.createModule()
        })
    }

    createModule() {
        let value = $(`[${this.id}] input`)?.val() as string ?? "";
        let module = JSON.parse(window.mApp.moduleManager.getDefaultModule())
        let selectedType = $(`[${this.id}] .selected`).attr("type")
        module["moduleInfo"]["moduleType"] = selectedType
        window.mApp.moduleManager.loadNewModule(JSON.stringify(module), value)
        this.finish()
    }


    keyDown(key: string): void {
        if (this.isOnTopViewsHolder && key == "Enter") {
            this.createModule()
        }
    }

    finish(): void {
        delete keyCodesManager.shared.delegates[this.id]
        $(`[${this.id}] .option-type`).off()
        $(`[${this.id}] .create-button`).off()
        super.finish()
    }

}