import GridElement from "../../model/grid/gridElement";
import { navBarView } from "../../view/centerViews/navBar";
import $ from 'jquery'
import { ModuleManagerInterface } from "../../model/module/interfaces";




export class NavBar extends GridElement implements ModuleManagerInterface {



    constructor(id: string, html: string = navBarView) {
        super(id,html)
        window.mApp.moduleManager.moduleViewsExecutor[this.id] = this
    }



    viewWasInserted() {
        super.viewWasInserted()

        $(`[${this.id}] .save`).off().on('click', (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            window.mApp.moduleManager.saveModuleToLocalStorage();
            $(`[${this.id}] .save .test-button`).text('Saved ✓')
            setTimeout(() => {
                $(`[${this.id}] .save .test-button`).text('Save')
            },1000);
        })


        $(`[${this.id}] .export`).off().on('click', (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            window.mApp.moduleManager.saveModuleToLocalStorage();
            window.mApp.moduleManager.exportModule();
        })
    }

    moduleLoaded(): void {
    }

    moduleDataUpdated?: (() => void) | undefined;

    moduleProjectNameChanged?(): void {
    }

    moduleAutoSaved?(): void {
        $(`[${this.id}] .save .test-button`).text('Auto Saved ✓')
        setTimeout(() => {
            $(`[${this.id}] .save .test-button`).text('Save')
        },1000);
    }
    
    finish() {
        delete window.mApp.moduleManager.moduleViewsExecutor[this.id];

        super.finish()

    }

}