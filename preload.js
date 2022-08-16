console.log('Hola preload!')
const { contextBridge, ipcRenderer } = require('electron');

function handleStream (stream) {
    const video = document.querySelector('video')
    video.srcObject = stream
    video.onloadedmetadata = (e) => video.play()
}

function handleError (e) {
    console.log(e)
}


contextBridge.exposeInMainWorld('electronAPI', {
    init: (message) => ipcRenderer.send('message', message),
    getMediaDevice: () => {
        ipcRenderer.on('set:sourse', async (event, data) => {
            console.log(data);
            data.forEach(item => {
                const option = document.createElement("option");
                option.textContent = item.name;
                option.value = item.id;
                menu.appendChild(option); 
            });
            // loadDisplay('window:46137347:0');
        })
    },
    loadDisplay: async (idSource) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: idSource,
                        minWidth: 1280,
                        maxWidth: 1280,
                        minHeight: 720,
                        maxHeight: 720
                    }
                }
            })
            handleStream(stream)
        } catch (e) {
            handleError(e)
        }
    }
})