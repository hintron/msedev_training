//
//// Attach event handlers and initialize code
//
document.addEventListener("DOMContentLoaded", function(event) {
    var pieces = document.getElementsByClassName("test");
    for (var i = pieces.length - 1; i >= 0; i--) {
        pieces[i].addEventListener("click", click_handler);
    }
});

function click_handler(ev){
    var element = ev.currentTarget;
    // Don't just clone the div, also clone everything inside
    var deepClone = true;
    var clone = element.cloneNode(deepClone);
    // Attach the node to the body, so that it gets attached to the document and doesn't get garbage collected
    document.body.appendChild(clone);
    // Attach a new click handler to the cloned node
    clone.addEventListener("click", click_handler);
}