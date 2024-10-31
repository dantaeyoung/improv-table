function setupVideoDeviceSelection() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const deviceOptions = document.getElementById('deviceOptions');
        videoDevices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${index + 1}`;
            deviceOptions.appendChild(option);
        });
    });
}

function startVideoStream(deviceId = null) {
    let constraints = { video: {} };
    if (deviceId) {
        constraints.video.deviceId = { exact: deviceId };
    } else {
        constraints.video = true;
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const video = document.getElementById('videoElement');
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error('Error accessing webcam: ', err);
        });
}

