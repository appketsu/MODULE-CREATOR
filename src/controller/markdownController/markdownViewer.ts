import GridElement from "../../model/grid/gridElement";
import View from "../../model/view/view";
import { markdownView } from "../../view/rightViews/markdownView";
import { MarkdownInterface } from "./markdownInterface";




export class MarkdownViewer extends GridElement {


    delegate?: MarkdownInterface;

    constructor(id?: string ,html: string  = markdownView,delegate?: MarkdownInterface) {
        super(id,html)
        this.delegate = delegate;
        //this.noteId = noteId;
    }

    viewWasInserted(): void {
        super.viewWasInserted()
        this.udpateWithNoteText(this.delegate?.getNote()?.noteData ?? "")
    }

    udpateWithNoteText(text:string) {
      let mText = text;
      if (mText == "") {
        mText = `## This is the Note Viewer.
- This note is empty, start editing the note on the Note Editor, you can toggle it by clicking on the pencil icon on the top right.

- You can change the Note title and description clicking on the third button starting from the right.

- If you make this window bigger, the Note editor will move from below to the side.

- The format of the notes is Markdown, you can find a quick cheatsheet [here](https://devhints.io/markdown).
        `
      }
      var hljs = require('highlight.js');

      var md = require('markdown-it')({
          html: true,
          linkify: true,
          typographer: true,
          highlight: function (str : string, lang : string) {
              if (lang && hljs.getLanguage(lang)) {
                try {
                  return '<pre style="color:#A7A6A6;" class="hljs"><code>' +
                         hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                         '</code></pre>';
                } catch (__) {}
              }
          
              return '<pre style="color:#A7A6A6;" class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
            }
        });

        md.renderer.rules.paragraph_open = md.renderer.rules.heading_open = this.injectLineNumbers;

        var result = md.render(mText);
        let html = document.querySelector(`[${this.id}views]`)
        if (html != undefined) {
          html.innerHTML = result
          html.querySelectorAll('a').forEach((el) => {
              el.target = '_blank'
          })
        }
    }    

    injectLineNumbers(tokens : any, idx : any, options : any, env : any, slf : any) {
      var line;
      if (tokens[idx].map && tokens[idx].level === 0) {
        line = tokens[idx].map[0];
        tokens[idx].attrJoin('class', 'line');
        tokens[idx].attrSet('data-line', String(line));
      }
      return slf.renderToken(tokens, idx, options, env, slf);
    }


    finish(): void {
      this.delegate = undefined;
        super.finish()
        
    }

}


export const testingMarkdown = `
__Advertisement :)__

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
i18n with plurals support and easy syntax.

You will like those projects!

---

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
- Marker character change forces new list start:
* Ac tristique libero volutpat at
+ Facilisis in pretium nisl aliquet
- Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`

Start numbering with offset:

57. foo
1. bar


## Code

Inline \`code\`

Indented code

// Some comments
line 1 of code
line 2 of code
line 3 of code


Block code "fences"

\`\`\`
Sample text here...
\`\`\`

Syntax highlighting

\`\`\` js
function $initHighlight(block, cls) {
    try {
      if (cls.search(/\bno\-highlight\b/) != -1)
        return process(block, true, 0x0F) +
               \` class=""\`;
    } catch (e) {
      /* handle exception */
    }
    for (var i = 0 / 2; i < classes.length; i++) {
      if (checkCondition(classes[i]) === undefined)
        console.log('undefined');
    }
  
    return (
      <div>
        <web-component>{block}</web-component>
      </div>
    )
  }
  
  export  $initHighlight;
\`\`\`

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"



`