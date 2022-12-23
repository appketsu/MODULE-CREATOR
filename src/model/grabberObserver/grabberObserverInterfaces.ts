import { ResizingStatus } from "./grabberObserver";



export interface GrabberObserverInterface {

    grabberResize(e:JQuery.Event,data?: ResizeData):void
    grabberFinished?() : void;
}




export interface XY {
    x: number;
    y: number;
}


export interface ResizeData {
    startPosition?: XY
    previousPosition?: XY;
    currentPosition?: XY;
    positionFromOrigin?:XY;
    status: ResizingStatus;
}
