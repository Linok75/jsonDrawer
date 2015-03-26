/* global drawer */

function Jsonmapper(json)
{
    this.json = json;
    this.name = this.json.name;
    this.parse();
}

Jsonmapper.prototype.parse = function()
{
    var step, path;

    for (step in this.json.steps) {
        this.drawStep(step, this.json.steps[step]);
    }

    for (path in this.json.paths) {
        this.drawPath(path, this.json.paths[path]);
    }
};

Jsonmapper.prototype.drawStep = function(key, step)
{
    drawer.addStep(key,step);
};

Jsonmapper.prototype.drawPath = function(key, path)
{
    drawer.addPath(key, path);
};