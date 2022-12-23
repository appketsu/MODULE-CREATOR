import { viewDefaultCollectionViewView } from "../../view/defaultViews/defaultCollectionView";
import { UICollectionView } from "../collectionView/collectionView";
import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { UICollectionVievSectionCell } from "../collectionView/collectionViewSectionCell";
import { IndexPath, UICollectionViewDatasource, UICollectionViewDelegate, UICollectionViewSectionCellType } from "../collectionView/interfaces";
import { ElementModalView, ElemModalDirection } from "../elementModalView/elementModalView";
import { InsertedViewData } from "../view/insertView";
import View from "../view/view";
import $ from "jquery";
import { dropWhile } from "lodash";
import { basicHtml } from "../../view/defaultViews/basicHtml";


// TO CALL THIS WE CALL GENERAL SETUP OR ONE OF THE SET UPS AVAILABLE FROM ELEMMODALVIEW

export class DropDown extends ElementModalView implements UICollectionViewDatasource, UICollectionViewDelegate {


    cells : UICollectionViewCell[] = [];

    callback?(index:number,dropDownMenu:DropDown) : void;

    individualCallbacks : {[key:number] : ((index:number,dropDownMenu:DropDown) => void)} = {};

    collectionView: string;

    constructor(callback?: (index:number,dropDownMenu:DropDown) => void) {
        super()
        this.callback = callback;
    }

    bgView: string = "";
    insertInto(insertInfo: InsertedViewData): boolean {
        let view = new View(window.mApp.utils.makeId(), basicHtml);
        this.bgView = view.id;
        view.viewWasInsertedCallback = (id) => {
            $(`[${id}]`).on('click',(ev) => {
                ev.preventDefault()
                ev.stopImmediatePropagation();
                this.finish();
                view.finish();
            })
        }
        
        view.insertInto(new InsertedViewData(undefined,"body"))
        view.clipToParent();

        return super.insertInto(insertInfo)
    }
    
    viewWasInserted(): void {
        super.viewWasInserted();

    }

    addCell(cell: UICollectionViewCell,callback?: (index:number,dropDownMenu:DropDown) => void) {
        this.cells.push(cell);

        if (callback != undefined) {
            this.individualCallbacks[this.cells.length - 1] = callback;
        }

    }

    setFrameAndShow(): void {
        super.setFrameAndShow();
        // here we add the collection view with the cells.
        let cv = new UICollectionView(`dropDownCV${window.mApp.utils.makeId(15)}`,
        undefined,
        viewDefaultCollectionViewView);
        this.collectionView = cv.id;
        this.insertNewView(new InsertedViewData(cv.id,undefined));
        cv.clipToParent();
        this.alignContent();
        this.styleCollectionView();
        cv.dataSourceDelegate = this;
        cv.delegate = this;
        cv.reloadData();
        let cvSize = cv.getSize();

        $("body").off().on("click", (el) => {
            el.preventDefault();
            el.stopImmediatePropagation();
            if (el.clientX < this.frame.x ||
                el.clientX > this.frame.x + cvSize.width ||
                el.clientY < this.frame.y ||
                el.clientY > this.frame.y + cvSize.height ) {
                    this.finish();
                }

        })
    }

    alignContent() {
        let cv = this.getView(this.collectionView) as UICollectionView;
          if (this.direction == ElemModalDirection.bottom) {
            cv.style({
            }, `[${cv.grid.getTag()}]`)
        }

        if (this.direction == ElemModalDirection.top) {
            cv.style({
                "position" : "absolute",
                "bottom" : "0px",
                "left" : "0px",
                "right" : "0px"
            }, `[${cv.grid.getTag()}]`)
        }
    }

    collectionViewStyles = ["bg-secondary", "shadow"];
    styleCollectionView() {
        let cv = this.getView(this.collectionView) as UICollectionView;
        $(`[${cv.id}] [${cv.grid.getTag()}]`).addClass(this.collectionViewStyles)
    }


    // Collection View callbacks

    cvNumberOfItemsInSection(cv: UICollectionView, section: number): number {
        return this.cells.length;
    }
    cvNumberOfSections(cv: UICollectionView): number {
        return 1;
    }
    cvCellForItemAt(cv: UICollectionView, indexPath: IndexPath): UICollectionViewCell {
        return this.cells[indexPath.item];
    }
    cvCellForSectionAt(cv: UICollectionView, sectionCellType: UICollectionViewSectionCellType, section: number): UICollectionVievSectionCell | undefined {
        return undefined;
    }
    getSeparator?(cv: UICollectionView, indexPath: IndexPath): View | undefined {
        return undefined;
    }
    cvDidSelectItem(cv: UICollectionView, indexPath: IndexPath): void {
        if (this.individualCallbacks[indexPath.item]  != undefined) {
            this.individualCallbacks[indexPath.item]?.(indexPath.item,this);
            return;
        }
        this.callback?.(indexPath.item,this);
    }

    cvDidSelectSection(cv: UICollectionView, section: number, sectionCellType: UICollectionViewSectionCellType): void {

    }

    finish(): void {
        this.getView(this.bgView)?.finish();
        $("body").off("click")
        this.cells = [];
        this.callback = undefined;
        Object.keys(this.individualCallbacks).forEach((el) => {
            let num = window.mApp.utils.getNumberFromString(el);
            if (num != undefined) {
                delete this.individualCallbacks[Number(el)];
            }
        })
        super.finish();
    }


}