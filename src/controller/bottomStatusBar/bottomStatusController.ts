import GridElement from "../../model/grid/gridElement";
import { serverConnectionStatus, SocketsConnectionInterface } from "../../model/SocketsServer/SocketsConnectionHandler";
import View from "../../model/view/view";
import { PopUpView } from "../../model/view/viewTemplates/popUpView";
import { bottomStatusBarView } from "../../view/bottomViews/bottomStatusView";
import { ConnectSocketController } from "../popUpControllers/connectSocketController";
import $ from "jquery";



export class BottomStatusController extends GridElement implements  SocketsConnectionInterface{


    constructor(id: string = window.mApp.utils.makeId()) {
        super(id,bottomStatusBarView)
        window.mApp.sockets.socketsConnectionInterfaces[this.id] = this;
    }


    viewWasInserted(): void {
        super.viewWasInserted();

        $(`[${this.id}] .sockets`).off().on({click : (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();

            let popUp = PopUpView.showPopUpViewOnBody(new ConnectSocketController().id); 
        }})

        if (window.mApp.sockets.connectionStatus == serverConnectionStatus.connected) {
            this.connectionEnabled();
        } else {
            this.connectionFailed();
        }
    }

    connectionEnabled(): void {
        $(`[${this.id}] .title`).text("Connected");
        $(`[${this.id}] img`).attr("src",window.mApp.utils.getImageUrl("connected.png"))

    }

    connectionFailed(): void {
        $(`[${this.id}] .title`).text("Disconnected");
        $(`[${this.id}] img`).attr("src",window.mApp.utils.getImageUrl("disconnected.png"))
    }

    finish(): void {
        delete window.mApp.sockets.socketsConnectionInterfaces[this.id];
        super.finish();
    }
}