import { buttonView } from "../../../view/defaultViews/buttonView";
import View from "../view";
import $ from 'jquery'

export class ButtonView extends View {

    constructor(id:string = window.mApp.utils.makeId(),html:string = buttonView ) {
        super(id,html)
    }

    setImage(image: string) {
        $(`[${this.id}] img`).attr('src' , window.mApp.utils.getImageUrl(image));
    }

    finish(): void {
        $(`[${this.id}]`).off()
        super.finish();
    }

}