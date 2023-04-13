import { UICollectionViewCell } from "../../../../model/collectionView/collectionViewCell";
import { DropDown } from "../../../../model/dropDownMenu/dropDown";
import { DefaultDropDownCell } from "../../../../model/dropDownMenu/dropDownCell";
import { ElemModalDirection, ElementModalPos } from "../../../../model/elementModalView/elementModalView";
import { ModuleNotesInterface } from "../../../../model/moduleNotes/moduleNotesInterfaces";
import { ModuleNotesManager } from "../../../../model/moduleNotes/moduleNotesManager";
import { InsertedViewData } from "../../../../model/view/insertView";
import { viewDefaultDropDownCell } from "../../../../view/defaultViews/defaultDropDownCellView";
import { moduleNotesCellView } from "../../../../view/leftMenu/menuViewer/moduleNotes/moduleNotesCell";
import $ from "jquery"

export class ModuleNotesCellController extends UICollectionViewCell implements ModuleNotesInterface {


    noteId: string;

    constructor(html: string = moduleNotesCellView,noteId:string) {
        super(html)
        this.noteId = noteId;
        ModuleNotesManager.shared.delegates[this.id] = this
    }
    


    viewWasInserted(): void {
        super.viewWasInserted()
        let note = ModuleNotesManager.shared.getNote(this.noteId);
        console.log(note)
        if ((note?.noteTitle ?? "") == "") {
            $(`[${this.id}] .title`).text("Title is empty.");
        } else {
            $(`[${this.id}] .title`).text(note?.noteTitle ?? "");
        }
        if ((note?.noteDesc ?? "") == "") {
            $(`[${this.id}] .desc`).text("The Note has no description.");
        } else {
            $(`[${this.id}] .desc`).text(note?.noteDesc ?? "");
        }

        $(`[${this.id}] .open-button`).off().on('click',(ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            ModuleNotesManager.shared.openNote(this.noteId);
        })

        $(`[${this.id}] .more-button`).off().on('click',(ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            this.showAreYouSureToDelete($(`[${this.id}] .holder`),() => {
                ModuleNotesManager.shared.deleteNote(this.noteId)
            })
        })
    }

    showAreYouSureToDelete(el: JQuery<HTMLElement>,completion : () => void) {
        let htmlEl = el.get(0);

        if (htmlEl == undefined) {return}
        let modal = new DropDown();
        let dropDownCell = new DefaultDropDownCell("Delete note",undefined,undefined,true,viewDefaultDropDownCell);



        dropDownCell.viewWasInsertedCallback = (id) => {
            $(`[${id}]`).addClass(["bg-secondary-dark-hover","pointer","tc-red"])
        }
        modal.addCell(dropDownCell,(index,dropwDown) => {
            dropwDown.finish();
            completion()
        })

        modal.insertInto(new InsertedViewData(undefined,"body"))
        modal.setUpWithElement(0,10,
            ElementModalPos.right,
            ElemModalDirection.bottom,
            htmlEl,
            el.outerWidth())
    }

    noteTitleUpdated(noteId: string): void {
        if (this.noteId != noteId) {return}
        let note = ModuleNotesManager.shared.getNote(this.noteId);
        if ((note?.noteTitle ?? "") == "") {
            $(`[${this.id}] .title`).text("Title is empty.");
        } else {
            $(`[${this.id}] .title`).text(note?.noteTitle ?? "");
        }
    }

    noteDescriptionUpdated(noteId: string): void {
        if (this.noteId != noteId) {return}
        let note = ModuleNotesManager.shared.getNote(this.noteId);
        if ((note?.noteDesc ?? "") == "") {
            $(`[${this.id}] .desc`).text("The Note has no description.");
        } else {
            $(`[${this.id}] .desc`).text(note?.noteDesc ?? "");
        }
    }

    finish(): void {
        $(`[${this.id}] .open-button`).off()
        $(`[${this.id}] .more-button`).off()
        delete ModuleNotesManager.shared.delegates[this.id]
        super.finish();
    }


}