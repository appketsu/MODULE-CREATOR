


export const viewConnectSocket = `

<div $id class="connect-socket shadow"> 

    <div $idstatemanager class="relative"></div>
    <div  class="relative">  
        
        <div>- To execute and debug modules you will need to connect to KETSU module creator server, it can be found on the KETSU app.<br>
        - Type the ws url [ws://***.**.***:***] that is displayed on KETSU Module Creator and click connect.<br>- Keep your phone screen on and dont leave KETSU module creator to avoid disconnections.<br>- Your phone and computer have to be connected to the same wifi or your computer has to be connected to your phone hotspot.</div>
        
        <div class="connection-holder"> 
        <input  class="input-header-value header-input" placeholder="ex: ws://999.23.43.1:3000">
        <div class="status center-flex relative"> <img class="status-image" src="./images/disconnected.png"> <div class="loading bg-primary relative"> </div>   </div>
        <div class="button bg-secondary-dark-hover center-flex"> <div class="elem-padding-wider connect-button">Connect</div> </div>
        </div>
    </div>


</div>

`;