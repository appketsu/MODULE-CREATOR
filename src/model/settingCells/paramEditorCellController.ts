import { paramEditorCellView } from "../../view/settingsCells/paramEditorCellView";
import { UICollectionViewCell } from "../collectionView/collectionViewCell";
import View from "../view/view";
import $ from 'jquery'

export enum dataType {
    string,
    int,
    stringArray
}


export class ParamEditorCellController extends UICollectionViewCell {

    value : string | number | string[]| boolean ;
    valueChanged?: (value: string | number | string[] | boolean ) => void;
    finishedEditing?: () => void;

    title: string;
    message: string | undefined;
    tinted: boolean;

    constructor(title:string,
        message:string | undefined = undefined,
        value:string | number | string[]| boolean ,
        tinted: boolean,
        valueChanged: (value: string | number | string[] | boolean) => void,
        finishedEditing : () => void,
        html:string = paramEditorCellView)   {
        super(html)
        console.log(value)
        this.value = value
        this.valueChanged = valueChanged;
        this.finishedEditing = finishedEditing;
        this.title = title;
        this.message = message;
        this.tinted = tinted;

        if (message != undefined) {
            this.message += '<br>'
        }  else {
            this.message = ""
        }

        this.message += this.getPlaceholderString();

    }

    getPlaceholderString() : string {
        if (typeof this.value == 'string') {
            return 'This field allows any character.';
        }
        if (typeof this.value == 'number') {
            return 'This field allows numbers and decimals, use . to indicate the decimals.';
        }
        if (typeof this.value == 'boolean') {
            return 'This field only allows either true | flase';
        }
        if (Array.isArray(this.value)) {
            return 'This field is a list, separate the values with comas.';
        }

        return  "";
    }

    viewWasInserted(): void {
        super.viewWasInserted()

        if (this.tinted) {
            $(`[${this.id}]`).addClass('bg-secondary')
        }

        $(`[${this.id}] .title`).text(window.mApp.utils.capitalizeFirstLetter(this.title.replace(/([A-Z][a-z])/g, ' $1').trim()))
        $(`[${this.id}] .message`).html(this.message ?? "");

        $(`[${this.id}] input`).attr('placeholder',this.getPlaceholderString())


        $(`[${this.id}] input`).val(`${this.value}`)

        $(`[${this.id}] input`).off().on('input',(el) => {
            let inputVal : string = $(el.target)?.val()?.toString() ?? ""

            if (typeof this.value == 'string') {
                this.value = inputVal;
            }
            if (typeof this.value == 'number') {
                this.value = window.mApp.utils.getNumberFromString(inputVal) ?? 0;
            }
            if (typeof this.value == 'boolean') {
                this.value = inputVal.toLowerCase() == 'true';
            }
            if (Array.isArray(this.value)) {
                this.value = inputVal.split(',');
            }

            if (this.valueChanged == undefined) {return}
        
            this.valueChanged(this.value);
        })


        $(`[${this.id}] input`).on('focus',(el) => {
            $(`[${this.id}] input`).attr('placeholder','')
        })

        $(`[${this.id}] input`).on('blur',(el) => {
            $(`[${this.id}] input`).attr('placeholder',this.getPlaceholderString())
        })

    }

 

    finish(): void {
        $(`[${this.id}] input`).off();
        this.valueChanged = undefined;
        this.finishedEditing = undefined;
        super.finish()
    }
}


