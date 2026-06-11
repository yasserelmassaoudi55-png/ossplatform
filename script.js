 let videos = JSON.parse(localStorage.getItem("videos")) || [];
 let stream;
let recorder;
let chunks = [];

function showHome(){
    document.getElementById("videos").style.display = "grid";
    document.getElementById("historySection").classList.add("hidden");
    document.getElementById("channelSection").classList.add("hidden");
}

function showHistory(){
    document.getElementById("videos").style.display = "none";
    document.getElementById("historySection").classList.remove("hidden");
    document.getElementById("channelSection").classList.add("hidden");

    const container = document.getElementById("historyVideos");
    container.innerHTML = "";

    historyVideos.forEach(video=>{
        container.innerHTML += `
        <div class="video-card">
            <h3>${video.title}</h3>
            <video controls>
                <source src="${video.src}">
            </video>
        </div>
        `;
    });
}

function showChannel(){
    document.getElementById("videos").style.display = "none";
    document.getElementById("historySection").classList.add("hidden");
    document.getElementById("channelSection").classList.remove("hidden");

    const container = document.getElementById("channelVideos");
    container.innerHTML = "";

    videos.forEach(video=>{
        container.innerHTML += `
        <div class="video-card">
            <h3>${video.title}</h3>
            <video controls>
                <source src="${video.src}">
            </video>
        </div>
        `;
    });
}

function addToHistory(video){
    historyVideos.unshift(video);
    localStorage.setItem("history", JSON.stringify(historyVideos));
}
// فتح/غلق upload box

// فتح/غلق upload box
function toggleUpload(){
    document.getElementById("uploadBox").classList.toggle("hidden");
}
async function startRecording() {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => {
        chunks.push(e.data);
    };

    recorder.onstop = saveVideo;

    recorder.start();
    console.log("Recording...");
}
 // إيقاف التسجيل
function stopRecording() {
    if(recorder){
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
}
// حفظ الفيديو المسجل
function saveVideo() {

    const blob = new Blob(chunks, { type: "video/webm" });

    const reader = new FileReader();

     reader.onload = function(e) {

    const videoData = {
        id: Date.now(),
        title: "فيديو مسجل",
        src: e.target.result,
        likes: 0
    };

    videos.unshift(videoData);

    localStorage.setItem("videos", JSON.stringify(videos));

    displayVideos();
};
    reader.readAsDataURL(blob);

    chunks = [];


}

// رفع فيديو من الجهاز

function uploadVideo(){
    const title = document.getElementById("title").value;
    const file = document.getElementById("file").files[0];

    if(!title || !file){
        alert("أدخل عنوان واختر فيديو");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e){
        const videoData = {
            id: Date.now(),
            title: title,
            src: e.target.result,
            likes: 0
        };

        videos.unshift(videoData);
        localStorage.setItem("videos", JSON.stringify(videos));
        displayVideos();
    };

    reader.readAsDataURL(file);

    document.getElementById("title").value="";
    document.getElementById("file").value="";
}

// عرض الفيديوهات

function displayVideos(){
    const container = document.getElementById("videos");
    container.innerHTML="";

    videos.forEach(video=>{
        container.innerHTML += `
        <div class="video-card">
            <h3>${video.title}</h3>
            <video width="100%" controls>
                <source src="${video.src}">
            </video>
            <p>❤️ ${video.likes}</p>
            <button onclick="likeVideo(${video.id})">إعجاب</button>
            <button onclick="deleteVideo(${video.id})">حذف</button>
        </div>
        `;
    });
}
  function addToHistoryById(id){

    const video = videos.find(v => v.id === id);

    if(video){

        historyVideos.unshift(video);

        localStorage.setItem(
            "history",
            JSON.stringify(historyVideos)
        );
}}

function likeVideo(id){
    videos = videos.map(v=>{
        if(v.id===id) v.likes++;
        return v;
    });
  localStorage.setItem("videos", JSON.stringify(videos));
    displayVideos();
    
}

function deleteVideo(id){
    videos = videos.filter(v=>v.id!==id);
    localStorage.setItem("videos", JSON.stringify(videos));
    displayVideos();
}

function searchVideos(){
    const value = document.getElementById("search").value.toLowerCase();
    const filtered = videos.filter(v=>v.title.toLowerCase().includes(value));

    const container = document.getElementById("videos");
    container.innerHTML="";

    filtered.forEach(video=>{
        container.innerHTML += `
        <div class="video-card">
            <h3>${video.title}</h3>
            <video width="100%" controls>
                <source src="${video.src}">
            </video>
            <p>❤️ ${video.likes}</p>
        </div>
        `;
    });

}
// أول تحميل
displayVideos();
