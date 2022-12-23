import { contains, data } from "jquery";
import { viewDefaultCollectionViewView } from "../../view/defaultViews/defaultCollectionView";
import { SizeNumber } from "../interfaces";
import { InsertedViewData } from "../view/insertView";
import View from "../view/view";
import { UICollectionViewCell } from "./collectionViewCell";
import { UICollectionViewLayoutDesign } from "./collectionViewLayoutDesign";
import { UICollectionVievSectionCell } from "./collectionViewSectionCell";
import { IndexPath, UICollectionViewDatasource, UICollectionViewDelegate, UICollectionViewSectionCellType } from "./interfaces";
import $ from "jquery";


export class UICollectionView extends View  {


    layoutDesign?: UICollectionViewLayoutDesign = new UICollectionViewLayoutDesign();

    delegate?: UICollectionViewDelegate;
    dataSourceDelegate?: UICollectionViewDatasource;

    grid: InsertedViewData;

    scrollTop = 0;

    constructor(id:string = window.mApp.utils.makeId(),grid?: InsertedViewData,html:string = viewDefaultCollectionViewView) {
        super(id,html);

        this.grid = grid ??  new InsertedViewData(this.id,"$idgrid");

    }

    viewWasInserted() {
        super.viewWasInserted();  
        this.setUp();

    }

    setUp(): this {
        super.setUp();
        this.designUpdated();
        return this;
    }

    reloadData() {
        for (var x of this.insertedViews) {
            let view = x.getView();
            view?.finish();
        }
        
        if (this.dataSourceDelegate != undefined) {
            let totalSections = this.dataSourceDelegate.cvNumberOfSections(this);
            let insertIntoId = this.grid?.getTag()
            for (let sectionNumb = 0; sectionNumb < totalSections; sectionNumb++) {
                var totalItems = this.dataSourceDelegate.cvNumberOfItemsInSection(this,sectionNumb);

                let header = this.dataSourceDelegate.cvCellForSectionAt(this,
                    UICollectionViewSectionCellType .header,
                    sectionNumb); 


                if (header != undefined) {
                    header.sectionCellType  = UICollectionViewSectionCellType.header
                    header.indexPath = {section: sectionNumb, item : 0}
                    header.collectionViewId = this.id;
                    this.insertNewView(new InsertedViewData(header.id,insertIntoId))
                }
                this.setDelegatesToSectionCell(header?.id,sectionNumb,UICollectionViewSectionCellType.header)

                for (let itemNumber = 0; itemNumber < totalItems; itemNumber++) {
                    let indexPath = {section:sectionNumb,item:itemNumber};
                    let cell = this.dataSourceDelegate.cvCellForItemAt(this,indexPath);
                    cell.indexPath = indexPath;
                    cell.collectionViewId = this.id;
                    this.insertNewView(new InsertedViewData(cell.id,insertIntoId));
                    this.setDelegateToCell(cell.id,indexPath)
                    if (itemNumber != totalItems - 1){
                        let separator = this.dataSourceDelegate.getSeparator?.(this,indexPath);
                        if (separator != undefined) {this.insertNewView(new InsertedViewData(separator.id))}
                    } 
                }

                let footer = this.dataSourceDelegate.cvCellForSectionAt(this,
                    UICollectionViewSectionCellType .footer,
                    sectionNumb);
                if (footer != undefined) {
                    footer.sectionCellType  = UICollectionViewSectionCellType.footer
                    footer.indexPath = {section: sectionNumb, item : 0}
                    footer.collectionViewId = this.id;
                    this.insertNewView(new InsertedViewData(footer.id,insertIntoId))
                }
                this.setDelegatesToSectionCell(footer?.id,sectionNumb,UICollectionViewSectionCellType.footer)
            }
        }
    }


    scrollTo(indexPath: IndexPath) {
        let cell = document.querySelector(`[${this.getCellAt(indexPath)?.id ?? "asdsdfddfads"}]`);
        console.log("Thisi is the cell")
        console.log(cell)
        if (cell == undefined) {
            return;
        }
        console.log(cell.scrollHeight)

        cell.scrollIntoView();

    }

    getScrollTop() : number{
        return document.querySelector(`[${this.grid.getTag()}]`)?.scrollTop ?? 0
    }

    setScrollTop(scrollTop:number)  {
        if (document.querySelector(`[${this.grid.getTag()}]`)?.scrollTop != undefined) {
            document.querySelector(`[${this.grid.getTag()}]`)!.scrollTop  = scrollTop
        }
    }

    getSize(): SizeNumber {
        let el = $(`[${this.id}] [${this.grid.getTag()}]`);
        return {width : el.width() ?? 0,height: el.height() ?? 0}
    }

    updateCellsWithoutRedrawing() {
        let scrollTop = this.getScrollTop()
        console.log("UPDATING CELLS WITHOUT READRAWWING")
        for (var x of this.insertedViews) {
            let view = x.getView() as UICollectionViewCell;
            view?.cellWasReloadedWithoutRedrawing();
        }
        this.setScrollTop(scrollTop)
    }

    setDelegateToCell(viewId: string,indexPath: IndexPath) {
        if (this.delegate == undefined) {return}

        $(`[${viewId}]`).off('click').on('click' ,(el)=> {
            el.preventDefault();
            el.stopImmediatePropagation();
            this.delegate?.cvDidSelectItem(this,indexPath);
        })

    }

    setDelegatesToSectionCell(viewId: String | undefined,section:number,sectionCellType: UICollectionViewSectionCellType ) {
        if (viewId == undefined) {return}
        if (this.delegate == undefined) {return}

        $(`[${viewId}]`).off('click').on('click',(ev)=> {
            ev.stopPropagation();
            ev.preventDefault();
            this.delegate?.cvDidSelectSection(this,section,sectionCellType);
        })
    }
    

    getCellAt(indexPath:IndexPath) : UICollectionViewCell | undefined{
        let cellId = $(`[UICVID="${this.id}"][UICVSection="${indexPath.section}"][UICVItem="${indexPath.item}"][UICVCellType="cell"]`).attr("UICVViewId");
        if (cellId == undefined) {return undefined}
        
        return this.getView(cellId) as UICollectionViewCell;
    }

    getCellForSectionAt(section:number,sectionCellType: UICollectionViewSectionCellType) : UICollectionVievSectionCell | undefined{
        let cellId = $(`[UICVID="${this.id}"][UICVSection="${section}"][UICVCellType="${sectionCellType}"]`).attr("UICVViewId")
        
        if (cellId == undefined) {return undefined}

        return this.getView(cellId) as UICollectionVievSectionCell;
    }


    designUpdated() {
        if (this.layoutDesign == undefined) {return}
        $(`[${this.grid?.getTag() ?? ""}]`).css(this.layoutDesign.getStyle(this))

    } 

    finish(): void {
        // this already goes through the inserted views and callls finish which calls removeDelegates and remove 
        // the delegates from the cell

        this.layoutDesign = undefined;
        this.delegate = undefined;
        this.dataSourceDelegate = undefined;
        super.finish();
    }

}




