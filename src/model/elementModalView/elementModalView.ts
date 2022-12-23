import { viewDefaultElementModal } from "../../view/defaultViews/elementModalView";
import { PointNumber, RectNumber, SizeNumber, SizeNumberOptional } from "../interfaces";
import { InsertedViewData } from "../view/insertView";
import View from "../view/view";

// THIS CLASS ALLOWS YOU TO SHOW A MODAL VIEW OF A DETERMINED SIZE ON THE SIDE OF AN ELEMENT.

export enum ElementModalPos {
    left,
    right,
    center,
    auto
}

export enum ElemModalDirection {
    bottom,
    top,
    auto
} 





export class ElementModalView extends View {
    // Data variables
    element?: Element;
    elFrame : RectNumber;
    gap: number;
    margin: number;
    size: SizeNumberOptional

    // Positon of Modal View
    position : ElementModalPos;
    direction : ElemModalDirection;
    frame : RectNumber = {x: 0,y:0 , height: 0, width : 0}
    
    constructor() {
        super(window.mApp.utils.makeId(15),viewDefaultElementModal)
        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews")
    }

    setUpWithElement(
        gap:number,
        margin: number = gap,
        position: ElementModalPos = ElementModalPos.auto,
        direction : ElemModalDirection = ElemModalDirection.auto,
        el: Element,
        width?: number
    ) {

        this.generalSetUp(gap,margin,position,direction,window.mApp.utils.getFrameFromElement(el),width)
    }

    setUpWithFrame(
        gap:number,
        margin: number = gap,
        position: ElementModalPos = ElementModalPos.auto,
        direction : ElemModalDirection = ElemModalDirection.auto,
        elFrame: RectNumber,
        width?: number
    ) {

    }

    setUpWithPoint(
        gap:number,
        margin: number = gap,
        position: ElementModalPos = ElementModalPos.auto,
        direction : ElemModalDirection = ElemModalDirection.auto,
        point: PointNumber,
        width?: number
        ) {

    }

    generalSetUp(        
        gap:number,
        margin: number = gap,
        position: ElementModalPos = ElementModalPos.auto,
        direction : ElemModalDirection = ElemModalDirection.auto,
        elFrame: RectNumber,
        width?: number) {
            this.gap = gap;
            this.margin = margin;
            this.position = position;
            this.direction = direction;
            this.elFrame = elFrame;
            let farmeWidth = this.elFrame.width;
            this.frame.width = width ?? farmeWidth;
            this.findAutoPositions();
            this.setFrameAndShow();
    }

    findAutoPositions() {
        let centerEl = window.mApp.utils.getCenter(this.elFrame);
        let viewPort = window.mApp.utils.windowSize();

        if (this.position == ElementModalPos.auto) {
           
            if (centerEl.x > viewPort.width / 2)  {
                this.position = ElementModalPos.left;
            } else {
                this.position = ElementModalPos.right;
            }    
        }

        if (this.direction != ElemModalDirection.auto) {
            return;
        }

        if (centerEl.y > viewPort.height / 2) {
            this.direction = ElemModalDirection.top;
        } else {
            this.direction = ElemModalDirection.bottom;
        }
   
    }


    setFrameAndShow() {

        //Find auto positions;
        let document = window.mApp.utils.windowSize();
   
        // LEFT BOTTOM
        if (this.position == ElementModalPos.left && this.direction == ElemModalDirection.bottom) {
            this.frame.height = document.height - this.elFrame.y - this.margin;
            this.frame.x = this.elFrame.x - this.frame.width - this.gap;
            this.frame.y = this.elFrame.y
        }

        // LEFT TOP;
        if (this.position == ElementModalPos.left && this.direction == ElemModalDirection.top) {
            this.frame.height = this.elFrame.y + this.elFrame.height - this.margin;
            this.frame.x = this.elFrame.x - this.gap - this.frame.width;
            this.frame.y = this.margin
        }

        // RIGHT BOTTOM
         if (this.position == ElementModalPos.right && this.direction == ElemModalDirection.bottom) {
            this.frame.height = document.height - this.margin -  this.elFrame.y;
            this.frame.x = this.elFrame.x + this.elFrame.width + this.gap;
            this.frame.y = this.elFrame.y;
         }


        // RIGHT BOTTOM
        if (this.position == ElementModalPos.right && this.direction == ElemModalDirection.top) {
         this.frame.height = this.elFrame.y + this.elFrame.height - this.margin;
         this.frame.x = this.elFrame.x + this.elFrame.width +  this.gap;
         this.frame.y = this.margin;

        }


        // CENTER BOTTOM
        if (this.position == ElementModalPos.center && this.direction == ElemModalDirection.bottom) {
            this.frame.height = document.height - (this.elFrame.y + this.elFrame.height + this.gap + this.margin) ;
            this.frame.x = this.elFrame.x + (this.elFrame.width / 2) - (this.frame.width / 2);
            this.frame.y = this.elFrame.y + this.elFrame.height +  this.gap;
        }

        // CENTER TOP
        if (this.position == ElementModalPos.center && this.direction == ElemModalDirection.top) {
            this.frame.height = this.elFrame.y - this.gap - this.margin;
            this.frame.x = this.elFrame.x + (this.elFrame.width / 2) - (this.frame.width / 2);
            this.frame.y = this.margin;
        }   

        this.setConstraints({left: `${this.frame.x}px`,
        top: `${this.frame.y}px`,
        height: `${this.frame.height}px`,
        width : `${this.frame.width}px`
        })

    }




    finish(): void {
        super.finish();
    }

}