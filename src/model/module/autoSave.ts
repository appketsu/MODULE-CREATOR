


export class AutoSave {

    static shared : AutoSave = new AutoSave();
    
    stopAutoSave: boolean = false;

    constructor() {

    }

    start() {
        setInterval(() => {
            if (window.mApp.moduleManager.moduleObject != undefined && !this.stopAutoSave) {
                console.log("AutoSaving the module.")
                window.mApp.moduleManager.saveModuleToLocalStorage();
                Object.values(window.mApp.moduleManager.moduleViewsExecutor).forEach( (el) => el.moduleAutoSaved?.())
            } else {
                console.log("falied saving the module.")
            }
        }, 1000 * 30);
    }
}