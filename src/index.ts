

import App from "./app";    

declare global {
    interface Window {
        mApp : App
    }
}

window.mApp = new App();

window.mApp.start();

