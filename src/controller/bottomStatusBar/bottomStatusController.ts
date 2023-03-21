import GridElement from "../../model/grid/gridElement";
import { serverConnectionStatus, SocketsConnectionInterface } from "../../model/SocketsServer/SocketsConnectionHandler";
import View from "../../model/view/view";
import { PopUpView } from "../../model/view/viewTemplates/popUpView";
import { bottomStatusBarView } from "../../view/bottomViews/bottomStatusView";
import { ConnectSocketController } from "../popUpControllers/connectSocketController";
import $ from "jquery";



export class BottomStatusController extends GridElement implements  SocketsConnectionInterface {

    nameToViews: { [id: string] : string; } = {
        "left" : "leftMenuGridEl",
        "right" : "documentation",
        "bottom" : "bottomLogs"

     };
    constructor(id: string = window.mApp.utils.makeId()) {
        super(id,bottomStatusBarView)
        window.mApp.sockets.socketsConnectionInterfaces[this.id] = this;
    }


    viewWasInserted(): void {
        super.viewWasInserted();

        $(`[${this.id}] .sockets`).off().on( 'click',(ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();

            let popUp = PopUpView.showPopUpViewOnBody(new ConnectSocketController().id); 
        })

        $(`[${this.id}] .window-icon`).off().on('click', (ev) => {
            ev.preventDefault()
            ev.stopImmediatePropagation()
            let name = ev.currentTarget.attributes[1].name
            let view = this.getView(this.nameToViews[name]) as GridElement
            let isClosed = view.isClosed()
            if (isClosed) {
                view.open()
            } else {
                view.close()
            }
        })

        if (window.mApp.sockets.connectionStatus == serverConnectionStatus.connected) {
            this.connectionEnabled();
        } else {
            this.connectionFailed();
        }
    }

    updateWindowButtons() {
        Object.keys(this.nameToViews).forEach((key) => {
            console.log(key)
            let view = this.getView(this.nameToViews[key]) as GridElement
            console.log(view.getSize())

            if (view.isClosed()) {
                
                $(`[${this.id}] [${key}] img`).attr('src', window.mApp.utils.getImageUrl(`${key}_closed.png`))
            } else {
                $(`[${this.id}] [${key}] img`).attr('src', window.mApp.utils.getImageUrl(`${key}_opened.png`))
            }
        })
    }

    isClosed(): boolean {
        return this.getSize().height <= 30
    }

    connectionEnabled(): void {
        $(`[${this.id}] .title`).text("Connected");
        $(`[${this.id}] .bottom-status img`).attr("src",window.mApp.utils.getImageUrl("connected.png"))

    }

    connectionFailed(): void {
        $(`[${this.id}] .title`).text("Disconnected");
        $(`[${this.id}] .bottom-status img`).attr("src",window.mApp.utils.getImageUrl("disconnected.png"))
    }

    finish(): void {
        delete window.mApp.sockets.socketsConnectionInterfaces[this.id];
        $(`[${this.id}] .sockets`).off()
        $(`[${this.id}] .window-icon`).off()
        super.finish();
    }
}