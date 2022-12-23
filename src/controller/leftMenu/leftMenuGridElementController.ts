import { max, min } from "lodash";
import GridElement from "../../model/grid/gridElement";
import MRsesizeObserver from "../../model/ResizeObserver/mResizeObserver";
import { InsertedViewData } from "../../model/view/insertView";
import {MinMax} from "../../model/grid/gridInterfaces";
import { ResizeConditions, ResizeObserverInterface } from "../../model/ResizeObserver/resizeObserverInterfaces";
import { leftMenuSubMenuView } from "../../view/leftMenu/subMenu/leftMenuSubMenuView";
import { LeftMenuMenuViewerController } from "./menuViewer/leftMenuMenuViewerController";
import { LeftMenuSubMenuController } from "./subMenu/leftMenuSubMenuController";
import { leftMenuMenuViewerView } from "../../view/leftMenu/leftMenuMenuViewerView";
import { leftMenuTopView } from "../../view/leftMenu/leftMenuTopView";
import { LeftMenuTopController } from "./leftMenuTopController";
import { LeftMenuData, LeftMenuDataInterface } from "./interfaces";
import View from "../../model/view/view";
import { leftMenuDataset } from "./leftMenuData";
import $ from "jquery";



// ID =  "leftMenuGridEl"
// HTML = leftMenuGridElementHtml
export class LeftMenuGridElementController extends GridElement implements ResizeObserverInterface,LeftMenuDataInterface {


    mResizeObserver : MRsesizeObserver;
    subMenu: string = "";
    subMenuViewer: string = "";
    topView: string = "";

    leftMenuData = leftMenuDataset;

    constructor(id:string,html?:string) {
        super(id,html)

    }
    

    viewWasInserted() {
        this.setUp();
    }


    setUp(): this  {
        super.setUp();

        let subMenuViewer = new LeftMenuMenuViewerController("leftMenuViewer",leftMenuMenuViewerView)
        subMenuViewer.leftMenuDataInterface = this;

        this.subMenuViewer = subMenuViewer.id;

        let subMenu = new LeftMenuSubMenuController("leftMenuSubMenu",leftMenuSubMenuView);
        subMenu.leftMenuDataInterface = this;
        this.subMenu = subMenu.id;

        let topView = new LeftMenuTopController("leftMenuTop",leftMenuTopView);
        this.topView = topView.id;

        this.insertNewView(new InsertedViewData(this.subMenu,undefined));
        this.insertNewView(new InsertedViewData(this.subMenuViewer,undefined));
        this.insertNewView(new InsertedViewData(this.topView,undefined));

        
        // we set the resizers
        this.mResizeObserver = new MRsesizeObserver(new InsertedViewData(this.id,undefined),[{name:"big", 
        condition(newSize) {
            var mRange: MinMax = {min:60,max:999999}
            return newSize.inlineSize >= mRange.min && newSize.inlineSize <= mRange.max;
        }},{name:"small",
        condition(newSize) {
            var mRange: MinMax = {min:0,max:50}
            return newSize.inlineSize >= mRange.min && newSize.inlineSize <= mRange.max;
        }}])
        this.mResizeObserver.interface = this;
        this.mResizeObserver.triggerManually();

        

        return this;
    }
    

    
    resizeTriggered(condition:ResizeConditions) {
        let viewerView = window.mApp.views.get(this.subMenuViewer);
        
        switch (condition.name) {
            case "small": 
            viewerView?.isHidden(true)
            $(`[${this.id}]`).addClass("left-menu-small");
            $(`[${this.id}]`).removeClass("left-menu-big");
            break;
            case "big": 
            viewerView?.isHidden(false)
            $(`[${this.id}]`).removeClass("left-menu-small");
            $(`[${this.id}]`).addClass("left-menu-big");
            break;
        }

        let subMenuView = this.getView(this.subMenu) as LeftMenuSubMenuController;
        subMenuView!.parentResized(condition.name)
    }


    resizeFinished() { // not needed

    }
        

    getLeftMenuData(id: string): LeftMenuData | undefined {

        for (var x of this.leftMenuData) {
            if (x.id = id) {
                return x
            }
        }

        return undefined
    }
    getLeftMenuDataArrray(): LeftMenuData[] | undefined {
        
        return this.leftMenuData;
    }

    subMenuSelected(selection: LeftMenuData): void {
        let viewer = this.getView(this.subMenuViewer) as LeftMenuMenuViewerController;
        viewer.changeMenuView(selection);
    }


    finish() {
        this.mResizeObserver.finished();
        super.finish()
    }
    
    
}





