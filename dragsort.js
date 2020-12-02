const canvasContainer = document.querySelector('.canvasContainer');
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
    const sortedCanvas = document.getElementById(`canvas${dragging.id}`);
    dragging.classList.remove('dragging');
    removeIndicator();
    toggle = false;
    //add layer and canvas to new position
    if (afterElement == null || afterElement == undefined){
            layerContainer.appendChild(dragging);
            canvasContainer.prepend(sortedCanvas);
    } else {
        const afterSortedCanvas = document.getElementById(`canvas${afterElement.id}`).nextSibling;
        layerContainer.insertBefore(dragging, afterElement);
        canvasContainer.insertBefore(sortedCanvas, afterSortedCanvas);
    }
    
}

//get element after cursor while dragging
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
        layer.removeEventListener('dragover', dragOver);
        layer.removeEventListener('dragend', dragEnd);
        layer.removeEventListener('dragleave', dragLeave);
        layer.addEventListener('dragover', dragOver);
        layer.addEventListener('dragleave', dragLeave);
        layer.addEventListener('dragend', dragEnd);
        layer.ondragstart = ()=>{
            layer.classList.add('dragging');
        };
        
    })
}
const cleanUpListeners = (selectedLayer) => {
    selectedLayer.removeEventListener('dragstart', dragOver);
    selectedLayer.removeEventListener('dragstart', dragLeave);
    selectedLayer.removeEventListener('dragstart', dragEnd);
}

export {dragSort, cleanUpListeners};