console.log("Background running");

chrome.tabs.onUpdated.addListener((tabid, tab) =>{

   console.log(tabid);
   console.log(tab);

   chrome.tabs.sendMessage(tabid, {
      action: "loading screen" 
   });
   loading_div.innerHTML = `<div id="beiwe-loading-div">
   <div class="spinner beiwe-loading-image">
   Loading
   <div class="spinner-sector spinner-sector-red"></div>
   <div class="spinner-sector spinner-sector-blue"></div>
   <div class="spinner-sector spinner-sector-green"></div>
   </div>

   <br />
   <br />

 </div>`
})

