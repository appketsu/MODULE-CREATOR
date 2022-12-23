import { InsertedViewData } from "../view/insertView";
import View from "../view/view";
import { GrabberObserverInterface, ResizeData } from "./grabberObserverInterfaces";
import $ from "jquery";

export enum ResizingStatus {
    started,
    resizing,
    finished
  }

export default class GrabberObserver {

    insertedIntoData: InsertedViewData;
    interface? : GrabberObserverInterface;
    isActive: boolean = true;


    constructor(insertedIntoData:InsertedViewData) {
        this.insertedIntoData = insertedIntoData;
        this.setUpResizing();
    }

    setUpResizing(): boolean {
        let tag = this.insertedIntoData.getTag();
        $(`[${tag}]`).on('mousedown',(e) => {
            if (!this.isActive) {return}
            this.resizingHandler(ResizingStatus.started,e)
        })

        return true;
    }

    resizeData? : ResizeData;
    resizingHandler(status:ResizingStatus,e:JQuery.Event) {
        
        if (this.resizeData == undefined && status != ResizingStatus.started) {
            this.resizeData = {status: ResizingStatus.started}
        } else {
            if (this.resizeData != undefined) {
                this.resizeData.status = status;
            }
        }

 

        switch (status ){
            case ResizingStatus.started: 
                $(`body`).on('mouseup',(e)=> {
                    this.resizingHandler(ResizingStatus.finished,e)
                });
                
                $(`body`).on('mousemove',(e)=> {
                    this.resizingHandler(ResizingStatus.resizing,e)
                });
                return;
            case ResizingStatus.resizing: 
                this.resizeMiddleMan(e,this.resizeData);
                return;
            case ResizingStatus.finished: 
                if (this.resizeData?.status != undefined) {
                    this.resizeData.status = ResizingStatus.finished
                }
                this.resize(e,this.resizeData);
                this.resizeData = undefined;
                $(`body`).off('mousemove');
                $(`body`).off('mouseup');
                return;
        }
    }

    resizeMiddleMan(e:JQuery.Event,data?: ResizeData) {
        e.preventDefault();
        if (data == undefined) {return}
        if (e.clientX == undefined) {return}
        if (e.clientY == undefined) {return}
       
        let fixedData = data;
        if (data.status == ResizingStatus.started) {
            fixedData.startPosition = {x:e.clientX,y:e.clientY}
            fixedData.currentPosition = {x:e.clientX,y:e.clientY}
            fixedData.previousPosition = {x:e.clientX,y:e.clientY}
            fixedData.positionFromOrigin ={x: e.clientX - fixedData!.startPosition!.x,y:e.clientY - fixedData!.startPosition!.y}
        } else {
            fixedData.previousPosition = fixedData.currentPosition
            fixedData.currentPosition = {x:e.clientX,y:e.clientY}
            fixedData.positionFromOrigin ={x: e.clientX - fixedData!.startPosition!.x,y:e.clientY - fixedData!.startPosition!.y}
        }
        this.resizeData = fixedData;

        if ((e as JQuery.MouseEventBase).originalEvent?.buttons == 0 && this.resizeData.status == ResizingStatus.resizing) {
            this.resizeData.status = ResizingStatus.finished;
            this.resizingHandler(this.resizeData.status!,e)
            return;
        }
        this.resize(e,this.resizeData)
    }

    
    resize(e:JQuery.Event,data?: ResizeData) { 
        this.interface?.grabberResize(e,data);
    }   


    finished() {
        let tag = this.insertedIntoData.getTag();
        $(`[${tag}grabber]`).off('mousedown');
        $(`body`).off('mousemove');
        $(`body`).off('mouseup');
        $(`[${tag}]`).off();
        if (this.interface?.grabberFinished != undefined) {
            this.interface?.grabberFinished(); 
        }
        this.interface = undefined;
    } 





}