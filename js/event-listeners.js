function addEventListeners() {
  const video = document.getElementById("videoElement");
  const colorPicker = document.getElementById("colorPicker");
  const hueThresholdSlider = document.getElementById("hueThresholdSlider");
  const hueThresholdValue = document.getElementById("hueThresholdValue");
  const satThresholdSlider = document.getElementById("satThresholdSlider");
  const satThresholdValue = document.getElementById("satThresholdValue");
  const valThresholdSlider = document.getElementById("valThresholdSlider");
  const valThresholdValue = document.getElementById("valThresholdValue");
  const dotBoundarySlider = document.getElementById("dotBoundarySlider");
  const dotBoundaryValue = document.getElementById("dotBoundaryValue");
  const fpsSlider = document.getElementById("fpsSlider");
  const fpsValue = document.getElementById("fpsValue");
  const toggleProcessingButton = document.getElementById(
    "toggleProcessingButton",
  );
  const rotateCheckbox = document.getElementById("rotateCheckbox");
  const whiteBalanceCheckbox = document.getElementById("whiteBalanceCheckbox");
  const autoDotBoundaryCheckbox = document.getElementById("autoDotBoundaryCheckbox");
  const debugCheckbox = document.getElementById("debugCheckbox");
  const presentCheckbox = document.getElementById("presentCheckbox");

  document
    .getElementById("deviceOptions")
    .addEventListener("change", (event) => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
      startVideoStream(event.target.value);
    });

  colorPicker.addEventListener("input", (event) => {
    const rgb = hexToRgb(event.target.value);
    selectedColor = rgbToHsv(rgb.r, rgb.g, rgb.b);
  });

  hueThresholdSlider.addEventListener("input", (event) => {
    hueThreshold = parseInt(event.target.value);
    hueThresholdValue.innerText = hueThreshold;
  });

  satThresholdSlider.addEventListener("input", (event) => {
    satThreshold = parseInt(event.target.value);
    satThresholdValue.innerText = satThreshold;
  });

  valThresholdSlider.addEventListener("input", (event) => {
    valThreshold = parseInt(event.target.value);
    valThresholdValue.innerText = valThreshold;
  });

  dotBoundarySlider.addEventListener("input", (event) => {
    dotBoundary = parseInt(event.target.value);
    dotBoundaryValue.innerText = dotBoundary;
  });

  fpsSlider.addEventListener("input", (event) => {
    fps = parseInt(event.target.value);
    fpsValue.innerText = fps;
  });

  rotateCheckbox.addEventListener("change", (event) => {
    rotateVideo = event.target.checked;
  });

  whiteBalanceCheckbox.addEventListener("change", (event) => {
    whiteBalanceVideo = event.target.checked;
  });

  autoDotBoundaryCheckbox.addEventListener("change", (event) => {
    autoDotBoundary = event.target.checked;
  });

  debugCheckbox.addEventListener("change", (event) => {
    debugOutput = event.target.checked;
  });

  presentCheckbox.addEventListener("change", (event) => {
    presentationView = event.target.checked;
    if (presentationView) {
      document.body.classList.add("presentationView");
    } else {
      document.body.classList.remove("presentationView");
    }
  });

  video.addEventListener("click", handleVideoClick);
  video.addEventListener("play", processFrame);

  toggleProcessingButton.addEventListener("click", () => {
    isProcessing = !isProcessing;
    toggleProcessingButton.innerText = isProcessing
      ? "Pause Processing"
      : "Resume Processing";
    if (isProcessing) {
      processFrame();
    }
  });
}

function handleVideoClick(event) {
  const video = document.getElementById("videoElement");
  const rawCanvas = document.getElementById("rawCanvas");
  const rawContext = rawCanvas.getContext("2d", {
    willReadFrequently: true,
  });
  const rect = video.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  rawContext.drawImage(video, 0, 0, rawCanvas.width, rawCanvas.height);
  let imageData = rawContext.getImageData(x, y, 1, 1).data;
  const rgb = { r: imageData[0], g: imageData[1], b: imageData[2] };
  selectedColor = rgbToHsv(rgb.r, rgb.g, rgb.b);
  document.getElementById("colorPicker").value = rgbToHex(rgb.r, rgb.g, rgb.b);
}
