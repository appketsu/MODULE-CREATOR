## GENERAL

Coded with typescript, no frameworks, compiled with webpack.

Use npx webpack -w to compile.

Live sass compiler vs code extension to compile all the scss files.

Github Pages Link: http://module-creator.com/

It uses http because the website connects to a local websockets server that runs on the KETSU App on your local network. https doesnt allow the use of ws protocol.

## STEPS TO CONTRIBUTE QUICK DOCUMENTATION NOTES.
- export the Note you created clicking on the top right button of the note.
- Add the json object (The note) to the ./src/model/moduleNotes/quickDocNotes.ts notes array.
- you can either create a section inside the array or add the note inside a section.
 
## EXAMPLE STRUCTURE:
 
``` json
{ 
    sectionName : "Section Name",
    notes : [
        {
            noteId: "",
            noteTitle : "",
            noteDesc : "",
            noteData : "",
            isDocumentation : true
        }
    ]
}
```

## STEPS TO CONTRIBUTE MODULE TUTORIALS.

- Export your module and put it inside ./moduleTutorials 
- Add the module info to the ./src/model/moduleNotes/moduleTutorials.ts as shown in the structure below.
- You can either create a section inside the array or add the module info inside a section.
 
## STRUCTURE:
 
``` json
{ 
    sectionName : "",
    modules : [
        {
            moduleName : "",
            moduleDesc : "",
            moduleFileName: "moduleFileName.json"
        }
    ]
}
```
