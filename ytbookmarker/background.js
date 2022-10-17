chrome.tabs.onUpdated.addListener((tabId,tab)=>{
    // onupdated when a tab is updated 
    if(tab.url &&tab.url.includes("youtube.com/watch"))
    {
        const qParams=tab.url.split("?")[1];
        //split returns an array back and [1] is used to access the second part of the link after ?
        const urlParams= new URLSearchParams(qParams);
        //url search params way to resolve url queries after ? vala part easily 
        //new is used when a function has a constructor
        console.log(urlParams);
        chrome.tabs.sendMessage(tabId,{
            type: "NEW",
            videoId:urlParams.get("v")
        });
        // tab id and message in jsonifable format
    }
})