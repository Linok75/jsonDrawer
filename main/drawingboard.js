var drawer;
var jsonmapper;

include
(
    [
        "lib/jquery.js",
        "lib/easeljs.min.js",
        "main/jsonexample.js",
        "main/jsonmapper.js",
        "drawer/drawer.js",
        "drawer/step.js",
        "drawer/path.js",
        "drawer/infos.js"
    ],
    function() 
    {
        return true;
    }
);

function init()
{
    drawer = new Drawer(new createjs.Stage("drawingboard"));
    jsonmapper = new Jsonmapper(json);
}