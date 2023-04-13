import { emptyView } from "../../../view/defaultViews/emptyView";
import View from "../view";
import $ from "jquery"

export class EmptyView extends View {

title : string;
background : string;


constructor(title:string, background:string = "bg-primary", html: string = emptyView ) {
    super(undefined,html)
    this.title = title;
    this.background = background;
}




viewWasInserted(): void {
    super.viewWasInserted()
    $(`[${this.id}] .title`).text(this.title);
    $(`[${this.id}]`).addClass(this.background)


}














}