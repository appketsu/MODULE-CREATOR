import { last } from "lodash"
import { LogsViewerHolderController } from "../../controller/logsView/logsViewer/logsViewerHolderController"

export interface KetsuLog {
     content? : string
     section : string
     action : string
     error : boolean
     id : string
     sectionId? : string
}

export interface ModuleLogs {
    implementedLogs : string[] // received logs
    logsOrder : string[]
    returnLogs : {[key:string] : KetsuLog[]}
}

export interface LogsParserInterface {
    logsUpdated ()  : void;
    logSelected() : void;
}

export interface LogIdentifier {
    sectionId: string;
    logId : string;
}

export class LogsParser  {

static shared = new LogsParser();

logsInterfaces: {[key:string] : LogsParserInterface} = {};

implementedLogs : string[] = [];
logsOrder : string[] = [];
logs : {[key:string] : KetsuLog[]} = {}

selectedLog? : LogIdentifier = undefined;

updatingLogs = false;
logsQueue : ModuleLogs[] = [];

logsUpdated(logs: ModuleLogs) {
    if (this.updatingLogs) {
        this.logsQueue.push(logs);
        return
    }

    this.updatingLogs = true;

    this.logsOrder = logs.logsOrder;
    for (let logID of logs.logsOrder) {
        if (this.logs[logID] == undefined) {
            this.logs[logID] = [];
        }
       let logsFromId = logs.returnLogs[logID];
       for (let mLog of logsFromId) {
        if (!this.implementedLogs.includes(mLog.id)) {
            mLog.sectionId = logID;
            this.logs[logID].push(mLog);
            this.implementedLogs.push(mLog.id);
        }
       }
    }

    for (let key of Object.keys(this.logs)) {
        if (!this.logsOrder.includes(key)) {
            delete this.logs[key]
        }
    }

    this.removeOldLogs();

    // Set the error log as selected in case there is one.

    let error = false;
    if (this.logsOrder.length >= 1) {
        let lastLogs = this.logs[this.logsOrder[0]];
        for (var mLog of lastLogs) {
            if (mLog.error) {
                this.selectedLog = {logId: mLog.id, sectionId : this.logsOrder[0]};
                (window.mApp.views.get("LogsViewerHolderController") as LogsViewerHolderController)?.showCurrentLog()
                error = true;
                break;
            }
        }
    }

    if (!error) {
        (window.mApp.views.get("LogsViewerHolderController") as LogsViewerHolderController)?.showJSLogs()
    }

    for (let inter of Object.values(this.logsInterfaces)) {
        inter.logsUpdated();
    }


    this.updatingLogs = false;
    this.lookForQueueLogs();
}

removeOldLogs() {
    for (let sectionId of Object.keys(this.logs)) {
        if (!this.logsOrder.includes(sectionId)) {
            let section = this.logs[sectionId];
            for (let log of section) {
                window.mApp.utils.deleteFromArray(this.implementedLogs.indexOf(log.id),this.implementedLogs);
            }
            window.mApp.utils.deleteFromArray(this.implementedLogs.indexOf(sectionId),this.implementedLogs);
            delete this.logs[sectionId];
        }

    }
}

getLog(identifier: LogIdentifier) : KetsuLog | undefined {

    let sectionLogs = this.logs[identifier.sectionId] ?? []

    for (var log of sectionLogs) {
        if (log.id == identifier.logId) {
            return log;
        }
    }

    return undefined;
}

logSelected(log: LogIdentifier) {
    this.selectedLog = log;

    for (let inter of Object.values(this.logsInterfaces)) {
        inter.logSelected();
    }
}


getModuleLogsToSend() : ModuleLogs {

    return {implementedLogs : this.implementedLogs,logsOrder : [], returnLogs : {}}
}

lookForQueueLogs() {
    if (this.logsQueue.length > 0) {
        let nextLogs = this.logsQueue[0];
        delete this.logsQueue[0];
        this.logsUpdated(nextLogs);
    }
}
    
}