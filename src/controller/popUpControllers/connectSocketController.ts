import { serverConnectionStatus, SocketsConnectionInterface } from "../../model/SocketsServer/SocketsConnectionHandler";
import { InsertedViewData } from "../../model/view/insertView";
import View from "../../model/view/view";
import { PopUpView } from "../../model/view/viewTemplates/popUpView";
import { StateManagerController } from "../../model/view/viewTemplates/stateManagerController";
import { basicHtml } from "../../view/defaultViews/basicHtml";
import { viewConnectSocket } from "../../view/popUpViews/ConnectSocketView";
import {Spinner} from 'spin.js';
import $ from "jquery";
import { KeyCodesInterface, keyCodesManager } from "../../model/keyCodesShortcouts/keyCodesManager";


export class ConnectSocketController extends View implements SocketsConnectionInterface,KeyCodesInterface {

    connected?:  () => void;

    static socketsIsOnView : boolean = false
    
    constructor(connected?: () => void) {
        super(undefined,viewConnectSocket )
        keyCodesManager.shared.delegates[this.id] = this;
        window.mApp.sockets.socketsConnectionInterfaces[this.id] = this;
        this.connected = connected;
    }


    spinner: Spinner;
    spinnerOptions  = {
        lines: 9, // The number of lines to draw
        length: 38, // The length of each line
        width: 17, // The line thickness
        radius: 45, // The radius of the inner circle
        scale: 0.1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        speed: 1, // Rounds per second
        rotate: 0, // The rotation offset
        animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#ffffff', // CSS color or array of colors
        fadeColor: 'transparent', // CSS color or array of colors
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
      };
      

    viewWasInserted(): void {
        super.viewWasInserted();
        ConnectSocketController.socketsIsOnView = true
        $(`[${this.id}] input`).trigger("focus");
     

        let stateManagerCont = new StateManagerController("App Connection",{finished : () => {
            this.finish();
        }});
        let el = document.querySelector(`[${this.id}] .loading`) as HTMLElement;
        if (el != undefined) {
            this.spinner = new Spinner(this.spinnerOptions).spin(el);
        }

        let ivd = new InsertedViewData(stateManagerCont.id, "$idstatemanager")
        this.insertNewView(ivd);
        stateManagerCont.clipToParent();
        // alksdjfañlksdj
    
        if (window.mApp.sockets.connectionStatus == serverConnectionStatus.connected) {
            this.connectionEnabled();
        } else {
            this.connectionFailed();
        }

        $(`[${this.id}] .loading`).css({"display" : "none"})

        $(`[${this.id}] .connect-button`).off().on('click' , (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
            let value = `${$(`[${this.id}] input`).val() ?? ""}`;
            window.mApp.sockets.setUp(value);
            $(`[${this.id}] .elem-padding-wider`).text("Retry")
            $(`[${this.id}] .loading`).css({"display" : ""});
            
        });

        $(`[${this.id}] input`).val(window.mApp.sockets.getCurrentIp());
    }


    connectionEnabled(): void {
        $(`[${this.id}] .loading`).css({"display" : "none"})
        $(`[${this.id}] .elem-padding-wider`).text("connected");
        $(`[${this.id}] .status-image`).attr({"src" : window.mApp.utils.getImageUrl("connected.png")})
        $(`[${this.id}] .status-image`).css({"filter" : "invert(73%) sepia(14%) saturate(1264%) hue-rotate(77deg) brightness(97%) contrast(87%)"})
        if (this.connected != undefined) {
            setTimeout(() => {
                this.connected?.();
                this.finish();
            }, 200);
        }
    }

    connectionFailed(): void {
        $(`[${this.id}] .loading`).css({"display" : "none"})
        $(`[${this.id}] .elem-padding-wider`).text("Connect");
        $(`[${this.id}] .status-image`).attr({"src" : window.mApp.utils.getImageUrl("disconnected.png")})
        $(`[${this.id}] .status-image`).css({"filter" : "invert(78%) sepia(45%) saturate(7450%) hue-rotate(321deg) brightness(86%) contrast(102%)"})

    }

    keyDown(key: string): void {

    }
    keyUp(key: string): void {
        if (key == "Enter" && $(`[${this.id}] input`).is(":focus")) {
            let value = `${$(`[${this.id}] input`).val() ?? ""}`;
            window.mApp.sockets.setUp(value);
            $(`[${this.id}] .elem-padding-wider`).text("Retry")
            $(`[${this.id}] .loading`).css({"display" : ""});
        }
    }

    finish(): void {
        ConnectSocketController.socketsIsOnView = false
        delete keyCodesManager.shared.delegates[this.id]
        this.connected = undefined
        this.spinner.stop();
        delete window.mApp.sockets.socketsConnectionInterfaces[this.id];
        $(`[${this.id}] .connect-button`).off();
        super.finish();
    }
  
}


