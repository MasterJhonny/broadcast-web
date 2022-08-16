const canvas = document.getElementById("preview");
const btn = document.getElementById("btn");
const menu = document.getElementById("menu");
const video = document.getElementById("video");

const socket = io();
const FPS = 45;
canvas.style.display = "none";

window.electronAPI.getMediaDevice();
window.electronAPI.init('init emosor!!');

async function loadDisplay() {
    if (menu.value) {
        loadMessge();
        window.electronAPI.loadDisplay(menu.value);
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);
    
        function precessVideo () {
            let begin = Date.now();
            
            cap.read(src);
            cv.imshow("preview", src); 
            socket.emit("stream", canvas.toDataURL("image/jpeg"));
    
            let delay = 1000/ FPS - (Date.now() - begin);
            setTimeout(precessVideo, delay);
        }
        setTimeout(precessVideo, 0);
        changeButton(btn);
    } else {
        alert("Please Select to Display!")
    }
}


function publicMessage(message) {
    const salida = document.getElementById("status");
    salida.classList.add('live');
    salida.innerText = message;
}

function loadMessge() {
    publicMessage("Share Display");
    setTimeout(() => {
        publicMessage("Live Display")
    }, 2000)
}

function errorCamera() {
    publicMessage("Display Fail!")
    setTimeout(() => {
        publicMessage("not Live")
    }, 2000) 
}

function changeButton(btn) {
    if (btn.innerText === 'Emitir') {
        console.log("emitiendo!")
        btn.innerText = 'Dejar de emitir';
    } else {
        window.location.reload();
    }
}

btn.onclick = () => {
    alert(btn.innerText);
    loadDisplay();
}