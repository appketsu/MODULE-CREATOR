import View from "../view/view";
import { ConnectionChecker } from "./connectionChecker";
import { KetsuLog } from "./logsParser";

export interface SocketsConnectionInterface {
    connectionEnabled() : void;
    connectionFailed() : void;
}

export interface SocketsMessageInterface {
    messageReceived(message?:any) : void;
}

/*
    FUNCTION NAMES
    ExecuteModule
    CancelExecution
    Logs

    CallbackSent
    CallbackCompletion
*/

export interface SocketMessage {
    id: string; // the id can be undefined if so we will execute the thing anyways.
    functionName: string; // identifies the kind of order that can be send or received.
    data?: any;
    logs? : any;
    sentCallback: boolean;
    completionCallback : boolean;
}



export class SocketMessageCallback {

    sentTimeout: number = 1000 * 10;
    completedTimeout: number = 1000 * 40;

    sent? : (data:any,error:boolean) => void;
    completion?: (data:any,error:boolean) => void;

    id : string = "";
    
    constructor(sent?: (data:any,error:boolean) => void, completion?: (data:any,error:boolean) => void) {
        this.sent = sent;
        if (this.sent != undefined) {
            setTimeout(() => {
                if (this.sent != undefined) {
                    this.sent({},true);
                    this.sent = undefined;
                }
                if (this.completion == undefined) {this.finish()}
            }, this.sentTimeout);
        }

        this.completion = completion;
        if (this.completion != undefined) {
            
            setTimeout(() => {
                if (this.completion != undefined) {
                    this.completion({},true);
                    this.completion = undefined;
                }
                if (this.sent == undefined) {this.finish()}
            }, this.completedTimeout);
        }
    }

    sentCallback(data:any) {
        if (this.sent != undefined) {
            this.sent(data,false);
            this.sent = undefined;
        }
        if (this.completion == undefined) {this.finish()}
    }

    completionCallback(data:any) {
        if (this.completion != undefined) {
            this.completion(data,false);
            this.completion = undefined;
        }
        if (this.sent == undefined) {this.finish()}
    }

    error() {
        if (this.sent != undefined) {
            this.sent({},true);
            this.sent = undefined;
        }
        if (this.completion != undefined) {
            this.completion({},true);
            this.completion = undefined;
        }
        this.finish();
    }

    finished = false;
    finish() {
        if (this.finished) {return;}
        this.finished = true;
        this.sent = undefined;
        this.completion = undefined;
        delete window.mApp.sockets.completionMessagesArray[this.id];
    }
}

export enum serverConnectionStatus {
    connected,
    connecting,
    notConnected
}

export class SocketsConnectionHandler  {

    connection?: WebSocket;

    socketsConnectionInterfaces:  {[key:string] : SocketsConnectionInterface} = {};

    connectionStatus: serverConnectionStatus = serverConnectionStatus.notConnected;

    completionMessagesArray : {[key:string] : SocketMessageCallback} = {}

    currentIp : string = "";

    getCurrentIp() : string {

        return window.localStorage.getItem("currentIP") ?? ""
    }

    setCurrentIp(string:string) {
        window.localStorage.setItem("currentIP", string)
    }

    constructor() {
    }

    isConnected() : boolean {
        return this.connectionStatus == serverConnectionStatus.connected
    }

    connectionTimerId : string;
    setUp(ip:string) {
        this.connectionFalied();
        if (ip == "") {return}
        let timerId = window.mApp.utils.makeId();
        this.connectionTimerId = timerId;
        setTimeout(()=> {   
            if (this.connectionTimerId != timerId) {return}
            this.connectionFalied();
        },10 * 1000);

        this.setCurrentIp(ip)
        this.connectionStatus = serverConnectionStatus.connecting;
        this.connection = new WebSocket(ip);

        this.connection.onopen =  () => {
            this.connectionOpened();
        };
        
        this.connection.onerror =  (error) => {
            this.connectionFalied();
        };

        this.connection.onclose =  (ev) => {
            this.connectionFalied();
        };

        this.connection.onmessage = async (e) => {
            this.messageReceived(JSON.parse(atob(await e.data.text())));
        };
    }

    closeConnectionWithoutCallbacks() {
        if (this.connection != undefined) {
            this.connection.onopen =  () => {}
            this.connection.onerror = (error) => {}
            this.connection.onclose = (error) => {}
            this.connection.onmessage = async (e) => {}
            this.connection.close();
        }
    }

    connectionFalied(callbacks: boolean = true) {
        this.connectionTimerId = window.mApp.utils.makeId();
        this.closeConnectionWithoutCallbacks();
        this.connectionStatus = serverConnectionStatus.notConnected;
        for (var k of Object.keys(this.completionMessagesArray)) {
            this.completionMessagesArray[k].error();
            delete this.completionMessagesArray[k];
        }

        if (!callbacks) {return}
        for (var int of Object.values(this.socketsConnectionInterfaces)) {
            int.connectionFailed();
        }
        this.connection = undefined;
    }

    connectionOpened() {
        this.connectionTimerId = window.mApp.utils.makeId();
        this.connectionStatus = serverConnectionStatus.connected;

        for (var int of Object.values(this.socketsConnectionInterfaces)) {
            int.connectionEnabled();
        }
    }

    sendMessage(message: SocketMessage,callback?: SocketMessageCallback): boolean {
        if (this.connectionStatus != serverConnectionStatus.connected ) {return false}
        if (callback != undefined) {
            callback.id = message.id;
            if (callback.sent != undefined) {message.sentCallback = true}
            if (callback.completion != undefined) {message.completionCallback = true}
            this.completionMessagesArray[callback.id] = callback;
        }
        this.connection?.send(JSON.stringify(message));
        return true;
    }

    messageReceived(message:any) {
        let decodedMesage = message as SocketMessage;
        if (decodedMesage == undefined) {
            return;
        }
        this.parseMessageReceived(decodedMesage);
    }

    parseMessageReceived(message: SocketMessage) {
        if (message.functionName == "CallbackSent") {
            this.completionMessagesArray[message.id]?.sentCallback(message)
            return
        }
        if (message.functionName == "CallbackCompletion") {
            this.completionMessagesArray[message.id]?.completionCallback(message)
            return
        }
    }

}