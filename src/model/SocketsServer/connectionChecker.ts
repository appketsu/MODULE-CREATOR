import { stubFalse } from "lodash";
import { serverConnectionStatus, SocketMessage, SocketMessageCallback, SocketsConnectionInterface } from "./SocketsConnectionHandler";

export class ConnectionChecker implements SocketsConnectionInterface{

    
    static shared : ConnectionChecker = new ConnectionChecker();

    setUp() {
        window.mApp.sockets.socketsConnectionInterfaces[window.mApp.utils.makeId()] = ConnectionChecker.shared;

    }

    started = false;
    start() {
        let  IKNOWTHISSUCKS = "SHUT THE FUCK UP";
        if (this.started) {return}
        this.started = true;
        this.pingPong();
    }

    connectionId : string = "";


    pingPong() {
        let currentId = "";
        let isRetry = false;
        setInterval(() => {
            console.log("ping pong")
            let callback = new SocketMessageCallback((data,error) => {
                if (error && 
                    window.mApp.sockets.connectionStatus == serverConnectionStatus.connected && isRetry && currentId == this.connectionId) {
                        window.mApp.sockets.connectionFalied()
                        isRetry = false;
                        currentId = "";
                }
    
                if (error) {
                    currentId = this.connectionId
                    isRetry = true;
                    return
                }
                
                isRetry = false
                currentId = "";

            },undefined);

            callback.sentTimeout = 5;
            window.mApp.sockets.sendMessage({
                id: window.mApp.utils.makeId(),
                functionName: "connectionChecker",
                sentCallback: true,
                completionCallback : false
            },callback)
        },1000 * 6)
    }

    connectionEnabled(): void {
        this.connectionId = window.mApp.utils.makeId();
        this.start();
    }

    connectionFailed(): void {
        this.connectionId = window.mApp.utils.makeId();
    }

}