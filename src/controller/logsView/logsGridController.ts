import GridJs from "../../model/grid/grid";
import GridElement, { GridElementWithView } from "../../model/grid/gridElement";
import { GridElementDesign } from "../../model/grid/gridInterfaces";
import GridSeparatorVertical from "../../model/grid/separator/verticalSeparator";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { viewBaseGridElement } from "../../view/baseGrid/baseGridElementView";
import { viewBaseGridVSeparator } from "../../view/baseGrid/baseGridSeparatorView";
import { viewBaseGridHtml } from "../../view/baseGrid/baseGridView";
import { KetsuLogsViewerController } from "./ketsuLogsViewer";
import { LogsViewerHolderController } from "./logsViewer/logsViewerHolderController";



export class LogsGridController extends GridJs {

    constructor(id:string = window.mApp.utils.makeId(), html : string = viewBaseGridHtml) {
        super(id,html)

    }

    viewWasInserted() {
        super.viewWasInserted()

        this.setUp();

    }

    setUp() : this { 

        super.setUp()

            // create and add all the elements
            let elements : GridElement[] = [
                new GridElementWithView(new KetsuLogsViewerController().id,'rightLogs'),
                new GridSeparatorVertical('VSBL',viewBaseGridVSeparator),
                new GridElementWithView(new LogsViewerHolderController("LogsViewerHolderController").id,'leftLogs'),
            ]

            
            this.gridElements = elements.map((el)=> { 
                // this draws all the elements and ads their ids
                this.insertNewView(new InsertedViewData(el.id,undefined)); 
                return el.id;
            })
    
    
            this.gridDistribution = [ 
            ["leftLogs","VSBL","rightLogs"]
            ]
    
    
            this.gridDesing = {
                columns : [
                new GridElementDesign("auto","",true,[],{min:300,max:99999999}),
                new GridElementDesign("1","px",false),
                new GridElementDesign("350","px",true,[{resize: 40,range: {from:0,to:150}},{resize: 350,range: {from:150,to:350}}],{min:0,max:400})], 
                rows : [new GridElementDesign("1","fr",false)] 
            }
    


            this.setDesign(this.gridDesing);
            this.setDistribution(this.gridDistribution);



        return this;
    }
    

    showKetsuLogs() {
        this.gridDesing.columns[2].size = "350";
        this.setDesign(this.gridDesing);
    }

    

}