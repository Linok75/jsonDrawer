/* global json */

var pjs;
var jsonmapper;

$(document).ready(function () {
    getPjsInstance();
});

function getPjsInstance() {
    var instanciate = false;
    pjs = Processing.getInstanceById('drawingboard');
    
    if (typeof pjs !== 'undefined'){
        instanciate = true;
    }
    if (!instanciate){
        setTimeout(getPjsInstance, 250);
    }else{
        initPjs();
    }
}

function initPjs(){
    pjs.canvasSize($(window).width(), $(window).height());
    jsonmapper = new Jsonmapper(json);
}