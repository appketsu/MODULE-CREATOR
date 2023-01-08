import { Utils } from "../../../../../src/model/utils";
import { UICollectionView } from "../../../../model/collectionView/collectionView";
import { UICollectionViewCell } from "../../../../model/collectionView/collectionViewCell";
import { UICollectionVievSectionCell } from "../../../../model/collectionView/collectionViewSectionCell";
import { IndexPath, UICollectionViewSectionCellType } from "../../../../model/collectionView/interfaces";
import { DropDown } from "../../../../model/dropDownMenu/dropDown";
import { DefaultDropDownCell } from "../../../../model/dropDownMenu/dropDownCell";
import { ElementModalPos, ElemModalDirection } from "../../../../model/elementModalView/elementModalView";
import { ModuleData } from "../../../../model/module/moduleData";
import { InsertedViewData } from "../../../../model/view/insertView";
import { CenterViewGridElementController } from "../../../centerView/centerViewGridElementController";
import $ from "jquery";
import { viewDropDownRequestType } from "../../../../view/centerViews/dataRequestControllerView";
import { viewDefaultDropDownCell } from "../../../../view/defaultViews/defaultDropDownCellView";
import View from "../../../../model/view/view";
import { basicHtml } from "../../../../view/defaultViews/basicHtml";


export class LeftMenuModuleViewCell extends UICollectionViewCell {

    moduleDataId : string;

    constructor(
    moduleDataId : string ,
    html?:string) {
        super(html)
      this.moduleDataId = moduleDataId;
    }

    viewWasInserted() {
        super.viewWasInserted()

        this.setUp();
    }

    canRemove : boolean = false;

    setUp() : this{
        super.setUp();
        let data : ModuleData = window.mApp.moduleManager.moduleMap.get(this.moduleDataId) as ModuleData;
        let options = data.getOptions();


        $(`[${this.id}] .cell-holder`).css({"left" : `${(data.sections.length - 1) * 15}px`})

        let position = data.getObjectIndex()
        $(`[${this.id}] .title`).text(`${options["options"]["name"]}`)

        if (position != undefined) {
            $(`[${this.id}] .title`).text(`${options["options"]["name"]} ${position + 1}`)
        }

        if (window.mApp.utils.getNumberFromString(data.jsonPath[data.jsonPath.length - 1]) != undefined) {
            this.canRemove = true;

            $(`[${this.id}] .button-holder`).off().on("click",(event) => {
                event.preventDefault();
                event.stopImmediatePropagation();
                if ((data.getSection()?.cells ?? []).length <= 1) {return}
                this.showAreYouSureToDelete($(`[${this.id}]`),() => {
                    data.finish();
                    data.getSection()?.updatePaths();
                    let collectionView = this.getView(this.collectionViewId) as UICollectionView
                    collectionView.reloadData();
                    window.mApp.moduleManager.moduleDataUpdated();
                })
            })      
        }

        if (!this.canRemove) {
            $(`[${this.id}] .cell-distr`).css({"grid-template-columns" : `25px auto`})
            $(`[${this.id}] .button-holder`).css({"display" : `none`})
            $(`[${this.id}] img`).attr("src", window.mApp.utils.getImageUrl("params.png"))
        }   else {
            $(`[${this.id}] img`).attr("src", window.mApp.utils.getImageUrl("code.png"))
        }

        $(`[${this.id}] .click-select`).off().on("click",(event) => {
                        event.preventDefault();
                        event.stopImmediatePropagation();

           /* let dropDown = new DropDown((index,dropDown) => {
                dropDown.finish();
            });

            dropDown.insertInto(new InsertedViewData(undefined,"body"))

            for (var x = 0; x < 5; x++) {
                dropDown.addCell(new DefaultDropDownCell());
            }

            let thisFrame = this.getFrame();
            dropDown.generalSetUp(0,20,ElementModalPos.auto,ElemModalDirection.auto,thisFrame,thisFrame.width)
            
            */
            window.mApp.moduleManager.getModuleOptions()["selected"] = data.jsonId;
            let collectionView = this.getView(this.collectionViewId) as UICollectionView    
            let top =  document.querySelector(`[${collectionView.id}] .left-collection-view`)?.scrollTop ?? 0;
            collectionView.updateCellsWithoutRedrawing();
            (window.mApp.views.get("CenterViewGridElementController") as CenterViewGridElementController).modulePartWasSelected(data.jsonId)
            if (document.querySelector(`[${collectionView.id}] .left-collection-view`)?.scrollTop != undefined) {
                document.querySelector(`[${collectionView.id}] .left-collection-view`)!.scrollTop  = top
            }
        })

        
        this.cellWasReloadedWithoutRedrawing();

        return this;
    }

    showAreYouSureToDelete(el: JQuery<HTMLElement>,completion : () => void) {
        let htmlEl = el.get(0);

        if (htmlEl == undefined) {return}
        let modal = new DropDown();
        let dropDownCell = new DefaultDropDownCell("Delete",undefined,undefined,true,viewDefaultDropDownCell);



        dropDownCell.viewWasInsertedCallback = (id) => {
            $(`[${id}]`).addClass(["bg-secondary-dark-hover","pointer","tc-red"])
        }
        modal.addCell(dropDownCell,(index,dropwDown) => {
            dropwDown.finish();
            completion()
        })

        modal.insertInto(new InsertedViewData(undefined,"body"))
        modal.setUpWithElement(0,10,
            ElementModalPos.right,
            ElemModalDirection.bottom,
            htmlEl,
            el.outerWidth())
    }


    cellWasReloadedWithoutRedrawing() {
        super.cellWasReloadedWithoutRedrawing()

        let data : ModuleData = window.mApp.moduleManager.moduleMap.get(this.moduleDataId) as ModuleData;
        let options = data.getOptions();

        if (data.isCellHidden()) {
            $(`[${this.id}]`).css({"height" : "0","display": "none"})
        } else {
            $(`[${this.id}]`).css({"height" : "2.4rem","display": ""})
        }

        if (data.jsonId == window.mApp.moduleManager.getModuleOptions()["selected"]) {
            $(`[${this.id}] .cell-holder`).addClass("selected")
        } else {
            $(`[${this.id}] .cell-holder`).removeClass("selected")
        }
    }


    finish(): void {
        super.finish();
        $(`[${this.id}] .button-holder`).off()
    }

   
}