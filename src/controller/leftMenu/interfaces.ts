import View from "../../model/view/view";


export interface LeftMenuDataInterface  {
    getLeftMenuData(id:string) : LeftMenuData | undefined;
    getLeftMenuDataArrray() : LeftMenuData[] | undefined;
    subMenuSelected(selection:LeftMenuData): void;
}

export interface LeftMenuData {
    id: string;
    selected: boolean;
    subMenuCell: LeftMenuSubMenuCellData;
    subMenuViewer : LeftMenuViewerData;
}

export interface LeftMenuSubMenuCellData {
    name: string;
    viewId: string;
    image: string;
}

export interface LeftMenuViewerData {
    viewId: string,
    createView() : View
}