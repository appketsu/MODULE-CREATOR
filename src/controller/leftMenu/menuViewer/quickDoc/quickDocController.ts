import { UICollectionView } from "../../../../model/collectionView/collectionView";
import { UICollectionViewCell } from "../../../../model/collectionView/collectionViewCell";
import { UICollectionVievSectionCell } from "../../../../model/collectionView/collectionViewSectionCell";
import { IndexPath, UICollectionViewDatasource, UICollectionViewDelegate, UICollectionViewSectionCellType } from "../../../../model/collectionView/interfaces";
import { ModuleNotesManager } from "../../../../model/moduleNotes/moduleNotesManager";
import { quickDocNotes } from "../../../../model/moduleNotes/quickDocNotes";
import { InsertedViewData } from "../../../../model/view/insertView";
import View from "../../../../model/view/view";
import { leftMenuViewerModuleSectionView } from "../../../../view/leftMenu/menuViewer/module/leftMenuViewerModuleSectionView";
import { moduleNotesView } from "../../../../view/leftMenu/menuViewer/moduleNotes/moduleNotesView";
import { ModuleNotesCellController } from "../moduleNotes/moduleNotesCellController";
import { NotesSearchBarController, NotesSearchBarInterface } from "../noteSearchBarController";
import { QuickDocCellController } from "./quickDockCell";
import { QuickDocSectionCell } from "./quickSectionCell";


export class QuickDocController extends View implements UICollectionViewDatasource, UICollectionViewDelegate,NotesSearchBarInterface {


    collectionView : string;
    searchBarView : string;

    constructor(id:string,html: string = moduleNotesView) {
        super(id,html)
        let collectionView = new UICollectionView()
        let searchBar = new NotesSearchBarController()
        searchBar.delegate = this;
        collectionView.delegate = this
        collectionView.dataSourceDelegate = this;
        this.collectionView = collectionView.id
        this.searchBarView = searchBar.id
        this.setInsertDefaultViews()
    }

    

    viewWasInserted(): void {
        super.viewWasInserted()
        let collectionView = this.getView(this.collectionView) as UICollectionView
        let searchBar = this.getView(this.searchBarView) as NotesSearchBarController
        if ( collectionView == undefined || searchBar == undefined) {return}
        this.insertNewView(new InsertedViewData(this.collectionView))
        this.insertNewView(new InsertedViewData(this.searchBarView))
        searchBar.disableAddButton()
        collectionView.setConstraints({top: "40px",left : "0px", bottom : "0px",right:"0px"})    
        collectionView.reloadData();
    }

 
    cvDidSelectItem(cv: UICollectionView, indexPath: IndexPath): void {
       
    }
    cvDidSelectSection(cv: UICollectionView, section: number, sectionCellType: UICollectionViewSectionCellType): void {
       
    }
    cvNumberOfItemsInSection(cv: UICollectionView, section: number): number {
        return quickDocNotes[section].notes.length;
    }
    cvNumberOfSections(cv: UICollectionView): number {
        return quickDocNotes.length
    }
    cvCellForItemAt(cv: UICollectionView, indexPath: IndexPath): UICollectionViewCell {
        let cell = new QuickDocCellController(undefined,quickDocNotes[indexPath.section].notes[indexPath.item].noteId)
        return cell
    }

    cvCellForSectionAt(cv: UICollectionView, sectionCellType: UICollectionViewSectionCellType, section: number): UICollectionVievSectionCell | undefined {
        if (sectionCellType == UICollectionViewSectionCellType.header) {
            let mSection = new QuickDocSectionCell(quickDocNotes[section].sectionName ?? "fgdsfsd",leftMenuViewerModuleSectionView);
            return mSection
        } 
        return undefined;
    }

    getSeparator?(cv: UICollectionView, indexPath: IndexPath): View | undefined {
        return undefined
    }

    didSearch(searched: string): void {
        throw new Error("Method not implemented.");
    }
    didClickAdd(): void {
        throw new Error("Method not implemented.");
    }



}