/* global pjs */

function Jsonmapper(json) {
    this.json = json;
    this.name = this.json.name;
    this.parse();
}

Jsonmapper.prototype.parse = function (){
    var step;
    
    for(step in this.json.steps){
        this.drawStep(step);
    }
};

Jsonmapper.prototype.drawStep = function(step){
    pjs.addStep(step);
};