import { indexOf } from "lodash";
import { ModuleNote, ModuleNotesInterface } from "./moduleNotesInterfaces"
import { quickDocNotes } from "./quickDocNotes";





export class ModuleNotesManager {

    static shared : ModuleNotesManager = new ModuleNotesManager()

    delegates : {[key:string] : ModuleNotesInterface} = {}

    constructor() {

    }

    noteTitleUpdated(noteId:string) {
        let view = window.mApp.views.get(noteId) 
        if (view != undefined) {
            view.viewName = this.getNote(noteId)?.noteTitle ?? ""
        }
        Array.from(Object.values(this.delegates)).forEach( (del) => {
            del?.noteTitleUpdated?.(noteId)
        })
    }

    noteDescUpdated(noteId:string) {
        Array.from(Object.values(this.delegates)).forEach( (del) => {
            del?.noteDescriptionUpdated?.(noteId)
        })
    }


    getAllNotes() : ModuleNote[] {
        return this.getModuleNotes().concat(this.getDocumentationNotes())

    }

    documentationNotes : ModuleNote[] = []
    getDocumentationNotes() : ModuleNote[] {
        if (this.documentationNotes.length > 0) {
            return this.documentationNotes
        }
        let notes : ModuleNote[]  = []
        quickDocNotes.forEach((el) => {
            notes = notes.concat(el.notes)
        })
        this.documentationNotes = notes;
        return notes
    }

    getModuleNotes() : ModuleNote[] {
        let notesOptions : ModuleNote[] = Array.from(Object.values(window.mApp.moduleManager.getModuleOptions()["notesData"]["notes"] ?? {})) ?? [] 
        return notesOptions
    }

    getNote(noteId: string) : ModuleNote | undefined {
        let notes = this.getAllNotes();

        for (let note of notes) {
            if (note.noteId == noteId) {
                return note
            }
        }

        return undefined
    }

    createNote() : ModuleNote {
        let options = window.mApp.moduleManager.getModuleOptions()
        let notes = this.getModuleNotes();
        let note : ModuleNote = {
            noteId : window.mApp.utils.makeId(),
            noteTitle : `Note ${notes.length + 1}`,
            noteDesc : "",
            noteData : "",
            isDocumentation : false
        }

        options["notesData"]["notes"][note.noteId] = note
        console.log(this.getModuleNotes())
        Array.from(Object.values(this.delegates)).forEach( (del) => {
            del?.noteCreated?.(note.noteId)
        })
        
        this.openNote(note.noteId)
        return note
    }

    getActiveNote() : string {
        let options = window.mApp.moduleManager.getModuleOptions()
        return options["notesData"]["activeNote"] ?? ""
    }

    openNote(noteId:string) {
        let notes = this.getAllNotes().map((note)=> {
            return note.noteId
        })
        if (!notes.includes(noteId)) {return}
        let options = window.mApp.moduleManager.getModuleOptions()
        options["notesData"]["activeNote"] = noteId
        let openedNotes : string[] = options["notesData"]["openedNotes"] ?? []
        if (!openedNotes.includes(noteId)) {
            (options["notesData"]["openedNotes"] as string[]).push(noteId)
        }
        Array.from(Object.values(this.delegates)).forEach( (del) => {
            del?.noteOpened?.(noteId)
        })
    }

    getOpenedNotes() : string[] {
        let options = window.mApp.moduleManager.getModuleOptions()
        if (Object.keys(options).length == 0) {return []}
        return options["notesData"]["openedNotes"] ?? []
    }

    
    deleteNote(noteId:string) {
        let options = window.mApp.moduleManager.getModuleOptions()
        this.closeNote(noteId);
        delete options["notesData"]["notes"][noteId]
        Array.from(Object.values(this.delegates)).forEach( (del) => {
            del?.noteDeleted?.(noteId)
        })
    }

    closeNote(noteId:string) {
        
        let options = window.mApp.moduleManager.getModuleOptions()
        var openedNotes : string[] = (options["notesData"]["openedNotes"] as string[]) ?? []
        let currentActiveNote = options["notesData"]["activeNote"] ?? ""
   
        let indexOfNote: number = openedNotes.indexOf(noteId)
        if (openedNotes.includes(noteId)) {
            window.mApp.utils.deleteFromArray(indexOfNote,openedNotes)
        }
        Array.from(Object.values(this.delegates)).forEach( (del) => {
            del?.noteClosed?.(noteId)
        })
        openedNotes = (options["notesData"]["openedNotes"] as string[]) ?? []
        console.log(openedNotes)
        if (openedNotes.length > 0 && currentActiveNote == noteId) {
            if (indexOfNote != 0) {
                indexOfNote -= 1
            }
            this.openNote(openedNotes[indexOfNote % openedNotes.length]);

        } 
      
    }

}