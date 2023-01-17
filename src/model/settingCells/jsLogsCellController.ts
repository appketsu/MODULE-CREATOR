


import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { TitleMessage,RectNumber } from "../interfaces";
import { clickCellView } from "../../view/settingsCells/clickCellView";
import { jsLogsCellView } from "../../view/settingsCells/jsLogsCell";
import { logsCellView } from "../../view/settingsCells/logsCellView";
import $ from "jquery";
import { ElemModalDirection, ElementModalPos } from "../elementModalView/elementModalView";
import { InsertedViewData } from "../view/insertView";
import { DropDown } from "../dropDownMenu/dropDown";
import { DefaultDropDownCell } from "../dropDownMenu/dropDownCell";
import { viewDefaultDropDownCell } from "../../view/defaultViews/defaultDropDownCellView";



export class JSLogsCellController extends UICollectionViewCell {

  
    string : string;
    error : boolean;

    constructor(title:string,error:boolean = false) {
        super(jsLogsCellView);
        this.string = title;
        this.error = error;
    }

    viewWasInserted() {
        super.viewWasInserted();
        this.setData()
        $(`[${this.id}]`).off().on("contextmenu",(e) => {
            console.log("hello world")
            this.didOpenContextMenu(e,() => {

            });
            return false;
        });


    }

    didOpenContextMenu(ev: JQuery.Event,completion : () => void) {
        let modal = new DropDown();
        let dropDownCell = new DefaultDropDownCell("Open on window",undefined,undefined,true,viewDefaultDropDownCell);

        dropDownCell.viewWasInsertedCallback = (id) => {
            $(`[${id}]`).addClass(["bg-secondary-dark-hover","pointer","tc-t-primary"])
        }

        modal.addCell(dropDownCell,(index,dropwDown) => {
            dropwDown.finish();
        })

        modal.insertInto(new InsertedViewData(undefined,"body"))
        modal.generalSetUp(0,10,
            ElementModalPos.right,
            ElemModalDirection.bottom,
            {x:ev.clientX ?? 0,y:ev.clientY ?? 0,width:0,height:0},
            200)
    }

    async setData() {

        $(`[${this.id}]`).addClass([this.returnClass("error",this.error),
                
        ])

        $(`[${this.id}] .title`).text(this.string);

    }

    returnClass(string:string,active:boolean) : string {
        if(active) {return string}

        return "";
    }


    finish() {
        $(`[${this.id}]`).off();
        super.finish();
    }

}

