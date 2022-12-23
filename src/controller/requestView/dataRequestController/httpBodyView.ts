import { basicSetup, EditorView } from "codemirror";
import View from "../../../model/view/view";
import { placeholder} from "@codemirror/view"
import { ModuleData } from "../../../model/module/moduleData";
import $ from "jquery";


export class HttpBodyView extends View {

    jsonId: string;

    editorView?: EditorView;

    moduleObject? : any;

    constructor(jsonId:string,id: string = window.mApp.utils.makeId(15),html:string =
    `<div $id> <div class="fill-absolute">  </div> </div>`
    ) {
        super(id,html)

        this.jsonId = jsonId;
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        this.moduleObject =  moduleData.getObject();
    }


    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();

    }

    setUp(): this {
        super.setUp();

        this.style({"overflow-y" : "auto"})
        $(`[${this.id}]`).addClass("bg-primary")
        let myTheme = EditorView.theme({
            "&": {
              color: "#E6E6E6",
              backgroundColor: "transparent"
            },
            ".cm-content": {
              caretColor: "#E6E6E6",
              padding : "10px 0 10px 0"
            },
            "&.cm-focused .cm-cursor": {
              borderLeftColor: "#E6E6E6"
            },
            "&.cm-focused .cm-selectionBackground, ::selection": {
              backgroundColor: "#3B3B3B"
            },
            ".cm-gutters": {
              backgroundColor: "transparent",
              color: "#A7A6A6",
              border: "none"
            },
            ".cm-activeLine" : {
                backgroundColor: "transparent",

            },
            ".cm-activeLineGutter" : {
                backgroundColor: "transparent",

            }
          }, {dark: true})

        $(`[${this.id}] .fill-absolute`).addClass("bg-primary")

        this.editorView = new EditorView({
            extensions: [basicSetup,myTheme,placeholder('Type the httpbody here.'),
            EditorView.updateListener.of((test) => {
                let string = test.state.doc.toString();
                if (string == "") {
                    this.moduleObject.request.httpBody = undefined;
                    return 
                }
                this.moduleObject.request.httpBody = string;
            })
        ],
            parent: document.querySelector(`[${this.id}] .fill-absolute`)!,
                doc: this.moduleObject.request.httpBody ?? "",
            })

         
        return this;
    }

    finish(): void {
        this.moduleObject = undefined;
        this.editorView?.destroy();
        this.editorView = undefined;
        super.finish();
    }

}