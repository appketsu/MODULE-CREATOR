import { UICollectionViewCell } from "../../../../model/collectionView/collectionViewCell";
import { ModuleNotesInterface } from "../../../../model/moduleNotes/moduleNotesInterfaces";
import { ModuleNotesManager } from "../../../../model/moduleNotes/moduleNotesManager";
import { moduleNotesCellView } from "../../../../view/leftMenu/menuViewer/moduleNotes/moduleNotesCell";
import { ModuleNotesCellController } from "../moduleNotes/moduleNotesCellController";
import $ from "jquery"



export class QuickDocCellController extends ModuleNotesCellController implements ModuleNotesInterface {



    constructor(html: string = moduleNotesCellView,noteId:string) {
        super(html,noteId)
    }
    

    viewWasInserted(): void {
        super.viewWasInserted();
        $(`[${this.id}] .buttons-holder`).css("grid-template-columns","min-content 0px 0px")
        $(`[${this.id}] .separator`).css("display","none")
        $(`[${this.id}] .more-button`).css("display","none")

    }

}