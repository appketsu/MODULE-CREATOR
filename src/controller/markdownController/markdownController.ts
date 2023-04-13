import GridJs from "../../model/grid/grid";
import GridElement from "../../model/grid/gridElement";
import { GridElementDesign } from "../../model/grid/gridInterfaces";
import GridSeparatorVertical from "../../model/grid/separator/verticalSeparator";
import { InsertedViewData } from "../../model/view/insertView";
import { viewBaseGridVSeparator } from "../../view/baseGrid/baseGridSeparatorView";
import { MarkdownEditor } from "./markdownEditor";
import { MarkdownToolBar } from "./markdownToolBar";
import $ from "jquery";
import { MarkdownViewer } from "./markdownViewer";
import GridSeparatorHorizontal from "../../model/grid/separator/horizontalSeparator";
import { MarkdownInterface } from "./markdownInterface";
import { ModuleNote } from "../../model/moduleNotes/moduleNotesInterfaces";
import { viewBaseGridHtml } from "../../view/baseGrid/baseGridView";

export class MarkdownController extends GridJs implements MarkdownInterface {

    toolBarView : string
    editorView : string
    viewerView : string
    S1 : string
    S2 : string

    isEditorActive : boolean = false;
    isDataActive : boolean  = false;

    note?: ModuleNote;

    constructor(id?:string, html : string = viewBaseGridHtml,note?:ModuleNote) {
        super(id,html)
        this.note = note;
    }


viewWasInserted(): void {
    super.viewWasInserted()

    let elements : GridElement[] = [
        new MarkdownToolBar(undefined,undefined,this),
        new GridSeparatorHorizontal(undefined,undefined,false),
        new GridSeparatorVertical(undefined,undefined,false),
        new MarkdownEditor(undefined,undefined,this),
        new MarkdownViewer(undefined,undefined,this)
    ]

    this.toolBarView = elements[0].id
    this.editorView = elements[3].id
    this.viewerView = elements[4].id
    this.S1 = elements[1].id
    this.S2 = elements[2].id

    this.gridElements = elements.map((el)=> { 
        // this draws all the elements and ads their ids
        this.insertNewView(new InsertedViewData(el.id,undefined)); 
        return el.id;
    })

    this.setDistributionBasedOnSize();
}

setDistributionBasedOnSize() {

    let size = this.getSize();

    if (size.width >= 600) {
        this.setHorizontalDistribution()
    } else {
        this.setVerticalDistribution()
    }

}



setVerticalDistribution() {

    this.gridDistribution = [ 
        [this.toolBarView],
        [this.S1],
        [this.viewerView],
        [this.S2],
        [this.editorView]
    ]
    
    
    this.gridDesing = {
        columns : [new GridElementDesign("1","fr",false)],
        rows : [new GridElementDesign("39","px",false),
        new GridElementDesign("1","px",false),
        new GridElementDesign("1","fr",false),
        new GridElementDesign("0","px",false),
        new GridElementDesign("0","px",false),
        ] 
    }

    if (this.isEditorActive) {
        this.gridDesing.rows[3] = new GridElementDesign("1","px",false)
        this.gridDesing.rows[4] = new GridElementDesign("1","fr",false)
    }

    let toolBarView = (this.getView(this.toolBarView) as MarkdownToolBar)
    if (this.isDataActive) { 
        this.gridDesing.rows[0].size = "300";
    }

    toolBarView.dataModeUpdated(this.isDataActive)
    this.setDesign(this.gridDesing);
    this.setDistribution(this.gridDistribution);
    (this.getView(this.editorView) as MarkdownEditor).updateEditor()

}

setHorizontalDistribution() {

    this.gridDistribution = [ 
        [this.toolBarView,this.toolBarView,this.toolBarView],
        [this.S1,this.S1,this.S1],
        [this.editorView,this.S2,this.viewerView]
        ]
    
    
        this.gridDesing = {
            columns : [new GridElementDesign("0","px",false),
            new GridElementDesign("0","px",false),
            new GridElementDesign("1","fr",false)], 
            rows : [new GridElementDesign("39","px",false),
            new GridElementDesign("1","px",false),
            new GridElementDesign("1","fr",false),
           ] 
        }

        if (this.isEditorActive) {
            this.gridDesing.columns[0] = new GridElementDesign("1","fr",false)
            this.gridDesing.columns[1] = new GridElementDesign("1","px",false)
        }
    

        let toolBarView = (this.getView(this.toolBarView) as MarkdownToolBar)
        if (this.isDataActive) { 
            this.gridDesing.rows[0].size = "300";
        }
    
        toolBarView.dataModeUpdated(this.isDataActive)
        this.setDesign(this.gridDesing);
        this.setDistribution(this.gridDistribution);
        (this.getView(this.editorView) as MarkdownEditor).updateEditor()
    
}


getController(): MarkdownController {
    return this
}

getEditor(): MarkdownEditor | undefined {
    return this.getView(this.editorView) as MarkdownEditor
}
getToolBar(): MarkdownToolBar | undefined {
    return this.getView(this.toolBarView) as MarkdownToolBar
}
getViewer(): MarkdownViewer | undefined {
    return this.getView(this.viewerView) as MarkdownViewer
}

getNote(): ModuleNote | undefined {
   return this.note
}


finish(): void {
    this.note = undefined;
    super.finish()
}



}
