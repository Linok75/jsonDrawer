/* global json */

var jsonparser;

function Jsonparser(json) {
    this.json = json;
    this.name = this.json.name;
    this.parse();
}

Jsonparser.prototype.parse = function (){
    var step;
    
    for(step in this.json.steps){
        this.createObjectDrawing(this.json.steps[step]);
    }
};

Jsonparser.prototype.createObjectDrawing = function(obj){
    var attribut;
    
    for(attribut in obj){
        console.log(attribut + " = " + obj[attribut] + ", " + obj[attribut].length);
        if((obj[attribut].constructor === Object) && (obj[attribut].constructor !== String)){
            this.createObjectDrawing(obj[attribut]);
        }
    }
};

jsonparser = new Jsonparser(json);