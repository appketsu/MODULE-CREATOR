import { viewDefaultViewsHolder } from "../../view/defaultViews/defatulViewsHolder";
import { InsertedViewData } from "../view/insertView";
import View from "../view/view";

export interface ViewsHolderViewInterface {
    isOnTopViewsHolder : boolean
}

export class ViewsHolder extends View {

    availableViews: string[] = [];
    activeView: string = "";

    constructor(id:string,views: string[],active?:string,html: string = viewDefaultViewsHolder) {
        super(id,html)
        this.availableViews = views;
        if (views.length == 0) {return}
        this.activeView = active ?? views[0];
        this.insertViewsDefault =  new InsertedViewData(this.id,"$idviews");
    }

    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();
    }

    setUp(): this {
        super.setUp()

        this.availableViews.forEach( (x) => {
            let current = this.getView(x)
            this.insertNewView(new InsertedViewData(x))
            current?.setConstraints({top: "0px",left:"0px",right:"0px",bottom:"0px"})
        })

        this.showView(this.activeView);
        return this;
    }

    addView(view:string) {
        if (this.availableViews.includes(view)) {return}
        let current = this.getView(view)
        this.insertNewView(new InsertedViewData(view))
        current?.setConstraints({top: "0px",left:"0px",right:"0px",bottom:"0px"})
    }

    removeView(view:string) {
        if (!this.availableViews.includes(view)) {return}
        window.mApp.utils.deleteFromArray(this.availableViews.indexOf(view),this.availableViews);
        let current = this.getView(view)
        current?.finish()
    }


    showView(id:string) {
        for (let x of this.availableViews) {
            let view = this.getView(x)
            if (id == x) {
                if ((view as unknown as ViewsHolderViewInterface) != undefined) {
                    (view as unknown as ViewsHolderViewInterface).isOnTopViewsHolder = true
                }
                view?.style({"z-index": "3"})
            } else {
                if ((view as unknown as ViewsHolderViewInterface) != undefined) {
                    (view as unknown as ViewsHolderViewInterface).isOnTopViewsHolder = false
                }
                view?.style({"z-index": "1"})
            }
        }
        //this.getView(id)?.bringViewToTheTop();
    }

 
}