import { head } from "lodash";
import { ModuleData } from "../../../model/module/moduleData";
import { ModuleSectionData } from "../../../model/module/moduleDataSection";
import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { viewHtmlHeaders } from "../../../view/centerViews/headersView";
import $ from "jquery";



// WE ALWAYS NEED ONE HEADER.
// WE SAVE THE HEADER

interface ModuleHeader {
    key: string,
    value: string,
    moduleCreatorHeaderisActive?: boolean
}


export class HeadersView extends View {

    jsonId: string;
    headers = new Map<string, ModuleHeader>();

    headersTable : InsertedViewData;

    constructor(jsonId:string,html=viewHtmlHeaders) {
        super(`headersView${window.mApp.utils.makeId(15)}`,html)
        this.jsonId = jsonId;
        this.headersTable = new InsertedViewData(this.id,"$idheadersTable");
    }



    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();
    }

    fixHeaders() {
        // in case there is no headers or there is a header between that is empty or that there is no empty header at the end.
        let keys = Array.from(this.headers.keys());

        if (keys.length <= 0 || this.headers == undefined) {
            this.headers.set(window.mApp.utils.makeId(15),{key: "",value:"",moduleCreatorHeaderisActive:true});
        }

        let deleteHeaders : string[] = [];
        for (var x = 0; x < keys.length; x++) {
            let headerKey = keys[x];
            let header = this.headers.get(headerKey)
            if (header == undefined) {continue;}
            if (x != keys.length - 1 && header.key == "" && header.value == "") {
                deleteHeaders.push(headerKey);
            }
        }

        deleteHeaders.forEach((string) => {
            this.headers.delete(string);
            this.removeListeners(string);
        })

        keys = Array.from(this.headers.keys());
        let last = this.headers.get(keys[keys.length - 1]);
        
        if (last == undefined || last.key != "" || last.value != "") {
            this.headers.set(window.mApp.utils.makeId(15),{key: "",value:"",moduleCreatorHeaderisActive:true});
        }
    }

    drawHeaders() {

        let htmlString = `
            <tr>
            <td>
                <div  class="key-holder"> 
                    <div class="checkbox-holder"> 

                    <input $id  type='checkbox' class="ignore center-absolute checkbox" checked >
                    </div>
                    <div class="relative"> 
                        <input $id class="input-header-key header-input" placeholder="Key">
                    </div>
                </div>
            </td>
            <td class="relative">
                <input $id class="input-header-value header-input" placeholder="Value">
            </td>
            </tr>
        `;

        var finalHtml = '<tr> <th> <div class="key-holder"> <div class="checkbox-holder"> </div> <div class="relative elem-padding-equal-wide-only center-v-flex"> Key </div> </div> </th> <th class="elem-padding-equal-wide-only">Value</th> </tr> <tr>';
        let keys = Array.from(this.headers.keys());
        for (var x = 0; x < keys.length; x++) {
            let headerKey = keys[x];
            this.removeListeners(headerKey)
            finalHtml += htmlString.split("$id").join(headerKey);
        }

        $(`[${this.id}] [${this.headersTable.getTag()}]`).html(finalHtml);

        for (var x = 0; x < keys.length; x++) {
            let headerKey = keys[x];
            let header = this.headers.get(headerKey)
            if (header == undefined) {continue}
            this.addListenersToInput(headerKey,header);
        }
    }

    addListenersToInput(headerKey: string, header: ModuleHeader) {
        $(`[${this.id}] [${headerKey}].input-header-key`).val(header?.key ?? "");
        $(`[${this.id}] [${headerKey}].input-header-value`).val(header?.value ?? "");
        $(`[${this.id}] [${headerKey}].checkbox`).prop('checked', header.moduleCreatorHeaderisActive);

        $(`[${this.id}] [${headerKey}].checkbox`).off().on('click', (el) => {
            
            header.moduleCreatorHeaderisActive = $(el.target).is(':checked');
        })


        $(`[${this.id}] [${headerKey}].input-header-key`).off().on('blur', (el) => {
            let selected = this.headers.get(headerKey)
            if (selected != undefined) {
                selected.key = ($(el.target).val() as string) ?? "";
            }
            this.fixHeaders();
            this.drawHeaders();
            this.updateModuleHeaders();
        });
        $(`[${this.id}] [${headerKey}].input-header-value`).off().on('blur', (el) => {
            let selected = this.headers.get(headerKey)
            if (selected != undefined) {
                selected.value = ($(el.target).val() as string) ?? "";
            }
            this.fixHeaders();
            this.drawHeaders();
            this.updateModuleHeaders();
        });
    }

    removeListeners(headerKey: string) {
        $(`[${this.id}] [${headerKey}].input-header-key`).off();
        $(`[${this.id}] [${headerKey}].input-header-value`).off();
        $(`[${this.id}] [${headerKey}].checkbox`).off();
    }

    updateModuleHeaders() {
        // Sets the headers into the module json.
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        moduleData.getObject().request.headers = Array.from(this.headers.values());
    }

    setUp(): this {
        super.setUp();

        this.style({"overflow-y" : "auto"})

        // GET THE HEADERS
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        let headers : ModuleHeader[] = moduleData.getObject().request.headers;
        // FIX THE HEADERS IN CASE THERE ARE NONE SO THERE IS ATLEAST ONE.

        headers.forEach((header) => {
            if (header.moduleCreatorHeaderisActive == undefined) {
                header.moduleCreatorHeaderisActive = true;
            }
            this.headers.set(window.mApp.utils.makeId(15),header)
        });
        

        this.fixHeaders();
        // DRAW THE HEADERS.
        this.drawHeaders();
        this.updateModuleHeaders();

        return this;
    }


    finish(): void {
        let keys = Array.from(this.headers.keys());
        for (var x = 0; x < keys.length; x++) {
            let headerKey = keys[x];
            this.removeListeners(headerKey)
        }
        
        keys.forEach((x) => {
            this.headers.delete(x)
        })
        super.finish();
    }



}