
import * as _ from 'lodash';
import { truncate } from 'lodash';
import App from '../../app';
import { basicHtml } from '../../view/defaultViews/basicHtml';
import Base, { AppInterface } from '../base';
import { MBoundsLimit } from '../grid/gridInterfaces';
import {  RectConstraints, RectNumber, RectString, SizeNumber } from '../interfaces';
import { InsertedViewData } from './insertView';
import $ from "jquery";



export default class View extends Base {
    

    html : string;
    id : string; // View id.
    insertedViews : InsertedViewData[] = []; // id of the view that has been inserted into this one.
    insertedInto : InsertedViewData; // this inserts this view into another view, all views are located on the html through the attr name [name], This means i can search for both the view and the location on the html

    limitBounds : MBoundsLimit = {
        height : {min: 0,max: 9999999},
        width : {min: 0,max: 9999999}
    };

    insertViewsDefault?: InsertedViewData; // this will indicate where the views will be inserted by default.
                                        // it will be setup like this InsertedViewData(this.id,"$idwhatevernameoftag")
    // View Data: Not needed.
    viewName: string = "";
    viewImageRoute: string = "";

    constructor(id: string = window.mApp.utils.makeId(),html: string = basicHtml) { // The html has to replace with the element id.
        super()
        this.id = id;
        if (html != undefined) {
            this.html = html?.replace(/\$id/gi,id);
        } else {
            this.html = this.html?.replace(/\$id/gi,id);
        }
        window.mApp.views.set(id,this);
        this.viewWasCreated();
    }

    setInsertDefaultViews() : this{
        this.insertViewsDefault = new InsertedViewData(this.id,"$idviews");
        return this;
    }

    insertedFlag: boolean = false;
    insertNewView(insertInfo : InsertedViewData) : boolean { // this function 
        let view = insertInfo.getView();
        if (this.html == undefined && view != undefined) {this.insertedFlag = false;return false}
        if (insertInfo.htmlTag == undefined) {
            insertInfo.htmlTag = this.insertViewsDefault?.getTag() ?? this.id;
        }
        this.insertedViews.push(insertInfo);
        view?.insertInto( new InsertedViewData(this.id,insertInfo.htmlTag));
        return true;
    }

    insertInto(insertInfo : InsertedViewData): boolean { 
        // Only use to insert the view into an html directly.
        // evaluate the possibiliy of instead of locking the view to be inserted once
        // delete the view and readd it again somewhere else
        let parsedHtml = this.parseHtml();
        parsedHtml = this.htmlInsertionInterceptor(parsedHtml);
        if (parsedHtml == undefined) {this.insertedFlag = false;return false}
        this.insertedInto = insertInfo;
        document.querySelector(`[${insertInfo.getTag()}]`)!.append(parsedHtml);
        this.insertedFlag = true;
        this.viewWasInserted();
        if (this.viewWasInsertedCallback != undefined) {
            this.viewWasInsertedCallback(this.id);
        }
        return true;
    }

    viewWasInsertedCallback? : (viewID:string) => void;
    viewWasInserted() { // callback for inhiretance
        
    }


 

    viewWasCreated() { // callback for inhiretance

    }


    replaceView(view:View) { 
        // Make this view be replaced by the view parameter
    }

    setUp() : this {
        super.setUp();
        return this;
    }


    setData()  { // this will be called on every view to relad their data in case the source of the data changes.
        // Example: We reload the file and the views need to get the data from the file.
    
    }

    setFrame(frame: RectString) {
        $(`[${this.id}]`).css({"position":"absolute",
        "top": `${frame.y}`,
        "left": `${frame.y}`,
        "width": `${frame.width}`,
        "height": `${frame.height}`,
        "bottom": ``,
        "right": ``})
    }

    addClickListener(callback: () => void) {
        $(`[${this.id}]`).off().on('click', (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            callback();
        })
    }

