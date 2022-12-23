
import View from "./view";
import App from "../../app";
import { AppInterface } from "../base";


export class InsertedViewData {
    view? : string;
    htmlTag?: string;

    constructor(view?:string,htmlTag?:string) {
        this.view = view;
        this.htmlTag = htmlTag;
    }

    getView(): View | undefined {
        if (this.view == undefined) {return undefined}
        return  window.mApp.views.get(this.view)
    }

    // Lets say we have a view which has a sub html tag that had this name $idsubHtmlTag.
    // Now we cant acces to that tag because the thag will replace $id with the actual id of that view.
    // So the real tag will be viewIdSubHtmlTag, so we create a new insertedViewData(viewid, $idsubHtmlTag)
    // Now when we want to get the tag of that element which is on the view we call getTag();
    getTag() : string{
        let id = this.getView()?.id
        if (id == undefined) {
            id = "";
        }

        if (this.htmlTag != undefined) {
            return this.htmlTag.replace(/\$id/gi,id);
        }

        if (this.view != undefined) {
            return this.view.replace(/\$id/gi,id);
        }
        return "";
    }
}
