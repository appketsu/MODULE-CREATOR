import { SelectionView } from "../../../model/view/viewTemplates/selectionView";
import View from "../../../model/view/view";
import { LeftMenuData, LeftMenuSubMenuCellData } from "../interfaces";



export class LeftMenuSubMenuCellController extends SelectionView {

    leftDataId : String;


    constructor(data:LeftMenuData,isSelected:boolean,id:string,html?:string) {
        var newHtml = html
        if (newHtml != undefined) {
            newHtml = newHtml.replace('$title',data.subMenuCell.name);
            newHtml = newHtml.replace('$imageUrl',data.subMenuCell.image);
        }
        super(isSelected,id,newHtml)
        this.leftDataId = data.id;
    }

    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();
    }

    setUp(): this {
        
        return this;
    }


   


}