import View from "../../model/view/view";
import { LeftMenuData } from "./interfaces";
import { ModuleNotesController } from "./menuViewer/moduleNotes/moduleNotesController";
import { ModuleTutorialsController } from "./menuViewer/moduleTutorials/moduleTutorialsController";
import { TestViewController } from "./menuViewer/moduleView/moduleCollectionViewController";
import { QuickDocController } from "./menuViewer/quickDoc/quickDocController";



export const leftMenuDataset : LeftMenuData[] =  [
    {
        id: "module",
        selected: false,
        subMenuCell: {
            viewId: "leftSubMenuModule",
            image: "./images/module.png",
            name: "Module"
        },
        subMenuViewer: {
            viewId: "leftMenuModuleView",
            createView(): View {
                return new TestViewController("leftMenuModuleView",'<div $id class="left-menu-viewer-view">  </div> ')
            },
        }
    },
    {
        id: "notes",
        selected: false,
        subMenuCell: {
            viewId: "leftMenuSubMenuNotes",
            image: "./images/notes.png",
            name: "Module\nNotes"
        },
        subMenuViewer: {
            viewId: "leftMenuNotesView",
            createView() : View{
                return new ModuleNotesController("leftMenuNotesView")
            },
        }
    },
    {
        id: "quickDocumentation",
        selected: false,
        subMenuCell: {
            viewId: "leftSubMenuquickDocumentation",
            image: "./images/information.png",
            name: "Quick Doc"
        },
        subMenuViewer: {
            viewId: "leftMenuQuickDocView",
            createView() : View {
                return new QuickDocController("leftMenuQuickDocView")
            },
        }
    },
    {
        id: "moduleTutorials",
        selected: true,
        subMenuCell: {
            viewId: "leftSubMenuTutorials",
            image: "./images/tutorial.png",
            name: "Module Tutorials"
        },
        subMenuViewer: {
            viewId: "leftMenuModuleTutorials",
            createView() : View {
                return new ModuleTutorialsController("leftMenuModuleTutorials")
            },
        }
    },
    
]




