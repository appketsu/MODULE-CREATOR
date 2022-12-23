import { event } from "jquery";
import { map, size, xor } from "lodash";
import GrabberObserver, { ResizingStatus } from "../../grabberObserver/grabberObserver";
import { GrabberObserverInterface, ResizeData, XY } from "../../grabberObserver/grabberObserverInterfaces";
import { FromToNumber, SizeNumber } from "../../interfaces";
import { Utils } from "../../utils";
import { InsertedViewData } from "../../view/insertView";
import GridJs from "../grid";
import GridElement from "../gridElement";
import { GridDesign, GridElementDesign } from "../gridInterfaces";
import $ from "jquery";



// The html element that will handle the resizing from the separator will have the attribute $idgrabber



export default  class GridSeparator extends GridElement implements GrabberObserverInterface{

    mGrabberObserver?: GrabberObserver;

    canResize:boolean;
    constructor(id:string,html?:string,canResize:boolean = true) {
        super(id,html)
        this.canResize = canResize;
    }

    setCanResize(canResize:boolean) {
        if (this.mGrabberObserver == undefined) {return}
        this.mGrabberObserver.isActive = canResize;
        if (!this.mGrabberObserver.isActive) {
            $(`[${this.id}grabber]`).css({'opacity':'0'}).removeClass("cursor")
        } else {
            $(`[${this.id}grabber]`).css({'opacity':'1'})
            if (!$(`[${this.id}grabber]`).css({'opacity':'1'}).hasClass("cursor")) {
                $(`[${this.id}grabber]`).addClass("cursor")
            }
        }
    }




    viewWasInserted() {
        super.viewWasInserted();
        this.mGrabberObserver = new GrabberObserver(new InsertedViewData(this.id,'$idgrabber'))
        this.mGrabberObserver.interface = this;
        this.setCanResize(this.canResize)
    }


    setUp() :this { // this will be called when the view has been inserted.
        super.setUp();


        return this;
    }


    finish(): void {
        super.finish();


    }


    finished() {
        this.mGrabberObserver?.finished();
        this.mGrabberObserver = undefined;
    }
    

    getIndexSeparator() : number | undefined {
        if (this.position == undefined) {
             return undefined;
        }

        // if is an horizontal separator we return the position on the rows;

        // If is a vertical separator we return the poisition of the columns;

        // its important that we fix the values, rest 1 to the from.

        return undefined;
    }

    getSpecificGridDesign() : GridElementDesign[] | undefined{


        return undefined
    }


    getSepcificGrabberPos(pos: XY) : number  {
        
        return pos.x
    }

    insertSpecificDesign(newDesign: GridElementDesign[]) {

    }

    insertDesing(design: GridDesign) : boolean{
        let grid =  this.insertedInto.getView() as GridJs;

        if (grid.gridDesing == undefined) {return false}

        grid.gridDesing = design;

        grid.setDesign(grid.gridDesing);
        return true;
    }


    getGridSize(): SizeNumber {

        let gridSize: SizeNumber = {height: 0, width: 0};

        let gridEl =  $(`[${this.insertedInto.view}]`);

        if (gridEl != undefined) {
            let height = gridEl.outerHeight();
            let width = gridEl.outerWidth();
            if (height != undefined) {
                gridSize.height = height;
            }

            if (width != undefined) {
                gridSize.width = width;
            }
        }

        return gridSize;
    }


    getSpecificGridSize() : number {
        return this.getGridSize().height as number;
    }
    
    setCursorResize() {
        $('*').css('cursor','');

    }

    removeCursorResize() {
        $('*').css('cursor',"");
    }

    gridDesign? : GridElementDesign[];
    grabberResize(e:JQuery.Event,data?: ResizeData) {
        if (data == undefined) {return}
        
        if (data.status == ResizingStatus.started) {
            this.gridDesign = this.getSpecificGridDesign()?.map((val) => {return window.mApp.utils.deepCopy(val)});

            $(`[${this.id}grabber] > div`).addClass("separator-hover-clicked")
            $(`[${this.id}grabber] > div`).removeClass("separator-hover")
            this.setCursorResize();

        }

        if (data.status == ResizingStatus.finished) {

            $(`[${this.id}grabber] > div`).removeClass("separator-hover-clicked")
            $(`[${this.id}grabber] > div`).addClass("separator-hover")
            this.removeCursorResize();
        }

        let design: GridElementDesign[] = [];

        this.gridDesign?.forEach((el) => {design.push(window.mApp.utils.deepCopy(el))})



        let separatorIndex = this.getIndexSeparator();
        let positionFromOrigin = data?.positionFromOrigin;

        if (design == undefined || separatorIndex == undefined || positionFromOrigin == undefined) {return}

        let pos = this.getSepcificGrabberPos(positionFromOrigin)

        var makeSmallerPos = separatorIndex - 1
        var makeBiggerPos = separatorIndex + 1

        if (pos > 0) {
            makeBiggerPos = separatorIndex - 1
            makeSmallerPos = separatorIndex + 1
        } 

        if (pos < 0) {
            makeBiggerPos = separatorIndex + 1
            makeSmallerPos = separatorIndex - 1
        }

        let makeBigger = design[makeBiggerPos];
        let makeSmaller = design[makeSmallerPos];



        let gridSize = this.getSpecificGridSize();
        let currentDesign = this.getSpecificGridDesign();

        if (currentDesign == undefined) {return}

        let makeBigeerResult = makeBigger.addPx(this.getPositiveFromNumber(pos),design,gridSize, Number(currentDesign[makeBiggerPos].size))

        let makeSmallerResult = makeSmaller.addPx(this.getNegativeFromNumber(pos),design,gridSize,Number(currentDesign[makeSmallerPos].size))

        if (!makeSmallerResult || !makeBigeerResult) {
            return;
        }   

        this.insertSpecificDesign(design)

    }   

    getPositiveFromNumber(number:number) {

        if (number < 0 ) {
            return number * (-1)
        }
    
        return number
    }

    getNegativeFromNumber(number:number) {

        if (number > 0 ) {
            return number * (-1)
        }
    
        return number
    }

}

