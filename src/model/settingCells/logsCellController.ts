



import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { TitleMessage } from "../interfaces";
import { clickCellView } from "../../view/settingsCells/clickCellView";
import { logsCellView } from "../../view/settingsCells/logsCellView";
import $ from "jquery";



export class LogsCellController extends UICollectionViewCell {

    didClick? : () => void;
    isSelected: boolean;
    title : string;
    isError: boolean;
    isSelectable:boolean;
    arrow :boolean;

    constructor(title:string,didClick?: () => void,isError:boolean = false,isSelectable:boolean = false,isSelected:boolean = false,arrow: boolean = false) {
        super(logsCellView);
        this.didClick = didClick;
        this.isSelected = isSelected;
        this.title = title;
        this.isError = isError;
        this.isSelectable = isSelectable;
        this.arrow = arrow;
    }

    viewWasInserted() {
        super.viewWasInserted();
        $(`[${this.id}]`).addClass([this.returnClass("selected",this.isSelected),
            this.returnClass("error",this.isError),
            this.returnClass("selectable",this.isSelectable),
            this.returnClass("arrow",this.arrow)
        ])
        $(`[${this.id}] .title`).text(this.title);
        $(`[${this.id}]`).off().on('click', (el) => {
            el.preventDefault();
            el.stopImmediatePropagation();
            if(this.didClick != undefined) {
                this.didClick();
            }
        })


    }

    returnClass(string:string,active:boolean) : string {
        if(active) {return string}

        return "";
    }


    finish() {
        $(`[${this.id}]`).off()
    
        super.finish();
    }

}

