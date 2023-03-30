import { viewBaseGridVSeparator } from "../../../view/baseGrid/baseGridSeparatorView";
import { XY } from "../../grabberObserver/grabberObserverInterfaces";
import GridJs from "../grid";
import { GridElementDesign } from "../gridInterfaces";
import GridSeparator from "./separator";
import $ from "jquery";




export default class GridSeparatorVertical extends GridSeparator {
    
    constructor(id?:string ,html:string = viewBaseGridVSeparator,canResize:boolean = true) {
        super(id,html,canResize)
    }

    setCursorResize() {
        
        $('*').css('cursor','ew-resize');

    }

    getIndexSeparator() : number | undefined {
        if (this.position == undefined) {
             return undefined;
        }

        return this.position.column.from - 1;
    }


    getSpecificGridDesign() : GridElementDesign[] | undefined{
        let grid =  this.insertedInto.getView() as GridJs
       
        if (grid.gridDesing == undefined) {return undefined}
        
        return grid.gridDesing.columns;
    }

    insertSpecificDesign(newDesign: GridElementDesign[]) : boolean {
        let grid =  this.insertedInto.getView() as GridJs;

        if (grid.gridDesing == undefined) {return false}

        grid.gridDesing.columns = newDesign

        grid.setDesign(grid.gridDesing);

        return true;
    }


    getSepcificGrabberPos(pos: XY) : number  {
        
        return pos.x
    }


    getSpecificGridSize() : number {
        return this.getGridSize().width as number;
    }
    

}