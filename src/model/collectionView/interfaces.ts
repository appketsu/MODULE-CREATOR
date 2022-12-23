import View from "../view/view"
import { UICollectionView } from "./collectionView"
import { UICollectionViewCell } from "./collectionViewCell"
import { UICollectionVievSectionCell } from "./collectionViewSectionCell"





export interface UICollectionViewDelegate {

    cvDidSelectItem(cv:UICollectionView,indexPath: IndexPath) : void
    cvDidSelectSection(cv:UICollectionView,section: number,sectionCellType:UICollectionViewSectionCellType ) : void

}


export interface UICollectionViewDatasource {
    cvNumberOfItemsInSection(cv:UICollectionView,section:number) : number 
    cvNumberOfSections(cv:UICollectionView) : number 
    cvCellForItemAt(cv:UICollectionView,indexPath: IndexPath) : UICollectionViewCell
    cvCellForSectionAt(cv:UICollectionView,sectionCellType: UICollectionViewSectionCellType , section: number) : UICollectionVievSectionCell | undefined
    getSeparator?(cv:UICollectionView,indexPath: IndexPath) : View | undefined
}

export enum UICollectionViewFlowEnum {
    vertical = "row",
    horizontal = "column"
}

export enum UICollectionViewSectionCellType {
    header = "header",
    footer = "footer"
} 

export interface MKeyValuePair {
    [key: string] : string
}




export interface IndexPath {
    section: number;
    item: number;
}
