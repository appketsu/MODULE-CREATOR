


export class ModuleJavascriptGenerator {

    addJsIndicators(js:string) : string {
        return `/* JAVASCRIPT STARTS */ ${js} /* JAVASCRIPT ENDS */`;
    }

    generateUpdatedJs(javascriptString:string,updatedRequestObjStr:string,forceRequest:boolean,removeScripts:boolean,loadInWebview:boolean) : string {
            if (!forceRequest && !removeScripts && !loadInWebview) {
                return javascriptString;
            }

            let fixedJs = javascriptString;

            let addJs = `
            function setModuleCreatorSettings() {
    
                let object = document.querySelector('#ketsu-final-data').textContent;
                if (object == undefined) {return;}
                let parsedObject = JSON.parse(object);
                if (parsedObject == undefined) {return;}
                
                if (${forceRequest}) {
                let updatedRequest = atob(\`${updatedRequestObjStr}\`);
                    if (updatedRequest != '') {
                        parsedObject['request'] =  JSON.parse(updatedRequest);
                    }
                }
        
                if (${removeScripts}) {
                    parsedObject['javascriptConfig']['removeJavascript'] = true;
                    parsedObject['javascriptConfig']['loadInWebView'] = false;
                }
        
                if (${loadInWebview}) {
                    parsedObject['javascriptConfig']['loadInWebView'] = true;
                    parsedObject['javascriptConfig']['removeJavascript'] = false;
                }
        
                document.querySelector('#ketsu-final-data').textContent = JSON.stringify(parsedObject);

                if (typeof KETSU_ASYNC === 'undefined') {
                    return;
                }

                window.webkit.messageHandlers.EXECUTE_KETSU_ASYNC.postMessage('');

            }


        `;


        // && /KETSU_ASYNC.*=*true/g.test(javascriptString)
        if (javascriptString.includes(`window.webkit.messageHandlers.EXECUTE_KETSU_ASYNC.postMessage('');`) ) {
            
            fixedJs = fixedJs.replace(/window.*EXECUTE_KETSU_ASYNC.+\).*;/g,`
            
            setModuleCreatorSettings();
            
            `);

            fixedJs = addJs + fixedJs;

            return fixedJs;
        } 

        
        fixedJs = addJs + fixedJs;

        fixedJs = fixedJs + `
        
        setModuleCreatorSettings();
        
        `;

         return fixedJs
    }

    setDebug(js:string) : string {
        return `
        try {

            ${js}

        } catch (e) {
            console.error(e.message);

            if (typeof KETSU_ASYNC !== 'undefined') {
                window.webkit.messageHandlers.EXECUTE_KETSU_ASYNC.postMessage('');
            }

        }
        
        `
    }

    setAsync(js:string) : string{
        return  ` 

        var KETSU_ASYNC = true;
        
        ` + js;
    }


}