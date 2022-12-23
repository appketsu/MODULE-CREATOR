import View from "../../model/view/view";
import { PopUpView } from "../../model/view/viewTemplates/popUpView";
import { ConnectSocketController } from "../popUpControllers/connectSocketController";
import $ from "jquery";
import { ModuleManagerInterface } from "../../model/module/interfaces";
import { NewProjectController } from "../popUpControllers/newProjectController";



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
            let popUp = PopUpView.showPopUpViewOnBody(new NewProjectController().id); 
            popUp.clipToParent()
        })     
        $(`[${this.id}] .load-button`).off().on( 'click', async (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            let file: File | undefined = await this.selectFile("application/json" ,false) as File
            window.mApp.moduleManager.loadNewModule(await file.text());
        })     
        
        $(`[${this.id}] .p-name .center-v-absolute`).text(window.mApp.moduleManager.getModuleOptions()["projectName"])
        return this;
    }

    async selectFile (contentType: string, multiple: boolean){
        return new Promise(resolve => {
            let input = document.createElement('input') as HTMLInputElement;
            input.type = 'file';
            input.multiple = multiple;
            input.accept = contentType;
    
            input.onchange = _ => {
                let files = Array.prototype.slice.call(input.files);

                if (multiple)
                    resolve(files);
                else
                    resolve(files[0]);
            };
    
            input.click();
        });
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