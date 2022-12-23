import { UICollectionView } from "../../../../model/collectionView/collectionView";
import { UICollectionViewCell } from "../../../../model/collectionView/collectionViewCell";
import { UICollectionVievSectionCell } from "../../../../model/collectionView/collectionViewSectionCell";
import { IndexPath, UICollectionViewDatasource, UICollectionViewDelegate, UICollectionViewSectionCellType } from "../../../../model/collectionView/interfaces";
import { ModuleData } from "../../../../model/module/moduleData";
import { ModuleSectionData } from "../../../../model/module/moduleDataSection";
import { InsertedViewData } from "../../../../model/view/insertView";
import View from "../../../../model/view/view";
import { viewDefaultCollectionViewView } from "../../../../view/defaultViews/defaultCollectionView";
import {  leftMenuViewerModuleCellView} from "../../../../view/leftMenu/menuViewer/module/leftMenuViewerModuleCellView";
import { leftMenuViewerModuleCollectionView } from "../../../../view/leftMenu/menuViewer/module/leftMenuViewerModuleCollectionView";
import {  leftMenuViewerModuleSectionView} from "../../../../view/leftMenu/menuViewer/module/leftMenuViewerModuleSectionView";
import { LeftMenuModuleViewCell } from "./moduleViewCell";
import { LeftMenuModuleViewSection } from "./moduleViewSectionCell";


export class TestViewController extends View implements UICollectionViewDatasource,UICollectionViewDelegate {


    viewWasInserted(): void {
        super.viewWasInserted();

        this.setUp();
    }


    setUp(): this {
        super.setUp();

        let collectionView = new UICollectionView("collectionViewId",undefined,leftMenuViewerModuleCollectionView)
        collectionView.dataSourceDelegate = this;
        this.insertNewView(new InsertedViewData(collectionView.id,undefined));
        collectionView.setConstraints({top: "0px",left:"0px",right:"0px",bottom:"0px"})
        collectionView.reloadData();

        return this;
    }

    getSectionsNumber(cells: ModuleSectionData[] | ModuleData[], current: number) : number{
        let total = current
        for (var x of  cells) {
            if (x instanceof ModuleSectionData) {
                total = this.getSectionsNumber((x as ModuleSectionData).cells, total);
                total = total + 1;
            }
        }   
        return total
    }

    getSectionsArray(cells: ModuleSectionData[] | ModuleData[], foundCells: ModuleSectionData[] = []) : ModuleSectionData[]{
        let totalCells = foundCells;
        for (var x of  cells) {
            if (x instanceof ModuleSectionData) {
+
                 this.getSectionsArray((x as ModuleSectionData).cells, [x]).forEach((el) => {
                    totalCells.push(el)
                 });
            }
        }
        return totalCells;
    }


    cvNumberOfItemsInSection(cv: UICollectionView,section: number): number {
        let cells = (this.getSectionsArray(window.mApp.moduleManager.moudleParsed,[])[section] as ModuleSectionData).cells
        if (cells[Math.floor(Math.random() * cells.length)] instanceof ModuleSectionData)  {
            return 0;
        }
        return cells.length;
    }

    cvNumberOfSections(into: UICollectionView): number {
        console.log(this.getSectionsNumber(window.mApp.moduleManager.moudleParsed,0))
        return  this.getSectionsNumber(window.mApp.moduleManager.moudleParsed,0);
    }
    cvCellForItemAt(cv: UICollectionView, indexPath: IndexPath): UICollectionViewCell {
        let current = (this.getSectionsArray(window.mApp.moduleManager.moudleParsed,[])[indexPath.section] as ModuleSectionData).cells[indexPath.item];
        
        let cell = new LeftMenuModuleViewCell(current.jsonId,leftMenuViewerModuleCellView)

        return cell
    }
    cvCellForSectionAt(cv: UICollectionView, sectionCellType: UICollectionViewSectionCellType, section: number): UICollectionVievSectionCell | undefined {


        let current = (this.getSectionsArray(window.mApp.moduleManager.moudleParsed,[])[section] as ModuleSectionData)
        if (sectionCellType == UICollectionViewSectionCellType.header) {
            return new LeftMenuModuleViewSection(current.jsonId,leftMenuViewerModuleSectionView)
        }

        return undefined
    }

    cvDidSelectItem(cv: UICollectionView, indexPath: IndexPath): void {
        console.log(indexPath)
    }
    cvDidSelectSection(cv: UICollectionView, section: number, sectionCellType: UICollectionViewSectionCellType): void {
        console.log(section)
    }


}