
import { FromToNumber } from "../interfaces";

export interface MBoundsLimit {
    height : MinMax;
    width : MinMax;
}

export  interface MinMax {
    min : number;
    max : number;
}


export interface GridElementPosition {
    column : FromToNumber;
    row : FromToNumber;
}

export interface GridDesign {
    columns : GridElementDesign[];
    rows : GridElementDesign[];
}




export interface LockSize {
    resize?: number; // if the size is between this numbers we set the size to this value.
    range: FromToNumber;
}


export class  GridElementDesign {
    size: string; // This will be height or width depending on it being column or row.
    magnitude:string;
    isResizable: boolean;
    limitBounds: MinMax = {min:0,max:999999};
    lockSizes?: LockSize[] | undefined; // Disable resize & force width or height

    constructor(size:string,magnitude:string,isResizable:boolean,lockSizes: LockSize[] | undefined = undefined,limitBounds: MinMax = {min:40,max:999999}) {
        this.size = size;
        this.magnitude = magnitude;
        this.isResizable = isResizable;
        this.limitBounds = limitBounds;
        this.lockSizes = lockSizes;
    }


    isAuto() : boolean{
        return this.size == "auto"
    }


    addPx(px:number,gridDesignElements: GridElementDesign[],gridSize:number,previousSize:number): boolean  { // the grid size will either represent height or width.

        let parsedNewSize = 0;


        if (this.isAuto() ) {
            parsedNewSize = gridSize;
            for (let x of gridDesignElements) {
                if (x.size == "auto") {continue;}
                parsedNewSize -= Number(x.size);
            } 
        } else {
            parsedNewSize = Number(this.size) + px;
        }


        // we check the limit size and we fix it so it doesnt go above and below.

        if (parsedNewSize >= this.limitBounds.max) {
            parsedNewSize = this.limitBounds.max;
            if (this.isAuto()) {return false;}
        }

        if (parsedNewSize <= this.limitBounds.min) {
            parsedNewSize = this.limitBounds.min;
            if (this.isAuto() && px < 0) {return false;}
        }
        
        // we check the disabed resizes and update the size in case we are between them.

        if (this.lockSizes != undefined) {
            for (var disabled of this.lockSizes) {
                if (parsedNewSize >= disabled.range.from && parsedNewSize <= disabled.range.to) {
                    if (this.isAuto()) {return false;}
                    if (disabled.resize != undefined) {parsedNewSize = disabled.resize}
                    break;
                }
            }
        }

         


        if (this.size != "auto" ) {
            if (previousSize == parsedNewSize) {
                return false;
            }
            this.size = `${parsedNewSize}`;
        }
        return true;

    }

 

}



