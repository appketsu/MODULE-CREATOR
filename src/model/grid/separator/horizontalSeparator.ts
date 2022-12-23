import { viewBaseGridHSeparator } from "../../../view/baseGrid/baseGridSeparatorView";
import { XY } from "../../grabberObserver/grabberObserverInterfaces";
import GridJs from "../grid";
import { GridElementDesign } from "../gridInterfaces";
import GridSeparator from "./separator";
import $ from "jquery";



export default class GridSeparatorHorizontal extends GridSeparator {

    constructor(id:string,html:string = viewBaseGridHSeparator,canResize:boolean = true) {
        super(id,html,canResize)
    }


    setCursorResize() {
        $('*').css('cursor','ns-resize');
    }

    getIndexSeparator() : number | undefined {
        if (this.position == undefined) {
             return undefined;
        }

        return this.position.row.from - 1;
    }
    
    getSpecificGridDesign() : GridElementDesign[] | undefined{
        let grid =  this.insertedInto.getView() as GridJs;
       
        if (grid.gridDesing == undefined) {return undefined}
        
        return grid.gridDesing.rows;
    }

    insertSpecificDesign(newDesign: GridElementDesign[]) :boolean {
        let grid =  this.insertedInto.getView() as GridJs;

        if (grid.gridDesing == undefined) {return false}

        grid.gridDesing.rows = newDesign

        grid.setDesign(grid.gridDesing);

        return true
    }


    getSepcificGrabberPos(pos: XY) : number  {
        
        return pos.y
    }


    getSpecificGridSize() : number {
        return this.getGridSize().height as number;
    }
    
}