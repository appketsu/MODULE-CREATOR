

export const viewDataRequestController: string = `
<div $id class="data-request-controller">

    <div  class="fill-absolute data-request-grid"> 

        <div $idnotification > 
        
        </div>

        <div> 
            <div class="fill-absolute">
                <div class="input-holder "> 
                        <div class="input-grid "> 
                        <input class="request-input" placeholder="Type the url here.">
                    <div id="requesttype" class="button center-flex pointer">GET</div>
                    </div>
                </div>
            </div>
        </div>

        <div $idviews class="params"> 
        
        
        
        </div>
    
    </div>

</div>
`




export const viewDropDownRequestType = `

   <div $id >

   <div class="fill-absolute"> 
   
      <div class="dropdown-cell-requesttype">

         <div class="title"> GET </div>
      
      </div>
      
   </div>


   </div>

`;