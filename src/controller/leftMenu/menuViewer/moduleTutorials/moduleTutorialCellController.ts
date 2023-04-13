import { UICollectionViewCell } from "../../../../model/collectionView/collectionViewCell";
import { PopUpView } from "../../../../model/view/viewTemplates/popUpView";
import { moduleNotesCellView } from "../../../../view/leftMenu/menuViewer/moduleNotes/moduleNotesCell";
import { AlertOption, AlertWithOptions } from "../../../popUpControllers/alertWithOptions";
import { ConnectSocketController } from "../../../popUpControllers/connectSocketController";
import { ModuleTutorialStructure } from "./moduleTutorialsInterface";
import $ from "jquery";

export class ModuleTutorialCellController extends UICollectionViewCell {


    moduleTutorial? : ModuleTutorialStructure;

     constructor(html:string = moduleNotesCellView,moduleTutorial:ModuleTutorialStructure) {
        super(html)
        this.moduleTutorial = moduleTutorial;
     }


     viewWasInserted(): void {
         super.viewWasInserted()
         $(`[${this.id}] .buttons-holder`).css("grid-template-columns","min-content 0px 0px")
         $(`[${this.id}] .separator`).css("display","none")
         $(`[${this.id}] .more-button`).css("display","none")
         $(`[${this.id}] .open-button`).text("Load module")
         if ((this.moduleTutorial?.moduleName ?? "") == "") {
            $(`[${this.id}] .title`).text("Title is empty.");
        } else {
            $(`[${this.id}] .title`).text(this.moduleTutorial?.moduleName ?? "");
        }
        if ((this.moduleTutorial?.moduleDesc ?? "") == "") {
            $(`[${this.id}] .desc`).text("The Note has no description.");
        } else {
            $(`[${this.id}] .desc`).text(this.moduleTutorial?.moduleDesc ?? "");
        }

        $(`[${this.id}] .open-button`).off().on('click',(ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            let options : AlertOption[] = [
            {title : "Load Module",
            didClick : () => {
                console.log("did click load")
                this.loadModule();
            }},
            {title : "Exit",
            didClick : () => {
                console.log("did click exit")
            } }
            ]
            let popUp = PopUpView.showPopUpViewOnBody(new AlertWithOptions(`${this.moduleTutorial?.moduleName}`, `If you load this module tutorial your current project will be replaced. Its recommended to export your current project so you don\`t lose it.`,options).id); 
        })
     }

     async loadModule() {
        $(`[${this.id}] .open-button`).text("Loading...")
        let jsonData = require(`../../../../../moduleTutorials/${this.moduleTutorial?.moduleFileName}`);
        window.mApp.moduleManager.loadNewModule(JSON.stringify(jsonData));

        $(`[${this.id}] .open-button`).text("Load module")
     }

     finish(): void {
        this.moduleTutorial = undefined
         super.finish()
     }
}