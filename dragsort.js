// try threshold observer?S
// sort canvas
const selectedLayer = document.querySelector('.selected');
const selectedCanvas = document.querySelector('.selectedCanvas');
const layerContainer = document.querySelector('.layerPanel__layerList');
var toggle = false;

const dragOver = (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const indicator = document.createElement("div");
    indicator.classList.add('layerPanel__indicator');
    if(toggle == false){
        if ( afterElement == null || afterElement == undefined){
            layerContainer.appendChild(indicator);
            toggle = true;
        }else{
            layerContainer.insertBefore(indicator, afterElement);
            toggle = true;
        }
    }
}

const dragLeave = (e)=> {
    e.preventDefault();
    toggle = false;
    removeIndicator();
}

const dragEnd = (e) => {
    const afterElement = getDragAfterElement(e.clientY);
    const dragging = document.querySelector('.dragging');
    //add layer to new position
    if (afterElement == null || afterElement == undefined){
            layerContainer.appendChild(dragging);
    } else {
        layerContainer.insertBefore(dragging, afterElement);
    }
    dragging.classList.remove('dragging');
    removeIndicator();
    toggle = false;
}

const getDragAfterElement = ( y) => {
    // grab all layers that isn't 'dragging'
    const draggableElements = 
    [...document.querySelectorAll('.layerPanel__layers:not(.dragging)')];
    
    return draggableElements.reduce((closest, layer) => {
        const boundBox = layer.getBoundingClientRect();
        //distance from center of layer height to cursor
        const offset = y - boundBox.top - boundBox.height/2;
        if (offset < 0 && offset > closest.offset){
            return {offset: offset, element: layer}
        }else{
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}

const removeIndicator = () => {
    const indicator = document.querySelector('.layerPanel__indicator')
    if (indicator){
        indicator.remove();
    } else {
        return;
    }
}
const dragSort = () => {
    const layers = document.querySelectorAll('.layerPanel__layers:not(.dragging)');

    layers.forEach((layer) => {
        layer.removeEventListener('dragstart', dragOver);
        layer.removeEventListener('dragstart', dragEnd);
        layer.removeEventListener('dragleave', dragLeave);
        layer.addEventListener('dragover', dragOver);
        layer.addEventListener('dragleave', dragLeave);
        layer.addEventListener('dragend', dragEnd);
        layer.ondragstart = ()=>{
            layer.classList.add('dragging');
        };
        
    })
}

export {dragSort};
// if ( afterElement == null || afterElement == undefined){
    //     indicatorBottom(indicator);
    // }else{
    //     indicatorTop(indicator, afterElement);
    // }
// function indicatorBottom (indicator){
//     const topIndicator = document.getElementById('top');
//     if (topIndicator){
//         topIndicator.remove();
//     }
//     indicatorBottom = function (){};
//     indicator.setAttribute('id', 'bottom');
//     layerContainer.appendChild(indicator);
// }
// function indicatorTop (indicator, afterElement){
//     const bottomIndicator = document.getElementById('bottom');
//     if (bottomIndicator){
//         bottomIndicator.remove();
//     }
//     indicatorTop = function (){};
//     indicator.setAttribute('id', 'top');
//     layerContainer.insertBefore(indicator, afterElement);
// }

// const bottomIndicator = document.getElementById('bottom');
//     const topIndicator = document.getElementById('top');
//     if (bottomIndicator){
//         bottomIndicator.remove();

//     } else if (topIndicator) {
//         topIndicator.remove();
//     }