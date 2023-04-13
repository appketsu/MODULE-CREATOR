import { viewDefaultMenuSelectorCell, viewDefaultMenuSelectorCell2 } from "../../view/defaultViews/menuSelector";
import { UICollectionView } from "../collectionView/collectionView";
import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import { IndexPath, UICollectionViewFlowEnum } from "../collectionView/interfaces";
import { RectConstraints } from "../interfaces";
import View from "../view/view";
import { ViewsHolder } from "../viewsHolder/viewsHolder";
import { ModuleSelectorCell } from "./menuSelectorCell";




export class MenuSelectorLayout {


    getCellsHolderCollectionView() : UICollectionView {
        let cv =  new UICollectionView(`menuSelector${window.mApp.utils.makeId(15)}`);
        if (cv.layoutDesign == undefined) {return cv;}
        cv.layoutDesign.flow =  UICollectionViewFlowEnum.horizontal;
        cv.layoutDesign.columnsTemplate = "auto";
        cv.layoutDesign.justifyContent = "start"
        cv.layoutDesign.height = "100%"
        cv.layoutDesign.width = "100%"
        cv.layoutDesign.overflowY = "visible"
        cv.layoutDesign.overflowX = "visible"
        cv.layoutDesign.extraStyles = {"display" :"flex","flex-flow" : "row nowrap"}
        return cv;
    }

    getCellsHolderConstraints(): RectConstraints  {
        return {top:"0px",right : "0px", left: "0px",height: "40px"}
    }


    getViewsHolder(menuViews: string[]) : View {
        return new ViewsHolder("cvcell" + window.mApp.utils.makeId(15),menuViews,undefined,undefined);
    }

    getViewsHolderConstraints() : RectConstraints {
        return {top:"40px",right : "0px", bottom : "0px", left: "0px"}
    }


    getCell(cv: UICollectionView, indexPath: IndexPath,menuViews: string[],selected:boolean) : UICollectionViewCell  {
        return new ModuleSelectorCell(indexPath,cv.id,
        menuViews[indexPath.item],selected,viewDefaultMenuSelectorCell);
        
    }


    styleViewsHolder(view:View) {

    }

    styleCellsHolder(view:View) {
        view.style({
            "line-height": "1",
            "box-sizing": "border-box",
            "border-bottom" : "1px solid rgba(255,255,255,.1)",
        })
    }

    getView(id:string) : View | undefined {
        // functionality function.
        return window.mApp.views.get(id)
    }


}


export class MenuSelectorLayout2 extends MenuSelectorLayout {


  
    styleCellsHolder(view:View) {
        view.style({
            "line-height": "1",
            "box-sizing": "border-box",
            "border-bottom" : "1px solid rgba(255,255,255,.1)",
            "padding-left" : "0.5rem"
        })
    }


    getCell(cv: UICollectionView, indexPath: IndexPath,menuViews: string[],selected:boolean) : UICollectionViewCell  {
        return new ModuleSelectorCell(indexPath,cv.id,
        menuViews[indexPath.item],selected,viewDefaultMenuSelectorCell2);
    }


    getCellsHolderConstraints(): RectConstraints  {
        return {top:"0px",right : "0px", left: "0px",height: "40px"}
    }

    getViewsHolderConstraints() : RectConstraints {
        return {top:"40px",right : "0px", bottom : "0px", left: "0px"}
    }

    


}