import { KeyCodesInterface, keyCodesManager } from "../../../model/keyCodesShortcouts/keyCodesManager";
import View from "../../../model/view/view";
import { ViewsHolderViewInterface } from "../../../model/viewsHolder/viewsHolder";
import { loadFileUrlView } from "../../../view/popUpViews/newLoadProjectView";
import $ from "jquery"


export class LoadFileUrlController extends View implements ViewsHolderViewInterface, KeyCodesInterface {

    isOnTopViewsHolder: boolean;

constructor(html:string = loadFileUrlView) {
    super(undefined,html)
    keyCodesManager.shared.delegates[this.id] = this
}

viewWasInserted(): void {
    super.viewWasInserted()

    $(`[${this.id}] .input-button`).off().on('click', () => {
        this.loadFile()
    })

}

async loadFile() {
    if (!this.isOnTopViewsHolder) {return}
    let value = $(`[${this.id}] input`)?.val() as string ?? "";
    try {
        const fccUrl = new URL(value);
    } catch {
        this.showErrorStatus()
        return
    }

    $(`[${this.id}] .input-button`).text("Loading...")
    var xhttp = new XMLHttpRequest();
    xhttp.onload = () => {
        if (xhttp.status != 200) {
            this.showErrorStatus()
            return
        }
       this.loadModule(xhttp.responseText)
    };
    
    xhttp.onerror = () => {
        this.showErrorStatus()
    };
    xhttp.open("GET", value, true);
    xhttp.send();
}

loadModule(moduleText:string) {
    if (!this.isOnTopViewsHolder) {return}
    let parsed = JSON.parse(moduleText);
    let parsedName : string | undefined = parsed.moduleInfo?.moduleName;
    if (parsed == undefined || parsedName  == undefined) {
        this.showErrorStatus()
        return
    }
    window.mApp.moduleManager.loadNewModule(moduleText, parsed["moduleInfo"]["moduleName"] ?? "Project")
    this.finish()
}

showErrorStatus() {
    $(`[${this.id}] .input-button`).text("Error")
    setTimeout(() => {
        $(`[${this.id}] .input-button`).text("Load")
    }, 500);
}

keyDown(key: string): void {
    if (key == "Enter") {
        this.loadFile()
    }
}





finish(): void {
    $(`[${this.id}] .input-button`).off()
    delete keyCodesManager.shared.delegates[this.id]
    super.finish()
}


}