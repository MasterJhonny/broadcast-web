document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("preview");
    const btn = document.getElementById("btn");
    const video = document.getElementById("video");
    const salida = document.getElementById("status");
    
    const socket = io();
    const FPS = 45;
    canvas.style.display = "none";

    socket.on("connect", () => {
        console.log("socket connect", socket.id)
    })

    socket.emit("saludo", "hola")

    function hadleError(error) {
        console.log("ups, Ocurrio un error!", error);
        publicMessage("Ups, no seleccionaste ninguna ventana!")
        setTimeout(() => {
            publicMessage("")
        }, 2000)
    }

    async function startCapture (btn) {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            video.srcObject = stream;
            video.play();
            video.dataset.status = "start";
            btn.textContent = "Dejar de emitir";
        } catch (error) {
            hadleError(error)
        }
    }

    function stopCapture(btn) {
        let tracks = video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        video.srcObject = null;
        video.dataset.status = "stop";
        btn.textContent = "Emitir";
    }
    
    async function streamDisplay() {
        publicMessage("Live Display");

        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let cap = new cv.VideoCapture(video);
    
        function precessVideo () {
            let begin = Date.now();
            
            cap.read(src);
            cv.imshow("preview", src); 
            socket.emit("stream", canvas.toDataURL("image/jpeg"));
    
            let delay = 1000/ FPS - (Date.now() - begin);
            loopStream = setTimeout(precessVideo, delay);
        }
        setTimeout(precessVideo, 0);
    }
    
    
    function publicMessage(message) {
        salida.classList.toggle('live');
        salida.innerText = message;
    }
    
    
    btn.onclick = async () => {
        console.log("video", video.dataset.status)
        
        if (video.dataset.status === "stop") {
            await startCapture(btn);
            streamDisplay();
        } else {
            stopCapture(btn);
            publicMessage("");
        }
    }
})
