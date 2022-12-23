import { NotificationData } from "../model/interfaces";
import View from "../model/view/view";
import { notificationView } from "../view/defaultViews/notiicationView";
import $ from "jquery";




export class NotificationView extends View {

    notification: NotificationData;

    constructor(notification: NotificationData,id: string = window.mApp.utils.makeId(), html: string = notificationView) {
        super(id,html)
        this.notification = notification;


    }   


    viewWasInserted(): void {
        super.viewWasInserted();
        this.setUp();
    }
    

    setUp(): this {
        super.setUp();

        if (this.notification.title == undefined) {
            $(`[${this.id}] .notification-title`).css({"display" : "none"})
        }

        let messageHtml = `<div class="notification-msg">${this.notification.message ?? ""}</div>`;


        $(`[${this.id}] .notification-title`).text(this.notification.title ?? "")
        $(`[${this.id}] .notification`).append(messageHtml)

        return this;
    }



}