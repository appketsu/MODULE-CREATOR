import View from "../view";
import $ from "jquery";


export interface IsSelectedInterface {

    isSelectedFlag: boolean;

    isSelected(set: boolean | undefined): boolean

}



export interface SelectedViewInterface {

    viewWasSelected(view:String) : void;

}


export class SelectionView extends View implements IsSelectedInterface{

    isSelectedFlag : boolean = false;
    selectedInterface?: SelectedViewInterface;
    constructor(isSelected:boolean,id:string,html?:string) {
        super(id,html)
        this.isSelectedFlag = isSelected;
    }

    viewWasInserted() {
        this.addClickListener()
        this.isSelectedWasSet(this.isSelectedFlag)
    }

    clickHandler(isSelected:boolean): boolean {
        // This will handle what will happen when we click 
        // we can either put the current to the contrary, or if its selected leave it as it is.
        if (!isSelected) {  return !isSelected }  

        return isSelected;
    }

    addClickListener() {
        $(`[${this.id}]`).off().on('click',(e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.isSelected(this.clickHandler(this.isSelectedFlag))
        });
    }


    isSelectedWasSet(set: boolean) { // this is what we will override in
        if (set) {
            $(`[${this.id}]`).addClass("selected")
        } else {
            $(`[${this.id}]`).removeClass("selected")
        }
    }

    isSelected(set: boolean | undefined, callBack:boolean = true): boolean {

        if (set == undefined) {
            return this.isSelectedFlag;
        }

        this.isSelectedFlag = set;


        this.isSelectedWasSet(this.isSelectedFlag); 

        if (callBack) {
            this.selectedInterface?.viewWasSelected(this.id);
        }

        return this.isSelectedFlag
    }

    finish(): void {
        this.selectedInterface = undefined;
        super.finish();
    }

}