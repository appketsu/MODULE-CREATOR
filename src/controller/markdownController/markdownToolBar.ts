import GridElement from "../../model/grid/gridElement";
import { ModuleNotesManager } from "../../model/moduleNotes/moduleNotesManager";
import View from "../../model/view/view";
import { basicHtml } from "../../view/defaultViews/basicHtml";
import { markdownToolBarView } from "../../view/rightViews/markdownToolBarView";
import { MarkdownInterface } from "./markdownInterface";
import $  from "jquery"

export class MarkdownToolBar extends GridElement {
    

    delegate?: MarkdownInterface;



    constructor(id?: string,html:string = markdownToolBarView,delegate?: MarkdownInterface
        ) {
            super(id,html)
            this.setInsertDefaultViews()
            this.delegate = delegate
    }
    

    viewWasInserted(): void {
        super.viewWasInserted()
        this.updateToolBarButtons()
        let note = this.delegate?.getNote()
        if (note == undefined) {return}
        $(`[${this.id}] .note-id`).text("Note ID: " + note?.noteId)
        $(`[${this.id}] .title`).val(note?.noteTitle ?? "")
        $(`[${this.id}] textarea`).val(note?.noteDesc ?? "")
        $(`[${this.id}] .title`).off().on('input',(ev) => {
            if (note == undefined) {return}
            note.noteTitle = $(ev.currentTarget).val() as string ?? ""
            ModuleNotesManager.shared.noteTitleUpdated(note.noteId ?? "")
        })
        $(`[${this.id}] textarea`).off().on('input',(ev) => {
            if (note == undefined) {return}
            note.noteDesc = $(ev.currentTarget).val() as string ?? ""
            ModuleNotesManager.shared.noteDescUpdated(note.noteId)
        })


        $(`[${this.id}] .edit`).off().on('click',(ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            let controller = this.delegate?.getController()
            let editor = this.delegate?.getEditor();
            if (controller == undefined || editor == undefined ) { return }
            controller.isEditorActive = !controller.isEditorActive
            controller.setDistributionBasedOnSize()
            this.updateToolBarButtons()
            editor.updateEditor();
        })
        $(`[${this.id}] .data`).off().on('click',(ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            let controller = this.delegate?.getController()
            if (controller == undefined) { return }
            controller.isDataActive = !controller.isDataActive
            controller.setDistributionBasedOnSize()
            this.updateToolBarButtons()
        })

        $(`[${this.id}] .export`).off().on('click',(ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            this.exportNote()

        })
        $(`[${this.id}] .tb-close`).off().on('click',(ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            let note = this.delegate?.getNote()
            if (note == undefined) { 
                console.log(note)
                return }
            ModuleNotesManager.shared.closeNote(note.noteId)
        })
    }

    exportNote() {
        let note = window.mApp.utils.deepCopy(this.delegate?.getNote())
        if (note == undefined) { return } 
        note.isDocumentation = true;
        var blob = new Blob([JSON.stringify(note, null, "\t")], {type: "application/json"});
        var url  = URL.createObjectURL(blob);
        
        var a = document.createElement('a');
        a.href        = url;
        a.download    = `${note.noteTitle.replace(" ","")}.json`;
        
        document.body.appendChild(a);

        a.click();

        // Remove anchor from body
        document.body.removeChild(a);
    }


    dataModeUpdated(isActive: boolean | undefined = this.delegate?.getController().isDataActive ) {

        if (isActive == undefined) {
            return
        }

        if (isActive) {
            $(`[${this.id}] .md-note-data`).css('display','')

        } else {
            $(`[${this.id}] .md-note-data`).css('display','none')

        }
    }

    updateToolBarButtons() {
        let controller = this.delegate?.getController();

        if (controller == undefined) {return}

        if (controller.isDataActive) {
            $(`[${this.id}] .data`).addClass('active')
        } else {
            $(`[${this.id}] .data`).removeClass('active')
        }

        if (controller.isEditorActive) {
            $(`[${this.id}] .edit`).addClass('active')
        } else {
            $(`[${this.id}] .edit`).removeClass('active')
        }
    }

    finish(): void {
        $(`[${this.id}] .edit`).off() 
        $(`[${this.id}] .data`).off()
        $(`[${this.id}] .tb-close`).off()
        $(`[${this.id}] .title`).off()
        $(`[${this.id}] textarea`).off()
        this.delegate = undefined;
        super.finish()
    }

}