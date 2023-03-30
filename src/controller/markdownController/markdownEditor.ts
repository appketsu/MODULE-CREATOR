import { EditorView, basicSetup } from "codemirror";
import GridElement from "../../model/grid/gridElement";
import View from "../../model/view/view";
import { placeholder} from "@codemirror/view"
import $ from "jquery"

export class MarkdownEditor extends GridElement {




    editorView?: EditorView;

    constructor(id?: string,html:string =
    `<div $id> <div class="fill-absolute">  </div> </div>`
    ) {
        super(id,html)

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


            })
        ],
            parent: document.querySelector(`[${this.id}] .fill-absolute`)!,
                doc: "hello",
            })

         
        return this;
    }

    finish(): void {
        this.editorView?.destroy();
        this.editorView = undefined;
        super.finish();
    }
    
}