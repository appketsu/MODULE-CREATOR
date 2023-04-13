


export interface ModuleNotesInterface {
    noteTitleUpdated?(noteId:string) : void
    noteDescriptionUpdated?(noteId:string) : void
    noteDeleted?(noteId:string) : void
    noteDataUpdated?(noteId:string) : void
    noteClosed?(noteId:string) : void
    noteCreated?(noteId:string) : void
    noteOpened?(noteId:string) : void
}

export interface ModuleNote {
    noteId: string
    noteTitle : string
    noteDesc : string
    noteData : string
    isDocumentation : boolean,
}