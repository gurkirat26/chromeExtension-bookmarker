import { getActiveTabURL } from "./utlis.js";


const addNewBookmark=(bookmarks,bookmark)=>{
const bookmarkTitleElement=document.createElement("div");
//bookmark title
const newBookmarkElement=document.createElement("div");
//bookmark row contains buttons
const controls=document.createElement("div");
controls.className="bookmark-controls"
bookmarkTitleElement.textContent=bookmark.desc;
bookmarkTitleElement.className="bookmark-title";
setBookmark("play",onplay,controls);
setBookmark("delete",ondelete,controls);
newBookmarkElement.id= "bookmark-" + bookmark.time;
newBookmarkElement.className="bookmark";
newBookmarkElement.setAttribute("timestamp",bookmark.time);

newBookmarkElement.appendChild(bookmarkTitleElement);
newBookmarkElement.appendChild(controls);
bookmarks.appendChild(newBookmarkElement);

};
const onplay =async e=>{
    const activeTab= await getActiveTabURL();
    const bookmarkTime=e.target.parentNode.parentNode.getAttribute("timestamp");
    console.log(`${bookmarkTime}`);
    
    chrome.tabs.sendMessage(activeTab.id,{
        type: "PLAY",
        value: bookmarkTime,
    });
};
const ondelete= async e=>{
    const activeTab= await getActiveTabURL();
    const bookmarkTime=e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkToDelete=document.getElementById("bookmark-"+bookmarkTime);
    bookmarkToDelete.parentNode.removeChild(bookmarkToDelete);
    chrome.tabs.sendMessage(activeTab.id,{
        type: "DELETE",
        value: bookmarkTime,
    },viewBookmarks);
}
const setBookmark=(src,eventListener,controlElement) =>{
    //control element play or delete button 
    const controlElt=document.createElement("img");
    controlElt.src="assets/" +src+".png";
    controlElt.title=src;
    controlElt.addEventListener("click",eventListener);
    controlElement.appendChild(controlElt);
}

const viewBookmarks=(currentBookmarks=[])=>{
const bookmarkElement=document.getElementById("bookmarks");
// bookmarkElement.innerHTML="  ";
if(currentBookmarks.length>0)
{
    for( let i=0;i<currentBookmarks.length;i++)
    {
        const bookmark=currentBookmarks[i];
        addNewBookmark(bookmarkElement,bookmark)
    }
}
else{
    console.log("chal gaya");
    bookmarkElement.innerHTML='<i class="row"> No bookmarks for the video</i>';
}
return;
};




document.addEventListener("DOMContentLoaded",async ()=>{
   const activeTab= await getActiveTabURL();
   const qParams=activeTab.url.split("?")[1];
   const urlParams= new URLSearchParams(qParams);
   const currentVideo=urlParams.get("v");
   if(activeTab.url.includes("youtube.com/watch") && currentVideo){
    chrome.storage.sync.get([currentVideo],(data)=>{
        const currentVideoBookmarks=data[currentVideo] ? JSON.parse(data[currentVideo]):[];
      viewBookmarks(currentVideoBookmarks);
   
    });
   
   }
   else{
    console.log("chall hattbb bjen ");
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not a youtube/watch  page.</div>';
}


});