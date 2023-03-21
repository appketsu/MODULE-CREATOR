import { Utils } from "../utils";
import { ModuleData } from "./moduleData";



export class WindowExecutor  {


    static executeFromModuleData(moduleData: ModuleData | undefined) {
        if (moduleData == undefined) {return}
        let object = moduleData.getObject();
        let stringObject = JSON.stringify(object);
        let url = object?.request?.url ?? "about:blank"
    
        let html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Module Creator</title>
            <style> 

            * {
                margin: 0;
                padding: 0;
                font-family:  $m-font;
            }
        

            body {
                position : relative;
            }

            iframe {
                width : 100%;
                height: 100vh;
                position: absolute;
                top : 0px;
                left : 0px;
                right : 0px;
                bottom: 0px;
            }

            </style>
          </head>
          <body>
        
            <script>
            let iframe = document.createElement('iframe');
            iframe.src = '${url}';
            document.body.appendChild(iframe);
            iframe.onload = function () {
                console.log("JAJAJAJAJ")
                const iframeWin = iframe.contentWindow || iframe;
                const iframeDoc = iframe.contentDocument || iframeWin.document;
                console.log(iframeDoc)
                var script = iframeDoc.createElement("script");
                script.append(\`
                    window.onload = function() {
                        alert("hello world");
                }
                \`);
                iframeDoc.documentElement.appendChild(script);
            };
        
            </script>
          </body>
        </html>`


        const winUrl = URL.createObjectURL(
            new Blob([html], { type: "text/html" })
        );
        

        const win = window.open(
            winUrl,
            "_blank"        );
    }

    static executeFromLog(content: string) {
        let fixedHtml =

        content = `
        ${content}
        `;
        const winUrl = URL.createObjectURL(
            new Blob([fixedHtml], { type: "text/html" })
        );
        

        const win = window.open(
            winUrl,
            "_blank"        );

    }

}