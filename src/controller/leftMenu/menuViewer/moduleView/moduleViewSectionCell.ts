import { UICollectionVievSectionCell } from "../../../../model/collectionView/collectionViewSectionCell";
import { UICollectionViewCell } from "../../../../model/collectionView/collectionViewCell";
import { UICollectionViewSectionCellType } from "../../../../model/collectionView/interfaces";
import { IndexPath } from "../../../../model/collectionView/interfaces";
import { UICollectionView } from "../../../../model/collectionView/collectionView";
import { ModuleSectionData } from "../../../../model/module/moduleDataSection";
import { ModuleData } from "../../../../model/module/moduleData";
import $ from "jquery";
import { DropDown } from "../../../../model/dropDownMenu/dropDown";
import { DefaultDropDownCell } from "../../../../model/dropDownMenu/dropDownCell";
import { viewDefaultDropDownCell } from "../../../../view/defaultViews/defaultDropDownCellView";
import { ElementModalPos, ElemModalDirection } from "../../../../model/elementModalView/elementModalView";
import { InsertedViewData } from "../../../../model/view/insertView";


enum SectionButtonEnum {
    add = "Add",
    del = "Del",
    none = "none"
}

export class LeftMenuModuleViewSection extends UICollectionVievSectionCell {

    moduleDataId : string;

    constructor(
    moduleDataId:string,
    html?:string
    ) {
       super(html)
        this.moduleDataId = moduleDataId;
    }

    viewWasInserted() {
        super.viewWasInserted()
        this.setUp();
    }

    hasSectionController = true;
    sectionButton : SectionButtonEnum = SectionButtonEnum.add;

    setUp() : this{
        super.setUp();
        let data : ModuleSectionData = window.mApp.moduleManager.moduleMap.get(this.moduleDataId) as ModuleSectionData;

        if (data == undefined) {return this};

        $(`[${this.id}] .cell-holder`).css({"left" : `${data.sections.length * 15}px`})

        let position = data.getObjectIndex()
        $(`[${this.id}] .text`).text(`${data.options?.name}`)

        if (position != undefined) {
            $(`[${this.id}] .text`).text(`${data.options?.name} ${position + 1}`)
        }

        if (!data.canModify && !(window.mApp.utils.deepCopy(data.cells).pop() instanceof ModuleSectionData)) {
            $(`[${this.id}] .section-controller`).css({"display" : "none"})
            $(`[${this.id}] .text`).css({"left" : "0.5rem"})
            this.hasSectionController = false;
        }

        if (window.mApp.utils.getNumberFromString(data.jsonPath[data.jsonPath.length - 1]) != undefined) {
            $(`[${this.id}] .bh-txt`).text("Del")
            this.sectionButton = SectionButtonEnum.del;
        }

        if (!this.hasSectionController && this.sectionButton == SectionButtonEnum.add) {
            this.sectionButton = SectionButtonEnum.none;
            $(`[${this.id}] .button-holder`).css({"display" : "none"})
        }

        if (!this.hasSectionController && this.sectionButton == SectionButtonEnum.none) {
            $(`[${this.id}] .section-distr`).css({"grid-template-columns" : "1fr"})
        }
        
        this.cellWasReloadedWithoutRedrawing()


        if (!this.hasSectionController) {return this;}

        
        $(`[${this.id}] .title`).off().on('click', (el)=> {
            el.preventDefault();
            el.stopImmediatePropagation();
          this.showHideSection(data);
        })

        $(`[${this.id}] .section-controller`).off().on('click' ,(el)=> {
            el.preventDefault();
            el.stopImmediatePropagation();
            this.showHideSection(data);
        })

        $(`[${this.id}] .button-holder`).off().on('click' ,(el)=> {
            el.preventDefault();
            el.stopImmediatePropagation();
            this.showHideSection(data,false);
            if (this.sectionButton == SectionButtonEnum.del) {
                if ((data.getSection()?.cells ?? []).length <= 1) {return}
                this.showAreYouSureToDelete($(`[${this.id}]`),() => {
                    data.finish();
                    data.getSection()?.updatePaths();
                    window.mApp.moduleManager.moduleDataUpdated();
                    let collectionView = this.getView(this.collectionViewId) as UICollectionView
                    collectionView.reloadData();
                })
            } else if (this.sectionButton == SectionButtonEnum.add) {
                data.addCell();
                data.updated();
                let collectionView = this.getView(this.collectionViewId) as UICollectionView
                collectionView.reloadData();
            }
        
           
        })


        return this;
    }
    

    showHideSection(data: ModuleSectionData,isClosed: boolean | undefined  = undefined) {
        data.hideCells(isClosed ?? !data.getOptions()["cellsHidden"]);
        
        let collectionView = this.getView(this.collectionViewId) as UICollectionView
        collectionView.updateCellsWithoutRedrawing();
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

        let data : ModuleSectionData = window.mApp.moduleManager.moduleMap.get(this.moduleDataId) as ModuleSectionData;

        if (data.getOptions()["cellsHidden"]) {
            $(`[${this.id}] img`).attr("src","./images/arrow-right.png")
        } else {
            $(`[${this.id}] img`).attr("src","./images/arrow-bottom.png")
        }
        
        if (data.isCellHidden()) {
            $(`[${this.id}]`).css({"height" : "0","display": "none"})
        } else {
            $(`[${this.id}]`).css({"height" : "2.2rem","display": ""})
        }

    }



    finish() {
        $(`[${this.id}] .title`).off();
        $(`[${this.id}] .section-controller`).off();
        $(`[${this.id}] .button-holder`).off()
        super.finish()

    }

    
}