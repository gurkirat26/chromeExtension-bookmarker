(()=>{
let ytLeftControl,ytPlayer;
let currentVideo="";
let currentVideoBookmarks=[];

// async is like parallel processing 3 lanes for 3 cars
//sync is like sequencial data processing 1 lane for 3 cars
// async is like a subroutine but the main program also continues to work while the subroutine processes
// a callback is when a function is passed to another function as an argument 
// a callback is usefull when we have to perform a function after excuting an event like loading up of a file etc
//a promise is a returned object to which you attach callbacks, instead of passing callbacks into a function
const fetchBookmarks=()=>{
    return new Promise((resolve)=>{
        chrome.storage.sync.get([currentVideo],(obj)=>{
            resolve(obj[currentVideo]? JSON.parse(obj[currentVideo]): [])
        });
    });
};
const addNewBookmarkEventHandler= async()=>{
    const currentTime=ytPlayer.currentTime;
    const newBookmark={
        time: currentTime,
        desc: "bookmarked at" + getTime(currentTime),
    };
    currentVideoBookmarks= await fetchBookmarks();
    // console.log(newBookmark);
    chrome.storage.sync.set({
    [currentVideo]: JSON.stringify([...currentVideoBookmarks,newBookmark].sort((a,b)=> a.time-b.time))
    });
    //set takes {key:values}
    //force to evaluate the variable key using [key] when saving. That way is easy to set your keys dynamically
};
const newVideoLoaded= async()=>{
    const bBtnExists=document.getElementsByClassName("bookmark-btn")[0];
    currentVideoBookmarks= await fetchBookmarks();
    if(!bBtnExists)
    {
        const bookmarkBtn=document.createElement("img");
        //creates html element by "tag_name"
        bookmarkBtn.src=chrome.runtime.getURL("assets/bookmark.png");
        //similar to get the img src from the web this creates a link of sort
        bookmarkBtn.className="ytp-button" +"bookmark-btn";
        bookmarkBtn.title="click to bookmark";
        ytLeftControl=document.getElementsByClassName("ytp-left-controls")[0];
        ytPlayer=document.getElementsByClassName("video-stream")[0];
        ytLeftControl.appendChild(bookmarkBtn);
        //child are the inner html elements within a doc also if some text is included within the html element we say that text is the child of the element
        bookmarkBtn.addEventListener("click",addNewBookmarkEventHandler);
    }
}
chrome.runtime.onMessage.addListener((obj,sender,response)=>{
    const {type,value,videoId}=obj;
    if(type==="NEW")
    {
        currentVideo=videoId;
        newVideoLoaded();
    }
    else if(type==="PLAY")
    {
       ytPlayer.currentTime=value;
    }
    else if (type=="DELETE")
    {
        currentVideoBookmarks=currentVideoBookmarks.filter((b)=>b.time!=value);
        chrome.storage.sync.set({[currentVideo]:JSON.stringify(currentVideoBookmarks)});
        response(currentVideoBookmarks);
    }

});

newVideoLoaded();

})();
const getTime=t=>{
    var date= new Date(0);
    date.setSeconds(t);
    return date.toISOString().substr(11,8);
}