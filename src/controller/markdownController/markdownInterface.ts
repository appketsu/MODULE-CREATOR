import { ModuleNote } from "../../model/moduleNotes/moduleNotesInterfaces";
import { MarkdownController } from "./markdownController";
import { MarkdownEditor } from "./markdownEditor";
import { MarkdownToolBar } from "./markdownToolBar";
import { MarkdownViewer } from "./markdownViewer";

export interface MarkdownInterface {

    getController() : MarkdownController 
    getEditor() : MarkdownEditor | undefined
    getToolBar() : MarkdownToolBar | undefined
    getViewer() : MarkdownViewer | undefined
    getNote() : ModuleNote | undefined
    

}