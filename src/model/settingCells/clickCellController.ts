import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { TitleMessage } from "../interfaces";
import { clickCellView } from "../../view/settingsCells/clickCellView";
import $ from "jquery";



export class ClickCellController extends UICollectionViewCell {

    didSelect? : (selected:boolean) => boolean;
    enalbed: boolean;
    data : TitleMessage;

    constructor(data: TitleMessage,isEnabled:boolean,didSelect?: (selected:boolean) => boolean,) {
        super(clickCellView);
        this.didSelect = didSelect;
        this.enalbed = isEnabled;
        this.data = data;
    }

    viewWasInserted() {
        super.viewWasInserted();
        $(`[${this.id}] .title`).html(this.data.title);
        $(`[${this.id}] .message`).html(this.data.message);
        this.updateSelectedClass();
        $(`[${this.id}]`).off().on("click", (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            this.enalbed = !this.enalbed;
            if (this.didSelect != undefined) {
                let result = this.didSelect(this.enalbed);
                if (result) {
                    this.updateSelectedClass();
                }
            }
        });
    }

    updateSelectedClass() {
        if (this.enalbed) {
            $(`[${this.id}]`).addClass("selected")
        } else {
            $(`[${this.id}]`).removeClass("selected")
        }
    }

    finish() {
        $(`[${this.id}]`).off()
        this.didSelect = undefined
        super.finish();
    }

}


