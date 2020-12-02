import dragElement from "./draggable.js";
import  { dragSort, cleanUpListeners} from "./dragsort.js";

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
let layerNumber = 1;
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
    document.querySelector("#brushSize").innerHTML = `${brush.value}px`;
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

/* dragElement(document.querySelector('.canvasLayers')); */

//drawing function
const draw = (context, x1, y1, x2, y2) => {
  context.strokeStyle = color;
  context.lineWidth = brushSize;
  context.lineCap = "round";
  //brush opacity
  // context.globalAlpha = 0.3;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  /* context.closePath(); */
  
};
//Enable drawing function on first layer
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
    isDrawing = false;
  }
});

//First Layer Visibility
const showHide = document.querySelector(".showHide");
showHide.oninput = function () {
  if (showHide.checked === true) {
    firstCanvas.style.visibility = "hidden";
  } else {
    firstCanvas.style.visibility = "visible";
  }
};

//clear canvas
document.querySelector(".clear").onclick = function clear() {
  const selectedCanvas = document.querySelector(".selectedCanvas");
  const clearContext = selectedCanvas.getContext("2d");
  clearContext.clearRect(0, 0, selectedCanvas.width, selectedCanvas.height);
};
//DELETE LAYER
document.querySelector('.deleteLayer').onclick = function deleteLayer() {
  const currentCanvas = document.querySelector(".selectedCanvas");
  const currentLayer = document.querySelector(".selected");
  const prevCanvas = currentCanvas.previousElementSibling;
  const prevLayer = currentLayer.previousElementSibling;
  const nextCanvas = currentCanvas.nextElementSibling;
  const nextLayer = currentLayer.nextElementSibling;

  cleanUpListeners(currentLayer);
  //select next bottom layer before deleting current layer
  //else, select previous upper layer
  if(nextLayer) {
    nextLayer.classList.add('selected');
    prevCanvas.classList.add('selectedCanvas');
  } else {
    prevLayer.classList.add('selected');
    nextCanvas.classList.add('selectedCanvas');
  }
  currentCanvas.remove();
  currentLayer.remove();
};
//create layer and add event listener to them
document.querySelector(".addLayer").onclick = function addLayer() {
  layerNumber++;
  //ADD NEW CANVAS
  const canvasContainer = document.querySelector(".canvasContainer");
  const addCanvas = document.createElement("canvas");
  canvasContainer.appendChild(addCanvas);
  addCanvas.setAttribute("id", `canvas${layerNumber}`);
  addCanvas.setAttribute("width", "500");
  addCanvas.setAttribute("height", "500");

  //ADD NEW LAYER TO LAYER PANEL
  const layerPanel = document.querySelector(".layerPanel__layerList");
  const addLayer = document.createElement("div");
  addLayer.classList.add("layerPanel__layers");
  layerPanel.prepend(addLayer);
  const layers = document.querySelectorAll(".layerPanel__layers");
  addLayer.setAttribute("id", `${layerNumber}`);
  addLayer.draggable = true;

  //ADD VISIBILITY TOGGLE TO NEW LAYER
  const addToggle = document.createElement("input");
  addToggle.classList.add("showHide");
  addToggle.type = "checkbox";
  addLayer.appendChild(addToggle);

  //ADD LAYER NAME
  const addLayerName = document.createElement("p");
  addLayerName.innerHTML = `Layer ${layerNumber}`;
  addLayer.appendChild(addLayerName);

  layers.forEach((layer) => {
    //MAKE EACH LAYER DRAGGABLE
    /* dragElement(layer); */
    //SELECTING LAYERS
    layer.addEventListener("click", (e) => {
      if (e.target.tagName === "DIV") {
        const currentLayer = document.querySelector(".selected");
        const currentCanvas = document.querySelector(".selectedCanvas");
        currentLayer.classList.remove("selected");
        currentCanvas.classList.remove("selectedCanvas");
        e.target.classList.add("selected");
        const layerId = e.target.id;
        const targetCanvas = document.querySelector(`#canvas${layerId}`);
        targetCanvas.classList.add("selectedCanvas");

        const selectedCanvas = document.querySelector(".selectedCanvas");
        // SET DRAWING FUNCTION TO SELECTED CANVAS
        const context = selectedCanvas.getContext("2d");
        selectedCanvas.addEventListener("mousedown", (e) => {
          /* draw(context, x, y, e.offsetX, e.offsetY); */
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
  dragSort();
};