    setConstraints(frame: RectConstraints) {
        $(`[${this.id}]`).css({"position":"absolute",
        "top": `${frame.top ?? ""}`,
        "right": `${frame.right ?? ""}`,
        "bottom": `${frame.bottom ?? ""}`,
        "left": `${frame.left ?? ""}`,
        "width": `${frame.width ?? ""}`,
        "height": `${frame.height ?? ""}`})
    }

    clipToParent() {
        this.setConstraints({top:"0px",bottom: "0px", left: "0px", right: "0px"});
    }

    style(css:any, to:string | undefined = undefined) {
        $(`[${this.id}] ${to ?? ""}`).css(css);
    }

    setLimitBounds(bounds: MBoundsLimit)  {
        this.limitBounds = bounds
    }

    htmlInsertionInterceptor(html: Element | undefined): Element | undefined {


        return html;
    }

    getSize() : SizeNumber {
        let el = $(`[${this.id}]`);

        return {width : el.width() ?? 0,height: el.height() ?? 0}
    }

    getFrame(elem:string = "") : RectNumber {
        let parsed = $(`[${this.id}] ${elem}`);
        return {x: parsed.offset()?.left ?? 0, y: parsed.offset()?.top ?? 0 ,width : parsed.outerWidth() ?? 0,height: parsed.outerHeight() ?? 0}
    }

    deleteSubviews() {
        for (let view of this.insertedViews) {
            view.getView()?.finish();
        }
    }

    viewWasFinishedCallback? : (viewID:string) => void;
    finish(): void {
        super.finish();
        $(`[${this.id}]`).off();
        $(`[${this.id}]`).find("*").off();
        // trigger finish from the inserted views within this view.
        this.insertedViews.forEach(x => {
            x.getView()?.finish();
        });
        // remove the view from the inserted views array parent;
        let insertedViews =  this.insertedInto.getView()?.insertedViews
        if (insertedViews != undefined) {
            this.insertedInto.getView()!.insertedViews = insertedViews.filter((id) => {
                id.view != this.insertedInto.view;
            });
        }

        this.viewWasInsertedCallback = undefined;
        // remove the current View.
        this.removeHtmlOfView();
        // remove the view from the views array.
        window.mApp.views.delete(this.id);
        delete window.mApp.moduleManager.moduleViewsExecutor[this.id];

        if (this.viewWasFinishedCallback != undefined) {
            this.viewWasFinishedCallback(this.id);
        }
        this.viewWasFinishedCallback = undefined;
    }


    // HTML


    parseHtml(): Element  | undefined{
        if (this.html == undefined) {
            return undefined
        }
        var el = document.createElement( 'html' );
        el.innerHTML = this.html;
        let select = el.querySelector('body')?.firstElementChild;
        if (select == null) {
            return undefined;
        }
        
        return select
    }
    

    isHiddenFlag: boolean = false;
    isHidden(set: boolean | undefined = undefined) :boolean {

        if (set == undefined) {
            return this.isHiddenFlag
        }

        this.isHiddenFlag = set;

        if (set) {
            $(`[${this.id}]`).css({"display":"none"})
        } else {
            $(`[${this.id}]`).css({"display":""})
        }

        return set;
    }
  
    getView(id:string) : View | undefined {
        return window.mApp.views.get(id)
    }

    parentResized(name:string) {

    }

    removeHtmlOfView() {
        $(`[${this.id}]`).remove();
    }

    bringSubViewToTop(id:string) : boolean {
        var found = false;
        for (var view of this.insertedViews) {
            if (view.view != undefined) {
                if (view.view == id) {
                    found = true;
                }
            }
        }

        if (!found) {return false;}

        let parent = $(`[${id}]`).parent();
        let htmlOfView = $(`[${id}]`);
        this.getView(id)?.removeHtmlOfView()
        parent.append(htmlOfView);
        return true;
    }

    bringViewToTheTop(): boolean {
        let superView = this.insertedInto.getView()
        if (superView == undefined) {
            return false;
        }
        return superView.bringSubViewToTop(this.id);
    }

}