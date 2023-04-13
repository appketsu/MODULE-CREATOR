import { EditorView, basicSetup } from "codemirror";
import GridElement from "../../model/grid/gridElement";
import View from "../../model/view/view";
import { placeholder} from "@codemirror/view"
import $ from "jquery"
import {markdown,markdownLanguage} from "@codemirror/lang-markdown"
import {EditorState} from "@codemirror/state"

import {languages} from "@codemirror/language-data"
import { draculaMarkdown } from "../../model/codeMirror/dracula";
import { javascript } from "@codemirror/lang-javascript";
import { testingMarkdown } from "./markdownViewer";
import { autocompletion} from "@codemirror/autocomplete";
import { basicHtml } from "../../view/defaultViews/basicHtml";
import { MarkdownInterface } from "./markdownInterface";
import { update } from "lodash";
import _ from "lodash";
import {indentWithTab} from "@codemirror/commands"
import { keymap} from "@codemirror/view"

export class MarkdownEditor extends GridElement {


    editorView?: EditorView;
    delegate?: MarkdownInterface
    updateBuildScrollTimeout?: number = undefined;
    scrollMap? : number[] = undefined;

    constructor(id?: string,html:string = basicHtml,delegate?: MarkdownInterface
    ) {
        super(id,html)
        this.setInsertDefaultViews()
        this.delegate = delegate
    }


    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();

    }


    setUp(): this {
        super.setUp();

        this.style({"overflow-y" : "auto"})
        $(`[${this.id}]`).addClass("bg-primary")
       
        $(`[${this.id}] .fill-absolute`).addClass("bg-primary")
        $(`[${this.id}]`).off().on('scroll', (el)=> {
            this.syncResultScroll( )
        })
        this.updateEditor()
        return this;
    }



    updateEditor() {
        let isActive = this.delegate?.getController().isEditorActive ?? false
        this.editorView?.destroy()
        if (!isActive) {return}
        this.editorView = new EditorView({
            extensions: [basicSetup,markdown({
                base : markdownLanguage,
                codeLanguages : languages                ,
            }),
            autocompletion({
                icons: false
            }),
            keymap.of([indentWithTab]),
            EditorView.lineWrapping,draculaMarkdown,placeholder('Start editing your note here, the format is Markdown.'),
            EditorView.updateListener.of((test) => {
                
                this.syncResultScroll(true)
                
            })
        ],
            parent: document.querySelector(`[${this.id}] .fill-absolute`)!,
                doc: this.delegate?.getNote()?.noteData ?? "",
            })


  
      
    }
    
    updateViewer() {
        let data = this.editorView?.state.doc.toString() ?? "";
        let note = this.delegate?.getNote()
        if (note != undefined) {
            note.noteData = data;
        }
        this.delegate?.getViewer()?.udpateWithNoteText(data)
    }


     syncResultScroll = _.debounce((shouldUpdateText: boolean = false) => {
        
        let isActive = this.delegate?.getController().isEditorActive
        if (!isActive) {return}
        var viewerView = this.delegate?.getViewer();

        if (shouldUpdateText) {
            this.updateViewer()
        }

        var textarea = $(`[${this.id}]`),
            lineHeight = parseFloat($(`[${this.id}] .cm-line`).css('line-height')),
            lineNo, posTo;
        if (textarea == undefined || viewerView == undefined) {return}
        lineNo = Math.floor((textarea?.scrollTop() ?? 0) / lineHeight);
        this.scrollMap =  this.buildScrollMap() ?? []
        if (this.scrollMap == undefined) {return}
        posTo = this.scrollMap[lineNo];
        $(`[${viewerView.id}] .markdown-holder`).stop(true).animate({
          scrollTop: posTo
        }, 100, 'linear');
    }, 50, { maxWait: 50 })
      

    buildScrollMap() : number[] | undefined{
        var i, offset : number, nonEmptyList, pos, a, b, lineHeightMap : number[], linesCount,
            acc : number, sourceLikeDiv : JQuery<HTMLElement>, textarea = $(`[${this.id}] .cm-line`),
            _scrollMap, viewerView = this.delegate?.getViewer();
  
        if (textarea == undefined || viewerView == undefined) {
            
            console.log("getting fucked")
            return}
  
        sourceLikeDiv = $('<div />').css({
          position: 'absolute',
          visibility: 'hidden',
          height: 'auto',
          width: textarea[0].clientWidth,
          'font-size': textarea.css('font-size'),
          'font-family': textarea.css('font-family'),
          'line-height': textarea.css('line-height'),
          'white-space': textarea.css('white-space')
        }).appendTo('body');
      
        offset = ($(`[${viewerView.id}] .markdown-holder`)?.scrollTop() ?? 0) - ($(`[${viewerView.id}] .markdown-holder`)?.offset()?.top ?? 0);
        _scrollMap = [];
        nonEmptyList = [];
        lineHeightMap = [];
      
        acc = 0;

        (this.editorView?.state.doc.toString())?.split('\n').forEach(function (str) {
          var h, lh;
          lineHeightMap.push(acc);
      
          if (str.length === 0) {
            acc++;
            return;
          }
          sourceLikeDiv.text(str);

          h = parseFloat(sourceLikeDiv.css('height'));
          lh = parseFloat(sourceLikeDiv.css('line-height'));
    
          acc += Math.round(h / lh);
        });
        sourceLikeDiv.remove();
        lineHeightMap.push(acc);

        linesCount = acc;
        for (i = 0; i < linesCount; i++) { _scrollMap.push(-1); }
      
        nonEmptyList.push(0);
        _scrollMap[0] = 0;
      
        $(`[${viewerView.id}] .line`).each(function (n, el) {
          var $el = $(el), t = $el.data('line');
          if (el == undefined) {return}
          if (t === '') { return; }
          t = lineHeightMap[t];
          if (t !== 0) { nonEmptyList.push(t); }
          _scrollMap[t] = Math.round(($el.offset()?.top ?? 0) + offset);
        });
      
        nonEmptyList.push(linesCount);
        _scrollMap[linesCount] = $(`[${viewerView.id}] .markdown-holder`)[0].scrollHeight;
      
        pos = 0;
        for (i = 1; i < linesCount; i++) {
          if (_scrollMap[i] !== -1) {
            pos++;
            continue;
          }
      
          a = nonEmptyList[pos];
          b = nonEmptyList[pos + 1];
          _scrollMap[i] = Math.round((_scrollMap[b] * (i - a) + _scrollMap[a] * (b - i)) / (b - a));
        }
      
        return _scrollMap;
      }

    finish(): void {
        this.editorView?.destroy();
        this.delegate = undefined
        this.editorView = undefined;
        super.finish();
    }
    
}