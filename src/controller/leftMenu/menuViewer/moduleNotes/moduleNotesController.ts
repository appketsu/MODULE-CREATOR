import { UICollectionView } from "../../../../model/collectionView/collectionView";
import { UICollectionViewCell } from "../../../../model/collectionView/collectionViewCell";
import { UICollectionVievSectionCell } from "../../../../model/collectionView/collectionViewSectionCell";
import { IndexPath, UICollectionViewDatasource, UICollectionViewDelegate, UICollectionViewSectionCellType } from "../../../../model/collectionView/interfaces";
import { ModuleManagerInterface } from "../../../../model/module/interfaces";
import { ModuleManager } from "../../../../model/module/moduleManager";
import { ModuleNotesInterface } from "../../../../model/moduleNotes/moduleNotesInterfaces";

import { ModuleNotesManager } from "../../../../model/moduleNotes/moduleNotesManager";
import { InsertedViewData } from "../../../../model/view/insertView";
import View from "../../../../model/view/view";
import { EmptyView } from "../../../../model/view/viewTemplates/emptyView";
import { moduleNotesView } from "../../../../view/leftMenu/menuViewer/moduleNotes/moduleNotesView";
import { NotesSearchBarController, NotesSearchBarInterface } from "../noteSearchBarController";
import { ModuleNotesCellController } from "./moduleNotesCellController";



export class ModuleNotesController extends View implements UICollectionViewDatasource, UICollectionViewDelegate,NotesSearchBarInterface, ModuleNotesInterface, ModuleManagerInterface{


    searchBarView : string;
    collectionView : string;
    notes : string[] = [];
    emptyView : string;
    
    constructor(id:string,html: string = moduleNotesView) {
        super(id,html)
        window.mApp.moduleManager.moduleViewsExecutor[this.id] = this
        ModuleNotesManager.shared.delegates[this.id] = this;
        let searchBar = new NotesSearchBarController()
        searchBar.delegate = this;
        let collectionView = new UICollectionView()
        collectionView.delegate = this
        collectionView.dataSourceDelegate = this;
        this.searchBarView = searchBar.id
        this.collectionView = collectionView.id
        this.setInsertDefaultViews()
        this.emptyView = new EmptyView("Click + to add Notes","bg-secondary").id;

    }


    

    viewWasInserted(): void {
        super.viewWasInserted()
        let searchBar = this.getView(this.searchBarView) as NotesSearchBarController
        let collectionView = this.getView(this.collectionView) as UICollectionView
        if (searchBar == undefined || collectionView == undefined) {return}
        this.insertNewView(new InsertedViewData(this.searchBarView))
        searchBar.setConstraints({top: "0px",left : "0px", right : "0px",height:"40px"})
        this.insertNewView(new InsertedViewData(this.collectionView))
        collectionView.setConstraints({top: "40px",left : "0px", bottom : "0px",right:"0px"});  
        this.insertNewView(new InsertedViewData(this.emptyView));
        this.getView(this.emptyView)?.setConstraints({top: "40px",left : "0px",right:"0px",bottom:"0px"});   
        this.reloadData();
    }

    reloadData() {
        this.notes = ModuleNotesManager.shared.getModuleNotes().map((el) => {
            return el.noteId
        });
        this.getView(this.emptyView)?.isHidden((this.notes.length > 0));

        (this.getView(this.collectionView) as UICollectionView)?.reloadData()
    }

    cvDidSelectItem(cv: UICollectionView, indexPath: IndexPath): void {
       
    }
    cvDidSelectSection(cv: UICollectionView, section: number, sectionCellType: UICollectionViewSectionCellType): void {
       
    }
    cvNumberOfItemsInSection(cv: UICollectionView, section: number): number {
        return this.notes.length;
    }
    cvNumberOfSections(cv: UICollectionView): number {
        return 1
    }
    cvCellForItemAt(cv: UICollectionView, indexPath: IndexPath): UICollectionViewCell {
        let cell = new ModuleNotesCellController(undefined,this.notes[indexPath.item])
        return cell
    }
    cvCellForSectionAt(cv: UICollectionView, sectionCellType: UICollectionViewSectionCellType, section: number): UICollectionVievSectionCell | undefined {
        return undefined
    }
    getSeparator?(cv: UICollectionView, indexPath: IndexPath): View | undefined {
        return undefined
    }

    noteDeleted(noteId: string): void {
        this.reloadData();
    }

    didSearch(searched: string): void {

    }

    moduleLoaded(): void {
        this.reloadData()
    }
    

    didClickAdd(): void {
    ModuleNotesManager.shared.createNote();
    this.reloadData()
    }

    finish(): void {
        super.finish()
        delete window.mApp.moduleManager.moduleViewsExecutor[this.id]
    }

}