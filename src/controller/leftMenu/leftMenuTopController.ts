import View from "../../model/view/view";
import { PopUpView } from "../../model/view/viewTemplates/popUpView";
import { ConnectSocketController } from "../popUpControllers/connectSocketController";
import $ from "jquery";
import { ModuleManagerInterface } from "../../model/module/interfaces";
import { NewProjectController } from "../popUpControllers/newProjectController";
import { NewLoadProjectController } from "../popUpControllers/newLoadProject/newLoadProjectController";



export class LeftMenuTopController extends View implements ModuleManagerInterface {


    constructor(id:string,html?:string) {
        super(id,html)
        window.mApp.moduleManager.moduleViewsExecutor[this.id] = this;
    }



    viewWasInserted() {
        this.setUp();
    }


    setUp(): this  {
        super.setUp();
        console.log("creating shit")

        $(`[${this.id}] .new-button`).off().on('click',  (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            PopUpView.showPopUpViewOnBody(new NewLoadProjectController(undefined,"New",).id); 
        })     
        $(`[${this.id}] .load-button`).off().on( 'click', async (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            PopUpView.showPopUpViewOnBody(new NewLoadProjectController(undefined,"Load File").id); 

        })     
        
        $(`[${this.id}] .p-name .center-v-absolute`).text(window.mApp.moduleManager.getModuleOptions()["projectName"])
        return this;
    }

    
    moduleLoaded(): void {
        // This will load the current selection as a new view.

        this.setUp()
    }


    moduleDataUpdated?(): void {

    }

    moduleProjectNameChanged?(): void {
        $(`[${this.id}] .p-name .center-v-absolute`).text(window.mApp.moduleManager.getModuleOptions()["projectName"])
    };


    
  
    finish() {
        delete window.mApp.moduleManager.moduleViewsExecutor[this.id] ;
        $(`[${this.id}] .new-button`).off()
        $(`[${this.id}] .load-button`).off()
        super.finish()

    }
 

    
}