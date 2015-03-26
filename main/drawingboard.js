/* global json */

var drawer;
var jsonmapper;

include(
    [
        "lib/jquery.js",
        "lib/easeljs.min.js",
        "main/jsonexample.js",
        "main/jsonmapper.js",
        "easeljs/drawer.js",
        "easeljs/step.js",
        "easeljs/path.js"
    ],
    function() {
        return true;
    }
);

function init(){
    drawer = new Drawer(new createjs.Stage("drawingboard"));
    jsonmapper = new Jsonmapper(json);
}