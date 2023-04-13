import MRsesizeObserver from "../../model/ResizeObserver/mResizeObserver";
import { ResizeConditions, ResizeObserverInterface } from "../../model/ResizeObserver/resizeObserverInterfaces";
import GridElement from "../../model/grid/gridElement";
import { MenuSelctor, MenuSelectorInterface } from "../../model/menuSelector/ menuSelector";
import { ModuleManagerInterface } from "../../model/module/interfaces";
import { ModuleManager } from "../../model/module/moduleManager";
import { ModuleNote, ModuleNotesInterface } from "../../model/moduleNotes/moduleNotesInterfaces";
import { ModuleNotesManager } from "../../model/moduleNotes/moduleNotesManager";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { EmptyView } from "../../model/view/viewTemplates/emptyView";
import { viewDefaultViewsHolder } from "../../view/defaultViews/defatulViewsHolder";
import { BaseGridController } from "../baseGrid/baseGridController";
import { BottomStatusController } from "../bottomStatusBar/bottomStatusController";
import { MarkdownController } from "../markdownController/markdownController";
import { MarkdownViewer } from "../markdownController/markdownViewer";


export class RightGridElementController extends GridElement implements ResizeObserverInterface, MenuSelectorInterface, ModuleNotesInterface,ModuleManagerInterface {
 
    resizeObserver?: MRsesizeObserver;
    menuSelector?: MenuSelctor;
    emptyView : string;

    constructor(id:string,html?:string) {
        super(id,html)
        this.setInsertDefaultViews()
        ModuleNotesManager.shared.delegates[id] = this
        window.mApp.moduleManager.moduleViewsExecutor[this.id] = this
        this.menuSelector = new MenuSelctor(window.mApp.utils.makeId(15),[]);
        this.menuSelector.interface = this;
        this.emptyView = new EmptyView("No Notes Opened").id;

    }


viewWasInserted(): void {
    super.viewWasInserted()
    this.resizeObserver = new MRsesizeObserver(new InsertedViewData(this.id,undefined),[
        {name:"closed",condition(newSize) {
            if (newSize.inlineSize <= 1  ) {
               return true;
            } else {
               return false
            }
        }},
        {name:"opened",condition(newSize) {
           if (newSize.inlineSize >= 500) {
              return true;
           } else {
              return false
           }
       }}
    ])

    this.resizeObserver.interface = this
    this.insertNewView(new InsertedViewData(this.menuSelector?.id ?? ""));
    this.menuSelector?.setConstraints({top:"0px",right : "0px", left: "0px",bottom: "0px"})

    let emptyView = this.getView(this.emptyView)
    this.insertNewView(new InsertedViewData(this.emptyView));
    emptyView?.clipToParent()
    emptyView?.isHidden(true)
    
}

setNotes(notes: string[] = ModuleNotesManager.shared.getOpenedNotes()) {

    this.menuSelector?.setViews([])

    for (var note of notes) {
        let noteData = ModuleNotesManager.shared.getNote(note);
        let view = new MarkdownController(note,undefined,noteData)
        view.viewName = noteData?.noteTitle ?? ""
    }

    this.menuSelector?.setViews(notes)
    this.menuSelector?.selectByViewId(ModuleNotesManager.shared.getActiveNote())

    if (notes.length <= 0) {
        this.close()
        this.getView(this.emptyView)?.isHidden(false)
    } else if (notes.length > 0 && !this.isClosed()) {
        this.open()
        this.getView(this.emptyView)?.isHidden(true)
    }
}

menuSelectorWasSelected(viewId: string): void {
    //throw new Error("Method not implemented.");
    ModuleNotesManager.shared.openNote((this.getView(viewId) as MarkdownController)?.note?.noteId ?? "")
    
}

isClosed(): boolean {
    return this.getSize().width <= 0
}

resizeTriggered(condition: ResizeConditions): void {
    let bottomStatusBar = this.getView('bottomStatusBar') as BottomStatusController
        bottomStatusBar?.updateWindowButtons()
    if (condition.name == "opened") {
        ModuleNotesManager.shared.getOpenedNotes().forEach( (note) => {
            let markdown = this.getView(note) as MarkdownController
            console.log(markdown.viewName)
            markdown.setDistributionBasedOnSize()
        })
    }
}


resizeFinished(entry: void): void {
    throw new Error("Method not implemented.");
}
observerFinished?(): void {
    throw new Error("Method not implemented.");
}

open(): void {
    (window.mApp.views.get("baseGrid") as BaseGridController).setDocumnetationViewSize(500);

}

close(): void {
    (window.mApp.views.get("baseGrid") as BaseGridController).setDocumnetationViewSize(0);
}

// Module Note Interfaces

noteClosed(noteId: string): void {
    this.menuSelector?.removeView(noteId)
    let openedNotes = ModuleNotesManager.shared.getOpenedNotes()
    if (openedNotes.length <= 0) {
        this.close()
        this.getView(this.emptyView)?.isHidden(false)
    }
}

noteOpened(noteId: string): void {
    this.getView(this.emptyView)?.isHidden(true)
    let note = ModuleNotesManager.shared.getNote(noteId);
    let openedNotes = ModuleNotesManager.shared.getOpenedNotes()
    if (this.isClosed()) {
        this.open()
    }
    if (note == undefined) {return}

    if(this.getView(noteId) != undefined) {
        if (this.menuSelector?.selectedView != noteId) {
            this.menuSelector?.selectByViewId(noteId)
        }
        return
    }

    let view = new MarkdownController(noteId,undefined,note)
    view.viewName = note.noteTitle

    this.menuSelector?.addView(view.id)

    this.menuSelector?.selectByViewId(noteId)


}

noteTitleUpdated(noteId: string): void {
    this.menuSelector?.reloadViewNames()
}

// Modules Manager Interface

moduleLoaded(): void {
    this.setNotes()
}

moduleDataUpdated?: (() => void) | undefined;


moduleProjectNameChanged?(): void {

}

moduleAutoSaved?(): void {

}

finish(): void {
    this.menuSelector = undefined
    this.resizeObserver?.finished()
    this.resizeObserver = undefined
    delete ModuleNotesManager.shared.delegates[this.id]
    delete window.mApp.moduleManager.moduleViewsExecutor[this.id]
    super.finish()
}
}