import { UICollectionView } from "./collectionView"

import { MKeyValuePair, UICollectionViewFlowEnum } from "./interfaces";



export class UICollectionViewLayoutDesign {
    gap: string = "0rem";
    padding: string = "0rem";
    flow: UICollectionViewFlowEnum = UICollectionViewFlowEnum.vertical;
    columnsTemplate: string | undefined = "1fr";
    rowsTemplate: string | undefined = "1fr";
    overflowX : string = "auto";
    overflowY: string =  "auto";
    justifyContent : string = ""
    width: string = "";
    height: string = "";
    backgroundColor: string = "";

    extraStyles : any = {}; // we can set this object to style stuff that in not define in the variables.

    getStyle(collectionView: UICollectionView) : MKeyValuePair {

        let styles : any = {
            "display" : "grid",
            "gap":this.gap,
            "padding": this.padding,
            "grid-auto-flow":this.flow,
            "grid-template-columns": this.columnsTemplate ?? "",
            "grid-template-rows": this.rowsTemplate ?? "",
            "justify-content" : this.justifyContent,
            "width" : this.width,
            "height" : this.height,
            "overflow-x" : this.overflowX,
            "overflow-y" : this.overflowY,
            "max-height" : "100%",
            "max-width" : "100%",
            "background-color" : this.backgroundColor
           };

           Object.entries(this.extraStyles).forEach(([key,value]) => {
            styles[key] = value;
           })

    
        return styles;
       
    }
}
