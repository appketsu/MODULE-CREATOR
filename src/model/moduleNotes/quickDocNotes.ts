




export const quickDocNotes = [

    { 
        sectionName : "Welcome",
        notes : [
            {
                "noteId": "oFwjzvDpdfxlaKQrGUwc",
                "noteTitle": "Welcome Note",
                "noteDesc": "This note will open on every new project, it will contain general information to guide the user.",
                "noteData": "\n## Welcome!\n\nFirst of all you might have a better experience if you zoom out the navigator to a 90%.\n\nThis is the KETSU / ZETSU  module creator.\n\nWith this tool you can create and fix modules on an intuitive way.\n\n>Features\n\n- Tutorials: The Module Tutorials on the left menu are modules prepared with Notes like this one and code inside them so you can follow up as it was a tutorial to learn everything about creating modules.\n\n- Quick Documentation: This are Notes that you can open at any time, they can be found on the left menu, these notes have documentation about modules in general.\n\n-  Module tree: Visualize the module on a tree to modify it intuitively.\n\n-  Code Execution:  You can execute the code in real time while you create your module.\n\n    \n  -  Logs:  Get the logs of the code you executed.\n\n  -  Module Creator Server: In order to execute the module code you will need the KETSU app, it will create  WebSockets server that will allow you to connect this website to it and execute the code to have all the benefits mentioned above.\n\n  -  Visualize the result: The KETSU app will display you the result of your module everytime you execute it.\n\n- Notes: You can create notes like this ones on your projects so if anyone wants to take over he can read over the notes you left. With this notes you can also contribute to the Github with your own Module tutorials or Notes with documentation about making modules.\n\n\n## Contribute Quick Documentation\n\nYou can contribute Documentation Notes by creating notes with usefull documentation about Module Making and pushing it  to the github.\n\n> Steps to contribute  quick documentation notes.\n\n- export the Note you created clicking on the top right button of the note.\n- Add the json object (The note) to the ./src/model/moduleNotes/quickDocNotes.ts notes array.\n- you can either create a section inside the array or add the note inside a section.\n \n> Example Structure:\n \n``` json\n{ \n    sectionName : \"Section Name\",\n    notes : [\n        {\n            noteId: \"\",\n            noteTitle : \"\",\n            noteDesc : \"\",\n            noteData : \"\",\n            isDocumentation : true\n        }\n    ]\n}\n```\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
                "isDocumentation": true
            }
        ]
    }
]