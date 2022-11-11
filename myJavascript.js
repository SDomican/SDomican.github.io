var vid1 = document.getElementById("video1");
var vid2 = document.getElementById("video2");


function download(url, filename) {
alert("Download function activated");
fetch(url)
    .then(response => response.blob())
    .then(blob => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
})
.catch(console.error);
}

function getAudioURL(url){
    let newURL = url;
    if(url.includes("/DASH_720.mp4?source=fallback")){
        newURL = url.replace("/DASH_720.mp4?source=fallback", "/DASH_audio.mp4");
    }
    return newURL;
}

function get(yourUrl){
    var Httpreq = new XMLHttpRequest(); 
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function getJSON(url){
    var json_obj = JSON.parse(get(url));
    return json_obj;
}

function getVideoLinkForNextPage(){
    const inputVal = document.getElementById("myText").value;  
    localStorage.setItem('linkURL', inputVal);
    window.location.href = "page.html";
}

function getVideo(){
    var inputVal = localStorage.getItem('linkURL');
    inputVal += ".json";
    var json_obj = getJSON(inputVal);
    return json_obj;
}

function hideImage() {
    var img = document.getElementById('picture');
    img.style.visibility = 'hidden';
}

function loadVideo(){
    var json_obj = getVideo();

    var video1 = document.getElementById('video1');
    var source1 = document.getElementById('vid1Source');

    var video2 = document.getElementById('video2');
    var source2 = document.getElementById('vid2Source');
    var iFrame = document.getElementById('IFrame');

    if(json_obj[0].data.children[0].data.is_reddit_media_domain === true){
        source1.setAttribute('src', getAudioURL(json_obj[0].data.children[0].data.secure_media.reddit_video.fallback_url));
        source2.setAttribute('src', json_obj[0].data.children[0].data.secure_media.reddit_video.fallback_url);
        video2.removeAttribute("hidden");
    }
    else if(json_obj[0].data.children[0].data.secure_media.type === 'youtube.com'){
        source2.setAttribute('src', json_obj[0].data.children[0].data.url_overridden_by_dest);
        iFrame.removeAttribute("hidden");
    }
    else{
        console.log("Undefined");
    }

    hideImage();

    video1.load();
    video2.load();

    // var test = mergeVideo(video1, video2);
    // console.log("merge: " + test);
}

async function mergeVideo(video, audio) {
    let { createFFmpeg, fetchFile } = FFmpeg;
    let ffmpeg = createFFmpeg();
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));
    ffmpeg.FS('writeFile', 'audio.mp4', await fetchFile(audio));
    await ffmpeg.run('-i', 'video.mp4', '-i', 'audio.mp4', '-c', 'copy', 'output.mp4');
    let data = await ffmpeg.FS('readFile', 'output.mp4');
    return new Uint8Array(data.buffer);
};

function playBoth(url, filename) {
    alert("Play Both function activated: " + vid1);
    var x = document.getElementById("myText").value;
    document.getElementById("demo").innerHTML = x;
    playVid();
    }
    
function playVid() {
    console.log("playVid");
    vid1.play();
    vid2.play();
}
    
function pauseVid() {
    console.log("pauseVid");
    vid1.pause();
    vid2.pause();
}

function showImage() {
    var img = document.getElementById('picture');
    img.style.visibility = 'visible';
}





