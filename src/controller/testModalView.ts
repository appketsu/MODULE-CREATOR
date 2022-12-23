import { DropDown } from "../model/dropDownMenu/dropDown";
import { DefaultDropDownCell } from "../model/dropDownMenu/dropDownCell";
import { ElementModalPos, ElementModalView, ElemModalDirection } from "../model/elementModalView/elementModalView";
import { InsertedViewData } from "../model/view/insertView";
import View from "../model/view/view";



export class TestModalView extends View {


    constructor (id: string = window.mApp.utils.makeId(15),
    html: string = "<div $id> </div>") {
        super(id,html)

    }

    modal : DropDown;

    setUp(): this {
        super.setUp();
        this.insertInto(new InsertedViewData(undefined,'body'));
        this.setConstraints({top: "0px",bottom:"0px",left:"0px", right:"0px"});

        if (this.modal != undefined) {
            this.modal.finish();
        }
        this.modal = new DropDown((index,dropDown)=> {
            dropDown.finish();
        });

        for (var x = 0; x < 3; x++) {
            this.modal.addCell(new DefaultDropDownCell())

        } 
      
        this.insertNewView( new InsertedViewData(this.modal.id))
        this.modal.generalSetUp(10,10,
            ElementModalPos.auto,
            ElemModalDirection.auto,
            {x:0,y:0,height:10,width:0},
            300)
 
        return this;
    }

}