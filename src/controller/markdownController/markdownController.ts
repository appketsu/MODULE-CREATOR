import GridJs from "../../model/grid/grid";
import GridElement from "../../model/grid/gridElement";
import { GridElementDesign } from "../../model/grid/gridInterfaces";
import GridSeparatorVertical from "../../model/grid/separator/verticalSeparator";
import { InsertedViewData } from "../../model/view/insertView";
import { viewBaseGridVSeparator } from "../../view/baseGrid/baseGridSeparatorView";
import { MarkdownEditor } from "./markdownEditor";
import { MarkdownToolBar } from "./markdownToolBar";
import $ from "jquery";
import { markdownViewer } from "./markdownViewer";
import GridSeparatorHorizontal from "../../model/grid/separator/horizontalSeparator";

export class MarkdownController extends GridJs {


viewWasInserted(): void {
    super.viewWasInserted()


    let elements : GridElement[] = [
        new MarkdownToolBar('markdownToolbar'),
        new GridSeparatorVertical('VS10',undefined,false),
        new GridSeparatorVertical('VS11',undefined,false),
        new MarkdownEditor('markdownEditor'),
        new GridSeparatorHorizontal('HS10',undefined,false),
        new markdownViewer('markdownViewer')
    ]

    this.gridElements = elements.map((el)=> { 
        // this draws all the elements and ads their ids
        this.insertNewView(new InsertedViewData(el.id,undefined)); 
        return el.id;
    })


    this.gridDistribution = [ 
    ["markdownToolbar","markdownToolbar","markdownToolbar"],
    ["VS10","VS10","VS10"],
    ["markdownEditor","VS11","markdownViewer"],
    ["markdownEditor","VS11","markdownViewer"],
    ["markdownEditor","VS11","markdownViewer"],
    ]


    this.gridDesing = {
        columns : [new GridElementDesign("1","fr",false),
        new GridElementDesign("1","px",false),
        new GridElementDesign("1fr","",false)], 
        rows : [new GridElementDesign("39","px",false),
        new GridElementDesign("1","px",false),
        new GridElementDesign("1","fr",false),
       ] 
    }

    this.setDesign(this.gridDesing);
    this.setDistribution(this.gridDistribution);

}




}
