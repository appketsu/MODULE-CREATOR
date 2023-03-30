import { AppInterface } from "../../model/base";
import GridJs from "../../model/grid/grid";
import GridElement, { GridElementWithView } from "../../model/grid/gridElement";
import { GridElementDesign } from "../../model/grid/gridInterfaces";
import GridSeparator from "../../model/grid/separator/separator";
import GridSeparatorVertical from "../../model/grid/separator/verticalSeparator";
import GridSeparatorHorizontal from "../../model/grid/separator/horizontalSeparator";


import { InsertedViewData } from "../../model/view/insertView";
import { viewBaseGridElement } from "../../view/baseGrid/baseGridElementView";
import { viewBaseGridVSeparator, viewBaseGridHSeparator } from "../../view/baseGrid/baseGridSeparatorView";

import { LockSize } from "../../model/grid/gridInterfaces";
import { FromToNumber } from "../../model/interfaces";
import { LeftMenuGridElementController } from "../leftMenu/leftMenuGridElementController";
import { leftMenuGridElView } from "../../view/leftMenu/leftMenuGridElView";
import { CenterViewGridElementController } from "../centerView/centerViewGridElementController";
import { CenterGridElementControllerView } from "../../view/centerViews/CenterGridElementControllerView";
import { LogsGridController } from "../logsView/logsGridController";
import { BottomStatusController } from "../bottomStatusBar/bottomStatusController";
import { NavBar } from "../navBar/navBar";
import { KetsuLogsGridView } from "../logsView/ketsuLogsViewer";
import { RightGridElementController } from "../rightController/RightGridController";
import { viewRightGridController } from "../../view/rightViews/viewRightGridControllerView";
export class BaseGridController extends GridJs {

    setUp(): this {

        this.insertInto(new InsertedViewData(undefined,"gridHolder"))
        // create and add all the elements

        
        let elements : GridElement[] = [
            new NavBar('mainNavBar'),
            new LeftMenuGridElementController('leftMenuGridEl',leftMenuGridElView),
            new GridSeparatorVertical('VS4',viewBaseGridVSeparator),
            new GridSeparatorVertical('VS3',viewBaseGridHSeparator,false),
            new CenterViewGridElementController('CenterViewGridElementController',CenterGridElementControllerView),
            new GridSeparatorVertical('VS1',viewBaseGridVSeparator),
            new GridSeparatorVertical('VS2',viewBaseGridVSeparator,true),
            new RightGridElementController('documentation',viewRightGridController),
            new GridSeparatorHorizontal('HS1',viewBaseGridHSeparator),
            new KetsuLogsGridView(new LogsGridController("logsGridController").id,"bottomLogs",undefined),
            new BottomStatusController('bottomStatusBar')
        ]

    

        this.gridElements = elements.map((el)=> { 
            // this draws all the elements and ads their ids
            this.insertNewView(new InsertedViewData(el.id,undefined)); 
            return el.id;
        })


        this.gridDistribution = [ 
        ["mainNavBar","mainNavBar","mainNavBar","mainNavBar","mainNavBar"],
        ["VS3","VS3","VS3","VS3","VS3"],
        ["leftMenuGridEl","VS4","CenterViewGridElementController","VS2","documentation"],
        ["leftMenuGridEl","VS4","HS1","VS2","documentation"],
        ["leftMenuGridEl","VS4","bottomLogs","VS2","documentation"],
        ["bottomStatusBar","bottomStatusBar","bottomStatusBar","bottomStatusBar","bottomStatusBar"]
        ]


        this.gridDesing = {
            columns : [new GridElementDesign("350","px",true,[{resize: 40,range: {from:0,to:200}},{resize: 350,range: {from:200,to:350}}],{min:40,max:400}),
            new GridElementDesign("1","px",false),
            new GridElementDesign("auto","",true,[],{min:600,max:99999999}),
            new GridElementDesign("1","px",false),
            new GridElementDesign("0","px",true,[{resize: 0,range: {from:0,to:200}},{resize: 350,range: {from:200,to:350}}],{min:0,max:3000})], 
            rows : [new GridElementDesign("50","px",false),
            new GridElementDesign("1","px",false),
            new GridElementDesign("auto","",true,[],{min:350,max:99999999}),
            new GridElementDesign("1","px",false),
            new GridElementDesign("40","px",true,[{resize: 40,range: {from:0,to:100}}]),
            new GridElementDesign("30","px",false)] 
        }

        this.setDesign(this.gridDesing);
        this.setDistribution(this.gridDistribution);

        return this;
    }
    

    setLogsViewSize(size:number) {
        this.gridDesing.rows[this.gridDesing.rows.length - 2].size = `${size}`;
        this.setDesign(this.gridDesing);
    }

    setLeftMenuViewSize(size:number) {
        this.gridDesing.columns[0].size = `${size}`;
        this.setDesign(this.gridDesing);
    }

    setDocumnetationViewSize(size:number) {
        this.gridDesing.columns[this.gridDesing.columns.length - 1].size = `${size}`;
        this.setDesign(this.gridDesing);
    }
}