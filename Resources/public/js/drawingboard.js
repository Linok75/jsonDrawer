var drawingboard;
var context;

//To avoid image deformation, append canvas and get id after.
$('body').append($('<canvas>',{id:"drawingboard"}).attr({'width':$(window).width(),'height':$(window).height()}));

drawingboard = $('#drawingboard').get(0);
context = drawingboard.getContext('2d');

/*
***********Test***********
context.fillRect(50, 25, 150, 100);
*/