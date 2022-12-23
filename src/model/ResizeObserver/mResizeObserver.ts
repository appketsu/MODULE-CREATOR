import { cond } from "lodash";
import { InsertedViewData } from "../view/insertView";
import View from "../view/view";
import {ResizeConditions, ResizeObserverInterface} from "./resizeObserverInterfaces"
import $ from "jquery";


export default class MRsesizeObserver {

    insertedIntoData?: InsertedViewData;
    interface? : ResizeObserverInterface;
    resizeObserver?: ResizeObserver;
    resizeConditions: ResizeConditions[] = [];
    currentCondition: string;

    constructor(insertedIntoData:InsertedViewData,data:ResizeConditions[]) {
        this.insertedIntoData = insertedIntoData;
        this.resizeConditions = data;
        this.setUp();
    }
    
    setUp(): boolean{
        this.resizeObserver = new ResizeObserver((entries) => {
            for (var entry of entries) {
                for (var condition of this.resizeConditions) {
                    if (entry.borderBoxSize.length == 0) {continue;}
                    if (condition.condition(entry.borderBoxSize[0]!)) { // POSSIBLE ERROR?
                        this.interface?.resizeTriggered(condition);
                        this.currentCondition = condition.name;
                        return  
                    }
                }
            }
        })


        let view = this.insertedIntoData?.getView();

        if (this.insertedIntoData != undefined && view != undefined) {
            if (document.querySelector(`[${this.insertedIntoData.getTag()}]`) == undefined) {return false}
            this.resizeObserver.observe(document.querySelector(`[${this.insertedIntoData.getTag()}]`)!);
        } else {
            return false;
        }

        return true;
    }


    triggerManually() {
        let view = this.insertedIntoData?.getView();
        let el = $(`[${this.insertedIntoData?.getTag()}]`)
        if (el == undefined) {
            return;
        }
        let width = el.outerWidth();
        let height = el.outerHeight();
        if (width == undefined || height == undefined) {return;}
        let size : ResizeObserverSize = {blockSize:height!,inlineSize:width!};

        for (var condition of this.resizeConditions) {
            if (condition.condition(size)) { // POSSIBLE ERROR?
                this.interface?.resizeTriggered(condition);
                this.currentCondition = condition.name;
                return  
            }
        }

    }

    finished() {
        this.resizeObserver?.disconnect();
        this.resizeConditions = [];
        this.resizeObserver = undefined;
        if (this.interface?.observerFinished != undefined) {
            this.interface?.observerFinished();
        }
        this.interface = undefined;
    } 

}