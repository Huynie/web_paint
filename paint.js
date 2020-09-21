const firstCanvas = document.querySelector("#canvas1");
/* const firstSelected = document.querySelector(".selectedCanvas"); */
const contextFirst = firstCanvas.getContext("2d");
const Sliders = document.querySelectorAll('[type="range"]');
const hue = document.querySelector(".hue");
const saturation = document.querySelector(".saturation");
const brightness = document.querySelector(".brightness");
const CurrentColor = document.querySelector(".color");
const brush = document.querySelector(".brushSize");

let isDrawing = false;
let x = 0;
let y = 0;
let color = "black";
let brushSize = 1;
//change color when clicked
/* swatches.addEventListener("click", (e) => {
  const style = getComputedStyle(swatches);
  color = style.backgroundColor;
}); */

//HSL SLIDER
Sliders.forEach((slider, idx) => {
  const label = document.querySelectorAll("label");
  label[idx].innerHTML = slider.value;
  slider.oninput = function () {
    label[idx].innerHTML = slider.value;
    //update brush size
    brushSize = brush.value;
    //update brush color
    color = `hsl(${hue.value}, ${saturation.value}%, ${brightness.value}%)`;
    CurrentColor.style.backgroundColor = color;
    //update slider background
    saturation.style.background = `linear-gradient( to right, hsl(0, 0%, ${
      brightness.value
    }%) , hsl(${hue.value}, 100%, ${brightness.value / 2}%))`;
    brightness.style.background = `linear-gradient( to right, hsl(0, 0%, 0%), hsl(0, ${saturation.value}%, 100%))`;
  };
});

//drawing component
const draw = (context, x1, y1, x2, y2) => {
  context.strokeStyle = color;
  context.lineWidth = brushSize;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
};
//Enable drawing function on first layer
firstCanvas.style.pointerEvents = "all";
firstCanvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});

firstCanvas.addEventListener("mousemove", (e) => {
  if (isDrawing === true) {
    draw(contextFirst, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener("mouseup", (e) => {
  if (isDrawing === true) {
    draw(contextFirst, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

//First Layer Visibility
const showHide = document.querySelector(".showHide");
showHide.oninput = function () {
  if (showHide.checked === true) {
    firstCanvas.style.visibility = "hidden";
    console.log("checked");
  } else {
    firstCanvas.style.visibility = "visible";
    console.log("unchecked");
  }
};

//clear canvas
document.querySelector(".clear").onclick = function clear() {
  const selectedCanvas = document.querySelector(".selectedCanvas");
  const clearContext = selectedCanvas.getContext("2d");
  clearContext.clearRect(0, 0, selectedCanvas.width, selectedCanvas.height);
};

//create layer and add event listener to them
document.querySelector(".addLayer").onclick = function addLayer() {
  //ADD NEW CANVAS
  const canvasContainer = document.querySelector(".canvasContainer");
  const addCanvas = document.createElement("canvas");
  canvasContainer.appendChild(addCanvas);
  const canvas = document.querySelectorAll("canvas");
  addCanvas.setAttribute("id", `canvas${canvas.length}`);
  addCanvas.setAttribute("width", "500");
  addCanvas.setAttribute("height", "500");

  //ADD NEW LAYER TO LAYER PANEL
  const layerPanel = document.querySelector(".layerPanel__layerList");
  const addLayer = document.createElement("div");
  addLayer.classList.add("layerPanel__layers");
  layerPanel.prepend(addLayer);
  const layers = document.querySelectorAll(".layerPanel__layers");
  addLayer.innerHTML = `layer ${layers.length}`;
  addLayer.setAttribute("id", `${layers.length}`);

  //ADD VISIBILITY TOGGLE TO NEW LAYER
  const addToggle = document.createElement("input");
  addToggle.classList.add("showHide");
  addToggle.type = "checkbox";
  addLayer.appendChild(addToggle);

  layers.forEach((layer) => {
    //SELECTING LAYERS
    layer.addEventListener("click", (e) => {
      if (e.target.tagName === "DIV") {
        const currentLayer = document.querySelector(".selected");
        const currentCanvas = document.querySelector(".selectedCanvas");
        currentLayer.classList.remove("selected");
        currentCanvas.classList.remove("selectedCanvas");
        e.target.classList.add("selected");
        console.log(e.target.parentNode.id);
        const layerId = e.target.id;
        const targetCanvas = document.querySelector(`#canvas${layerId}`);
        targetCanvas.classList.add("selectedCanvas");

        currentCanvas.style.pointerEvents = "none";
        targetCanvas.style.pointerEvents = "all";

        const selectedCanvas = document.querySelector(".selectedCanvas");

        const context = selectedCanvas.getContext("2d");
        selectedCanvas.addEventListener("mousedown", (e) => {
          x = e.offsetX;
          y = e.offsetY;
          isDrawing = true;
        });

        selectedCanvas.addEventListener("mousemove", (e) => {
          if (isDrawing === true) {
            draw(context, x, y, e.offsetX, e.offsetY);
            x = e.offsetX;
            y = e.offsetY;
          }
        });

        window.addEventListener("mouseup", (e) => {
          if (isDrawing === true) {
            draw(context, x, y, e.offsetX, e.offsetY);
            x = 0;
            y = 0;
            isDrawing = false;
          }
        });
      }
      //LAYER VISIBILITY
      addToggle.oninput = function () {
        const layerId = e.target.parentNode.id;
        const targetCanvas = document.querySelector(`#canvas${layerId}`);
        if (addToggle.checked === true) {
          targetCanvas.style.visibility = "hidden";
        } else {
          targetCanvas.style.visibility = "visible";
        }
      };
    });
  });

  //ENABLE DRAWING FUNCTION
  /* for (idx = 0; idx < canvas.length; idx++) {
    const context = canvas[idx].getContext("2d");
    canvas[idx].addEventListener("mousedown", (e) => {
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = true;
    });

    canvas[idx].addEventListener("mousemove", (e) => {
      if (isDrawing === true) {
        draw(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (isDrawing === true) {
        draw(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
      }
    });
  } */
};
