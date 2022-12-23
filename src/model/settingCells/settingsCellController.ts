import { extend } from "lodash";
import { UICollectionView } from "../collectionView/collectionView";
import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { UICollectionVievSectionCell } from "../collectionView/collectionViewSectionCell";
import { IndexPath, UICollectionViewDatasource, UICollectionViewSectionCellType } from "../collectionView/interfaces";
import { InsertedViewData } from "../view/insertView";
import View from "../view/view";


export const settingsControllerView = `<div $id> 

    <div $idviews class="fill-absolute"> 
    
    
    </div>
    

</div>`;



export class SettingsCellController extends View implements  UICollectionViewDatasource {

    collectionView : string;

    interceptCollectionView?:(cv:UICollectionView) => void; // this will allow the caller of this class to intercept the collection view and set whatever styles it wants to it.

    cells: string[] = [];

    constructor(cells: string[],id: string = window.mApp.utils.makeId(), html = settingsControllerView) {
        super(id,html)
        this.insertViewsDefault = new InsertedViewData(this.id, "$idviews");
        this.cells = cells;
    }
 

    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();
    }

    setUp(): this {
        super.setUp();
        let cv = new UICollectionView()
        this.collectionView = cv.id;
        cv.dataSourceDelegate = this;
        this.insertNewView(new InsertedViewData(cv.id,undefined));
        cv.setConstraints({top:"0px",bottom:"0px",left: "0px",right: "0px"});
        if (this.interceptCollectionView != undefined) {
            this.interceptCollectionView(cv) 
        }
        cv.reloadData();
        return this;
    }

    getCollectionView() : UICollectionView | undefined{

        return this.getView(this.collectionView) as UICollectionView
        
    }


    cvNumberOfItemsInSection(cv: UICollectionView, section: number): number {
       return this.cells.length;
    }
    cvNumberOfSections(cv: UICollectionView): number {
        return 1;
    }
    cvCellForItemAt(cv: UICollectionView, indexPath: IndexPath): UICollectionViewCell {
        return this.getView(this.cells[indexPath.item]) as UICollectionViewCell;
    }

    cvCellForSectionAt(cv: UICollectionView, sectionCellType: UICollectionViewSectionCellType, section: number): UICollectionVievSectionCell | undefined {
        return undefined;
    }

    getSeparator?(cv: UICollectionView, indexPath: IndexPath): View | undefined {
        return undefined;
    }


    finish(): void {
        this.interceptCollectionView = undefined;
        super.finish();
    }


}