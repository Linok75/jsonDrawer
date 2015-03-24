/* global pjs */

function Jsonmapper(json) {
    this.json = json;
    this.name = this.json.name;
    this.parse();
}

Jsonmapper.prototype.parse = function() {
    var step, path;

    for (step in this.json.steps) {
        this.drawStep(step, this.json.steps[step]);
    }

    for (path in this.json.paths) {
        this.drawPath(path, this.json.paths[path]);
    }
};

Jsonmapper.prototype.drawStep = function(key, step) {
    pjs.addStep(key);
};

Jsonmapper.prototype.drawPath = function(key, path) {
            pjs.addPath(path.options.next_options.label, path.options.source, path.options.destination, path.type, path.options.events);
};