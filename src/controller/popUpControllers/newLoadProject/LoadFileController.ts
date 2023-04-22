import { first } from "lodash";
import { KeyCodesInterface, keyCodesManager } from "../../../model/keyCodesShortcouts/keyCodesManager";
import View from "../../../model/view/view";
import { ViewsHolderViewInterface } from "../../../model/viewsHolder/viewsHolder";
import { loadFileView } from "../../../view/popUpViews/newLoadProjectView";
import $ from "jquery";

export class LoadFileController extends View  implements ViewsHolderViewInterface {


    isOnTopViewsHolder: boolean;


    constructor(html:string = loadFileView) {
        super(undefined,html)

    }


    viewWasInserted(): void {
        super.viewWasInserted()
    
        $(window).on('dragenter', (ev) => {
            ev.preventDefault();
        });
        $(`[${this.id}]`).on('dragover', (ev) =>{
            ev.preventDefault()
            ev.stopImmediatePropagation()
            $(`[${this.id}]`).text("File Detected")
        });
        $(`[${this.id}]`).on('dragleave', (ev) =>{
            ev.preventDefault()
            ev.stopImmediatePropagation()
            $(`[${this.id}]`).text("Click or drop your module here.")
        });
        $(`[${this.id}]`).on('drop', (ev) =>{
            ev.preventDefault()
            ev.stopImmediatePropagation()
            var firstFile = ev.originalEvent?.dataTransfer?.files[0]
            if (firstFile != undefined) {
                this.loadFile(firstFile)
            }
        });
        $(`[${this.id}]`).on('click', async (ev) =>{
            ev.preventDefault()
            ev.stopImmediatePropagation()
            let file: File | undefined = await this.selectFile("application/json" ,false) as File
            this.loadFile(file)
        });
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
    
    async loadFile(file: File) {
        if (!this.isOnTopViewsHolder) {return}
        let moduleText = await file.text()
        let parsed = JSON.parse(moduleText);
        let parsedName : string | undefined = parsed.moduleInfo?.moduleName;
        if (parsed == undefined || parsedName  == undefined) {
            $(`[${this.id}]`).text("Error reading Module")
            setTimeout(() => {
                $(`[${this.id}]`).text("Click or drop your module here.")
            }, 500);
            return
        }
        window.mApp.moduleManager.loadNewModule(moduleText, parsed["moduleInfo"]["moduleName"] ?? "Project")
        this.finish()
    }
    
    finish(): void {
        $(`[${this.id}]`).off()
        super.finish()
    }

}