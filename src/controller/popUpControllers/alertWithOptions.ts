import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { StateManagerController } from "../../model/view/viewTemplates/stateManagerController";
import { alertWithOptionsView } from "../../view/popUpViews/alertWithOptionsView";
import $ from "jquery"
export interface AlertOption {
    title : string
    didClick (): void
    color? : string
    id?: string
  }

export class AlertWithOptions extends View {

    options : AlertOption[] = []
    title : string
    msg : string

    constructor(title:string,msg:string,options: AlertOption[] = []) {
        super(undefined,alertWithOptionsView)
        this.title = title
        this.msg = msg
        options.forEach((op) => {
            this.addOption(op)
        })
    }

    viewWasInserted(): void {
        super.viewWasInserted()

        let stateManagerCont = new StateManagerController(this.title,{finished : () => {
            this.finish();
        }});

        let ivd = new InsertedViewData(stateManagerCont.id, "$idstatemanager")
        this.insertNewView(ivd);
        stateManagerCont.clipToParent();
        $(`[${this.id}] .msg`).text(this.msg)

        this.options.reverse().forEach((opt) => { 
            opt.id = window.mApp.utils.makeId()
            let html = `<div clickId="${opt.id}"  class="option one-line center-flex">${opt.title}</div>`
            $(`[${this.id}] .options`).append(html)
        })
        $(`[${this.id}] .option`).off().on('click', (ev)=> {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            let id = ev.currentTarget.getAttribute('clickId') as string ??  ""
            for (let opt of this.options) {
                if (id == opt.id) {
                    opt.didClick()
                    this.finish()
                    return
                }
            }

        })
    }

addOption(option: AlertOption) {
    $(`[${this.id}] .option`).off()
    this.options.push(option)
}

 

}