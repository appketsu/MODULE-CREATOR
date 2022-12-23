import { map } from "lodash";
import { ModuleDataOptions, ModuleDataTypeEnum } from "./interfaces";
import { ModuleSectionData } from "./moduleDataSection";


export class ModuleData {
    jsonPath: string[];
    jsonId : string = "";
    options?: ModuleDataOptions;
    sections : string[] = []
    classType: ModuleDataTypeEnum;

    constructor(path: string[], options?:ModuleDataOptions) {
        this.jsonPath = path;
        this.options = options;
        this.classType = ModuleDataTypeEnum.cell
    }

    getSection() : ModuleSectionData | undefined  {
        return window.mApp.moduleManager.moduleMap.get(this.sections[this.sections.length - 1]) as ModuleSectionData;
    }

    setUp(json: any) : this {
        this.jsonId =  this.getId(json);

        if (!window.mApp.moduleManager.moduleMap.has(this.jsonId)) {
            window.mApp.moduleManager.moduleMap.set(this.jsonId,this);
        }
        return this;
    }

    isCellHidden() : boolean {
        let size = Object.keys(this.getOptions()["sectionsHidden"]).length;
       return size != 0
    }

    getObjectIndex() : number | undefined {
        return window.mApp.utils.getNumberFromString(this.jsonPath[this.jsonPath.length - 1]);
    }

    checkIfIdExist(json: any) : boolean {
        let mJson = json;
        mJson = window.mApp.utils.getObjectFromPath(this.jsonPath,json);
        return this.jsonId in mJson
    }

    getObject() : any | undefined {
       return window.mApp.utils.getObjectFromPath(this.jsonPath, window.mApp.moduleManager.moduleObject);
    }


    getId(json: any = window.mApp.moduleManager.moduleObject) : string {
        let mJson = json;
        mJson = window.mApp.utils.getObjectFromPath(this.jsonPath,json);

        let key = `moduleCreatorId${window.mApp.utils.makeId()}`;
        let value : {[key:string] : any} = {
            "path" : window.mApp.utils.makeId(5),
            "id" : this.jsonPath.join() + this.classType,
            "sectionsHidden" : [],
            "options" : this.options,
            "cellsHidden" : false
        }

        let mPath = this.jsonPath;

        if (Array.isArray(mJson)) {
            value["path"] = `${this.jsonPath[this.jsonPath.length - 1]}`
            let newRoute : string[] = window.mApp.utils.deepCopy(this.jsonPath).filter( (el,index) => {
               if ( index != this.jsonPath.length - 1) {return el}
            })
            mPath = newRoute;
            mJson = window.mApp.utils.getObjectFromPath(mPath,json);
        }
        
   
        for (var x of Object.keys(mJson)) {
            if (x.includes("moduleCreatorId") && (this.jsonPath.join() + this.classType) == mJson[x]["id"]) {
                window.mApp.utils.addMissingObjectKeys(mJson[x],value);
                return x;
            }
        }
        
        
        if (this.jsonId in mJson) { return this.jsonId; }

        mJson[key] = value

        return key;
    }


    getOptions() : any {
        let json = window.mApp.moduleManager.moduleObject;
        let idObject = window.mApp.utils.getObjectFromPath(this.jsonPath,json);
        if (Array.isArray(idObject)) {
            let newRoute : string[] = window.mApp.utils.deepCopy(this.jsonPath).filter( (el,index) => {
               if ( index != this.jsonPath.length - 1) {return el}
            })
            idObject = window.mApp.utils.getObjectFromPath(newRoute,json);
        }
        return idObject[this.jsonId];
    }

    updatePath(json: any = window.mApp.moduleManager.moduleObject) {
        var hasEmptyPath = false; // this is for an specific case with response and helper funcitons
        if (this.jsonPath[this.jsonPath.length - 1] == "") {hasEmptyPath = true;}
        let idPath = window.mApp.utils.getPath(this.jsonId,json);
        let idObject = window.mApp.utils.getObjectFromPath(idPath,json);

        idPath.pop();
        idPath.push(idObject["path"])

        let object = window.mApp.utils.getObjectFromPath(idPath,json);
        if (object == undefined) {
            idPath.pop();
        }

        this.jsonPath = idPath;
        if (hasEmptyPath) {
            this.jsonPath.push("")
        }
        this.getOptions()["id"] = this.jsonPath.join() + this.classType;

    }

    finish(calledFrom: string = this.jsonId) {

        let section = window.mApp.moduleManager.moduleMap.get(this.sections[this.sections.length - 1]) as ModuleSectionData;
        let jsonObject = window.mApp.moduleManager.moduleObject;
        let path = this.jsonPath

        
        let current = jsonObject;

        // Delete form module object
        for (var x = 0; x < path.length; x++) {
            var el = path[x];
            if (x == path.length - 1) {
           
                if (Array.isArray(current)) {
                    window.mApp.utils.deleteFromArray(Number(el),current)
                    continue;
                }
                delete current[el];
            } else {
                current = current[el];
            }
        }
        // Delete from Parent cells.
        if (section != undefined) {
            for (var x = 0; x < section.cells.length;x++) {
                if (this.jsonId == section.cells[x].jsonId) {
                    window.mApp.utils.deleteFromArray(x,section.cells);
                    break;
                }
            }
        }
  

        // Delete from 
        path = window.mApp.utils.getPath(this.jsonId,window.mApp.moduleManager.moduleObject)
        current = jsonObject;
        for (var y = 0; y > path.length; y++) {
            let el = path[y];
            if (path.length - 1 == y) {
                delete current[el]
                continue;
            }
            current = current[el];
        }
        
        this.options = undefined;
        // delete from module map
        window.mApp.moduleManager.moduleMap.delete(this.jsonId);
    }
}