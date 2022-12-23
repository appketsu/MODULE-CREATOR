import View from "../../model/view/view";
import { LeftMenuData } from "./interfaces";
import { TestViewController } from "./menuViewer/moduleView/moduleCollectionViewController";



export const leftMenuDataset : LeftMenuData[] =  [
    {
        id: "module",
        selected: true,
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
                return new View("leftMenuNotesView",'<div $id class="left-menu-viewer-view"> $id </div> ')
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
                return new View("leftMenuQuickDocView",'<div $id class="left-menu-viewer-view"> $id </div> ')
            },
        }
    },
    {
        id: "moduleTutorials",
        selected: false,
        subMenuCell: {
            viewId: "leftSubMenuTutorials",
            image: "./images/tutorial.png",
            name: "Module Tutorials"
        },
        subMenuViewer: {
            viewId: "leftMenuModuleTutorials",
            createView() : View {
                return new View("leftMenuModuleTutorials",'<div $id class="left-menu-viewer-view"> $id </div> ')
            },
        }
    },
    
]




