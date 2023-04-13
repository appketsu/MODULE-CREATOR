import { ResizeConditions } from "../../../model/ResizeObserver/resizeObserverInterfaces";
import { InsertedViewData } from "../../../model/view/insertView";
import { IsSelectedInterface, SelectedViewInterface } from "../../../model/view/viewTemplates/selectionView";
import View from "../../../model/view/view";
import { leftMenuSubMenuCellView } from "../../../view/leftMenu/subMenu/leftMenuSubMenuCellView";
import { BaseGridController } from "../../baseGrid/baseGridController";
import { LeftMenuDataInterface } from "../interfaces";
import { LeftMenuGridElementController } from "../leftMenuGridElementController";
import { LeftMenuSubMenuCellController } from "./leftMenuSubMenuCellController";



export class LeftMenuSubMenuController extends View implements SelectedViewInterface {

    leftMenuDataInterface? : LeftMenuDataInterface;

    viewWasInserted() { 

        this.setUp();
    }


    setUp(): this {
        this.createCells()

        return this;
    }

    createCells()  {
        let cells = this.leftMenuDataInterface?.getLeftMenuDataArrray();
        if (cells == undefined) {return;}

        for (var x = 0; x < cells.length; x++) {
            let current = cells[x];
            let cell = new LeftMenuSubMenuCellController(current,current.selected,current.subMenuCell.viewId,leftMenuSubMenuCellView);
            this.insertNewView(new InsertedViewData(
                cell.id,
                "leftMenuSubMenuHolder"
            ))
            cell.selectedInterface = this;
        }
    }


    viewWasSelected(view: String): void {
        console.log(view)
        // we set all the other views to false except for the clicked one.
        let cells = this.leftMenuDataInterface?.getLeftMenuDataArrray();
        if (cells == undefined) {return;}

        for (var cell of cells) {
            let mView = this.getView(cell.subMenuCell.viewId) as LeftMenuSubMenuCellController
            cell.selected = false;

            if (cell.subMenuCell.viewId != view) {
                mView.isSelected(false,false)
                cell.selected = false
            } else {
                mView.isSelected(true,false)
                cell.selected = true;
                this.leftMenuDataInterface?.subMenuSelected(cell)
            } 
        } 

        this.makeGridHolderBig();
    }

    parentResized(name:String) {
        let cells = this.leftMenuDataInterface?.getLeftMenuDataArrray();
        if (cells == undefined) {return;}
        for (var cell of cells) {
            let view = this.getView(cell.subMenuCell.viewId) as LeftMenuSubMenuCellController
            if (name == "small") {
                view.isSelectedWasSet(false);
            } else {
                view.isSelected(cell.selected,false)
            }
        } 
    }



    makeGridHolderBig() {
        // Check if the size of the grid holder is either big or small, if its small make it big.
        let gridHolderView = this.getView("leftMenuGridEl") as LeftMenuGridElementController;
        let grid = this.getView("baseGrid") as BaseGridController;
        
        if (gridHolderView == undefined) {return;}

        if (gridHolderView.mResizeObserver.currentCondition == "small") {
            grid.gridDesing.columns[0].size = "350";
            grid.setDesign(grid.gridDesing);
        }
    }


    finish(): void {
        super.finish();
        this.leftMenuDataInterface = undefined;
    }


    
}