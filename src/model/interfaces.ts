interface FromToString {
    from: string;
    to: string;
}

export interface FromToNumber {
    from: number;
    to: number;
}

export interface SizeNumber {
    width: number,
    height: number
}

export interface SizeNumberOptional {
    width?: number,
    height?: number
}

export interface PointNumber {
    x: number;
    y: number;
}

export interface SelectedViewInterface {

    viewWasSelected(view:String) : void;

}

export interface RectString {
    x: string;
    y: string;
    width: string;
    height: string;
}

export interface RectNumber {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface TitleMessage {
    title: string,
    message: string
}

export interface RectConstraints {
    top?: string,
    right?: string,
    bottom?: string,
    left?: string
    width?: string,
    height?: string
}


export interface NotificationData {
    title?: string,
    message? : string
}