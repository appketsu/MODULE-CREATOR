import { javascript, javascriptLanguage, scopeCompletionSource } from "@codemirror/lang-javascript";
import { basicSetup, EditorView } from "codemirror";

import { autocompletion} from "@codemirror/autocomplete";
import {indentWithTab} from "@codemirror/commands"
import { keymap} from "@codemirror/view"

import { InsertedViewData } from "../../../model/view/insertView";
import View from "../../../model/view/view";
import { dracula } from "../../../model/codeMirror/dracula";
import { javascriptControllerView } from "../../../view/centerViews/javascriptControllerView";
import { ModuleData } from "../../../model/module/moduleData";
import $ from "jquery";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';


export class JavascriptController extends View {

    editorView?: EditorView;
    monacoEditor?: monaco.editor.IStandaloneCodeEditor;
    jsonId: string;
    moduleObject? : any;

    constructor(jsonId: string,id:string = window.mApp.utils.makeId(),html: string = javascriptControllerView) {
        super(id,html)

        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews")
        this.jsonId = jsonId;
    }

    viewWasInserted(): void {
        super.viewWasInserted()
        $(`[${this.id}]`).addClass('bg-primary');

            setTimeout(() => {
                this.setUpMonaco()
            }, 50);
          
    }

    setUpMonaco() {
        //this.setUp()
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        this.moduleObject = moduleData.getObject();
        let js : string = this.moduleObject.javascriptConfig.javaScript;
        if (js.split(/\n/g).length < 5) {
            js = this.beautifyJs(js);
            this.moduleObject.javascriptConfig.javaScript = js;
        }

        monaco.editor.defineTheme('my-theme', {
            base: 'vs-dark', 
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#212221',
                'scrollbar.shadow' : 'none',
                'scrollbarSlider.background' : '#3B3B3B',
                "scrollbarSlider.hoverBackground" : "#3B3B3B",
                "scrollbarSlider.activeBackground" : "#3B3B3B"
            }
        })

        this.monacoEditor = monaco.editor.create(document!.querySelector(`[${this.insertViewsDefault?.getTag()}]`)!, {
            value: js,
            language: 'javascript',
            minimap: { enabled: false,scale: 0 },
            automaticLayout : true,
            theme: "my-theme",
            fontSize: 15,
            fontWeight : "400px",
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: true,
            readOnly: false,
            wordWrap: 'on',
            wrappingStrategy : 'advanced',
            fixedOverflowWidgets: true,
            guides: {
                indentation: false
            },
            scrollbar: {
                // Subtle shadows to the left & top. Defaults to true.
                useShadows: false,
        
                // Render vertical arrows. Defaults to false.
                verticalHasArrows: false,
                // Render horizontal arrows. Defaults to false.
                horizontalHasArrows: false,
        
                // Render vertical scrollbar.
                // Accepted values: 'auto', 'visible', 'hidden'.
                // Defaults to 'auto'
                vertical: "visible",
                // Render horizontal scrollbar.
                // Accepted values: 'auto', 'visible', 'hidden'.
                // Defaults to 'auto'
                horizontal: "hidden",
        
                verticalScrollbarSize: 7,
                horizontalScrollbarSize: 7,
                arrowSize: 30,
            },

        });

        $('.decorationsOverviewRuler').css('width',0)
        this.monacoEditor.onDidChangeModelContent( (e) => {
            this.moduleObject.javascriptConfig.javaScript = this.monacoEditor?.getValue()

        });

        let options = moduleData.getOptions();

        this.monacoEditor.revealLine(options["javascriptEditorScroll"] ?? 1)

    }


    setUp(): this {
        super.setUp()
        $(`[${this.id}]`).addClass('bg-primary');
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        this.moduleObject = moduleData.getObject();
        let js : string = this.moduleObject.javascriptConfig.javaScript;
        if (js.split(/\n/g).length < 5) {
            js = this.beautifyJs(js);
            this.moduleObject.javascriptConfig.javaScript = js;
        }
        this.editorView= new EditorView({
            extensions: [basicSetup, javascript(),javascriptLanguage.data.of({
                autocomplete: scopeCompletionSource(globalThis)
                }),dracula,
            autocompletion({
                icons : false,
            }),
            EditorView.lineWrapping,
            keymap.of([indentWithTab]),
            EditorView.updateListener.of((test) => {
                //console.log(this.editorView?.state.doc.lineAt(this.editorView.state.selection.main.head))

                if (test.docChanged) {
                    this.moduleObject.javascriptConfig.javaScript = test.state.doc.toString();
                }
            }),

        ],
        parent: document.querySelector(`[${this.insertViewsDefault?.getTag()}]`)!,
            doc: js,
        })


        let options = moduleData.getOptions();

        if (!window.mApp.utils.isChrome()) {return this;}

        if (document.querySelector(`[${this.insertViewsDefault?.getTag() ?? ""}]`)?.scrollTop != undefined ) {
            return this;
            // THIS SUCKS I KNOW. CUNT. Anwyways i didnt want to look on the documentation and since it doesnt load fully you cant scroll directly to the coordinates.
            // So! ill need to go through the documenatation of code mirror to find a better way to save the position of the code and scroll to it. 
            // If you want to contribute to this project this is the only thing i want anyone to do on MY code. 
            // // comment inside a comment.
            setTimeout(() => {
                $(`[${this.insertViewsDefault?.getTag() ?? ""}]`).animate({
                    scrollTop:options["javascriptEditorScroll"] ?? 0
                }, 20);
                setTimeout(() => {
                    $(`[${this.insertViewsDefault?.getTag() ?? ""}]`).animate({
                        scrollTop:options["javascriptEditorScroll"] ?? 0
                    }, 20);
                }, 20);
            }, 20);
    
        }

        return this;
    }

    beautifyJs(js:string) : string {
        var beautify = require('js-beautify').js;

        let fixedJs = beautify(js, 
            {
                "indent_size": 8,
                "indent_char": " ",
                "indent_with_tabs": false,
                "editorconfig": false,
                "eol": "\n",
                "end_with_newline": true,
                "indent_level": 0,
                "preserve_newlines": true,
                "max_preserve_newlines": 10,
                "space_in_paren": true,
                "space_in_empty_paren": true,
                "jslint_happy": false,
                "space_after_anon_function": true,
                "space_after_named_function": true,
                "brace_style": "collapse",
                "unindent_chained_methods": true,
                "break_chained_methods": false,
                "keep_array_indentation": false,
                "unescape_strings": false,
                "wrap_line_length": 0,
                "e4x": false,
                "comma_first": false,
                "operator_position": "before-newline",
                "indent_empty_lines": false,
                "templating": ["auto"]
            }
        );


        return fixedJs;
    }

    findFirstVisibleLine() {

    }
  

    finish(): void {
        let moduleData = window.mApp.moduleManager.moduleMap.get(this.jsonId) as ModuleData;
        if (moduleData != undefined) {
            moduleData.getOptions()["javascriptEditorScroll"] = this.monacoEditor?.getVisibleRanges()[0].endLineNumber;
            console.log(this.monacoEditor?.getVisibleRanges())
            //debugger
        }
        this.editorView?.destroy();
        this.monacoEditor?.dispose()
        this.monacoEditor = undefined
        this.editorView = undefined;
        super.finish()
    }



}


