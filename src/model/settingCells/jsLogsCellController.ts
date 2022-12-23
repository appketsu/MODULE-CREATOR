


import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { TitleMessage } from "../interfaces";
import { clickCellView } from "../../view/settingsCells/clickCellView";
import { jsLogsCellView } from "../../view/settingsCells/jsLogsCell";
import { logsCellView } from "../../view/settingsCells/logsCellView";
import $ from "jquery";



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
        super.finish();
    }

}

