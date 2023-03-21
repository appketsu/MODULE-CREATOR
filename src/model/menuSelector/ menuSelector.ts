import { viewDefaultMenuSelector } from "../../view/defaultViews/menuSelector";
import { UICollectionView } from "../collectionView/collectionView";
import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { UICollectionVievSectionCell } from "../collectionView/collectionViewSectionCell";
import { IndexPath, UICollectionViewDatasource, UICollectionViewDelegate, UICollectionViewSectionCellType, UICollectionViewFlowEnum } from "../collectionView/interfaces";
import { RectConstraints } from "../interfaces";
import { InsertedViewData } from "../view/insertView";
import View from "../view/view";
import { SelectionView } from "../view/viewTemplates/selectionView";
import { ViewsHolder } from "../viewsHolder/viewsHolder";
import { MenuSelectorLayout } from "./menuSelectorLayout";

export interface  MenuSelectorInterface {
    menuSelectorWasSelected(viewId: string) : void
}


export class MenuSelctor extends View implements UICollectionViewDatasource, UICollectionViewDelegate {

    cellsHolderId : string = "";
    viewsHolderId : string = "";
    menuViews: string[] = [];
    interface?: MenuSelectorInterface;
    selectedView: string;
    selectedViewName : string;
    layout: MenuSelectorLayout = new MenuSelectorLayout();

    constructor(id:string,views: string[],selected?:string, html: string = viewDefaultMenuSelector) {
        super(id,html)
        this.menuViews = views;
        if (selected == undefined && views.length > 0 ) {
            this.selectedView = views[0];
        }
        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews")
    }

    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp()
    }

    setUp(): this {
        super.setUp()
        this.setUpCellsHolder();
        this.setUpViewsHolder();
        return this;
    }

    setUpCellsHolder() {
        let cellsHolder = this.layout.getCellsHolderCollectionView();
        this.cellsHolderId = cellsHolder.id;
        cellsHolder.delegate = this;
        cellsHolder.dataSourceDelegate = this;
        this.insertNewView(new InsertedViewData(cellsHolder.id))
        this.layout.styleCellsHolder(cellsHolder);
        cellsHolder.setConstraints(this.layout.getCellsHolderConstraints())
        cellsHolder.reloadData();

    }

    setUpViewsHolder() {
        let viewsHolder = this.layout.getViewsHolder(this.menuViews);
        this.viewsHolderId = viewsHolder.id;
        this.insertNewView(new InsertedViewData(viewsHolder.id));
        viewsHolder.setConstraints(this.layout.getViewsHolderConstraints());
    }

    selectByViewId(selected:string) {
        this.selectedView = selected;
        this.interface?.menuSelectorWasSelected(selected);
        let viewsHolder = this.getView(this.viewsHolderId) as ViewsHolder;
        viewsHolder.showView(this.selectedView);
        (this.getView(this.cellsHolderId) as UICollectionView).reloadData();
    }


    selectByViewName(name:string) {
        console.log(name)
        for (var x of this.menuViews) {
            let view = this.getView(x);
            if (view == undefined) {continue;}
            if (name == view.viewName ?? "") {
                this.selectByViewId(x);
                return;
            }
        }
    }


    // Collection view | Cells holder Delegates

    cvNumberOfItemsInSection(cv: UICollectionView, section: number): number {
        return this.menuViews.length
    }
    cvNumberOfSections(cv: UICollectionView): number {
        return 1
    }


    cvCellForItemAt(cv: UICollectionView, indexPath: IndexPath): UICollectionViewCell {
        return this.layout.getCell(cv, indexPath,this.menuViews,this.menuViews[indexPath.item] == this.selectedView);
    }
    cvCellForSectionAt(cv: UICollectionView, sectionCellType: UICollectionViewSectionCellType, section: number): UICollectionVievSectionCell | undefined {
        return undefined;
    }
    cvDidSelectItem(cv: UICollectionView, indexPath: IndexPath): void {
        let selected = this.menuViews[indexPath.item];
        if (this.selectedView == selected) {
            return;
        }
        this.selectByViewId(selected);
    }
    cvDidSelectSection(cv: UICollectionView, section: number, sectionCellType: UICollectionViewSectionCellType): void {
        console.log(section);
    }

    finish(): void {
        super.finish();
        this.interface = undefined;
    }

}


