import { ModuleDataOptions, ModuleDataTypeEnum } from "./interfaces";
import { ModuleData } from "./moduleData";


export class ModuleSectionData extends ModuleData{
    cellsJsonPath: string; // we will use the json path + the cellsJsonPath to have acces to the cells path.
    cells : ModuleSectionData[] | ModuleData[];
    canModify: boolean = false
    parsed = false;
    savedCells : ModuleSectionData[] | ModuleData[] = [];

    constructor(path: string[],cells:ModuleSectionData[] | ModuleData[],options: ModuleDataOptions) {
        super(path,options);
        this.cells = cells;
        this.classType = ModuleDataTypeEnum.section;

    }

    setUp(json: any) : this{
        super.setUp(json)
        let object = window.mApp.utils.getObjectFromPath(this.jsonPath, json);
        this.savedCells = window.mApp.utils.deepCopy(this.cells);
        let isSection = window.mApp.utils.deepCopy(this.cells).pop() instanceof ModuleSectionData ;
        
        this.cells = [];

        if (Array.isArray(object)) {
            this.canModify = true;
            for (var x = 0; x < object.length; x++) {
                let newPath = window.mApp.utils.deepCopy(this.jsonPath)
                newPath.push(`${x}`);
                if (isSection) {
                    this.cells.push(this.createSection(newPath,this.savedCells).setUp(json));
                    continue;
                } 

                (this.cells as ModuleData[]).push(this.createCell(newPath).setUp(json));
            }
        } else {
            for (var s of this.savedCells) {
                let newPath = window.mApp.utils.deepCopy(this.jsonPath)
                if (!(s instanceof ModuleSectionData)) {
                    s.options = {name : this.options?.listName ?? ""}
                }
                s.sections = window.mApp.utils.deepCopy(this.sections)
                s.sections.push(this.jsonId);

                for (var x  = 0; x < s.jsonPath.length; x++) {
                    if (newPath[x] != s.jsonPath[x]) {
                        newPath.push(s.jsonPath[x])
                    }
                }
                s.jsonPath = newPath;
                (this.cells as any[]).push(s.setUp(json))
            }
        }
        this.parsed = true;
        return this;
    }


    updated(json: any = window.mApp.moduleManager.moduleObject) {
        // This gets called each time we add or remove an object
        let object = window.mApp.utils.getObjectFromPath(this.jsonPath, json);
        let isSection = window.mApp.utils.deepCopy(this.cells).pop() instanceof ModuleSectionData ;

        if (Array.isArray(object)) { 
            for (var s = 0; s < object.length; s++) {
                let x = object[s];
                var found = false;
                for (var y of Object.keys(x)) {
                    if (y.includes("moduleCreator")) {
                        found = true;
                    }
                }

                if (!found) {
                    let newPath = window.mApp.utils.deepCopy(this.jsonPath)
                    newPath.push(`${s}`);
                    if (isSection) {
                        this.cells.push(this.createSection(newPath,this.savedCells).setUp(json));
                        break;
                    } 
    
                    (this.cells as ModuleData[]).push(this.createCell(newPath).setUp(json));
                }
            }

        } else {
            for (var r of this.cells) {
                if (r instanceof ModuleSectionData) {
                    r.updated(json)
                }
            }
        }



    }

    createSection(jsonPath: string[],cells:ModuleSectionData[] | ModuleData[]) : ModuleSectionData {
        let section = new ModuleSectionData(jsonPath,cells,{name: this.options?.listName ?? ""});
        section.sections = window.mApp.utils.deepCopy(this.sections)
        section.sections.push(this.jsonId);
        return section;
    }

    createCell(jsonPath: string[]): ModuleData {
        let cell = new ModuleData(jsonPath,{name : this.options?.listName ?? ""});
        cell.sections = window.mApp.utils.deepCopy(this.sections)
        cell.sections.push(this.jsonId);
        return cell
    }

    addCell() {// Cell was added from the Add button.
        let lastCell = this.cells[this.cells.length - 1];
        let copyOfJson = window.mApp.utils.deepCopy(window.mApp.utils.getObjectFromPath(lastCell.jsonPath,window.mApp.moduleManager.moduleObject))
        if (copyOfJson?.javascriptConfig?.loadInWebView != undefined)  {
            copyOfJson.javascriptConfig.loadInWebView =false
        }
        if (copyOfJson?.javascriptConfig?.removeJavascript != undefined)  {
            copyOfJson.javascriptConfig.removeJavascript =false
        }

        window.mApp.utils.removeKeysThatMatch("moduleCreator",copyOfJson);

        let current = window.mApp.moduleManager.moduleObject

        this.jsonPath.forEach((el) => {
            current = current[el];
        })
        if (Array.isArray(current)) {
            current.push(copyOfJson);
        }

    }

    hideCells(flag:boolean,calledFrom: string = this.jsonId) {

        if (calledFrom == this.jsonId) {
            if (this.getOptions()?.cellsHidden != undefined) {
                this.getOptions().cellsHidden = flag;
            }
        }
        for (var x of this.cells) {
            let sectionsHidden = x.getOptions()["sectionsHidden"] as Array<string>;
            if (x instanceof ModuleSectionData) {
                (x as ModuleSectionData).hideCells(flag,calledFrom)
            }
            if (flag && !sectionsHidden.includes(calledFrom)) { // hide cells
                sectionsHidden.push(calledFrom);
            } else {
                window.mApp.utils.deleteFromArray(sectionsHidden.indexOf(calledFrom),sectionsHidden)
            }
        }
        console.log(this.getOptions())
        console.log(this.jsonPath)
    }

    updatePaths(json: any = window.mApp.moduleManager.moduleObject): void {
        for (var x of this.cells) {
            if (x instanceof ModuleSectionData) {
                x.updatePaths(json);
            }
            x.updatePath(json);

        }
    }

    updateCells() {

    }

    getAllCells() : string[] {
        let newFound : string[] = [];

        for (var x of this.cells) {
            newFound.push(x.jsonId);

            if (x instanceof ModuleSectionData) {
                x.getAllCells().forEach((el) => {
                    newFound.push(el)
                });
            }

        }

        return newFound;
    }

    finish(calledFrom: string = this.jsonId): void {

        if (this.jsonId == calledFrom) {
            let foundIds: string[] = this.getAllCells();
            foundIds.reverse();
            for (var x of foundIds)  {
                let cell = window.mApp.moduleManager.moduleMap.get(x);
                cell?.finish("skrrrskfjdskjfskljflksjdl");
            }
            super.finish("sdfsdffdssf");
            return;
        }
        super.finish();
    }

} 

