
import GrabberObserver, { ResizingStatus } from "../model/grabberObserver/grabberObserver";
import { GrabberObserverInterface, ResizeData } from "../model/grabberObserver/grabberObserverInterfaces";
import { InsertedViewData } from "../model/view/insertView";
import View from "../model/view/view";
import $ from "jquery";


export class TestGrab extends View implements GrabberObserverInterface {


    mGrabberObserver?: GrabberObserver;
    

    firstTop: number;
    firstLeft : number;

    constructor(id:string,html:string,top:number = 0, left:number = 0) {
        super(id,html)
        this.firstTop = top;
        this.firstLeft = left;
    }

    viewWasInserted(): void {
        super.viewWasInserted();
        $(`[${this.id}]`).css({'top':`${this.firstTop}px`,'left':`${this.firstLeft}px`})
        this.mGrabberObserver = new GrabberObserver(new InsertedViewData(this.id,undefined))
        this.mGrabberObserver.interface = this;

    }

        top : number;
        left: number;
    grabberResize(e: JQuery.Event, data?: ResizeData | undefined): void {
        if (data?.positionFromOrigin == undefined) {return}
        if (data.status == ResizingStatus.started) {
            this.top = Number($(`[${this.id}]`).css("top").replace('px',''))
            this.left =  Number($(`[${this.id}]`).css("left").replace('px',''))
        }

        $(`[${this.id}]`).css({'top':`${this.top + data!.positionFromOrigin!.y}px`,'left':`${this.left + data!.positionFromOrigin!.x}px`})

        var testGrab = new  TestGrab(`${window.mApp.utils.makeId(50)}`,'<img $id src="https://static.tvtropes.org/pmwiki/pub/images/rin_ryuji_higurashi_cut_in.png">',(this.top + data!.positionFromOrigin!.y),(this.left + data!.positionFromOrigin!.x));
        testGrab.insertInto(new InsertedViewData(undefined,'body'))

    }



} 


