requirejs.config({
    paths: {
        'easeljs': 'lib/easeljs',
        'drawer': 'drawer/drawer'
    }
});

define(
    [
        'drawer',
        'easeljs'
    ],
    function(Drawer) {
        function Jsonmapper(json)
        {
            this.json = json;
            this.name = this.json.name;
            this.drawer = new Drawer(new createjs.Stage("drawingboard"));

            this.parse();
        };

        Jsonmapper.prototype.parse = function()
        {
            var step, path;

            for (step in this.json.steps) {
                this.drawStep(step, this.json.steps[step]);
            }

            for (path in this.json.paths) {
                this.drawPath(this.json.paths[path].options.next_options.label, this.json.paths[path]);
            }
        };

        Jsonmapper.prototype.drawStep = function(key, step)
        {
            this.drawer.addStep(key, step);
        };

        Jsonmapper.prototype.drawPath = function(key, path)
        {
            this.drawer.addPath(key, path);
        };
        
        return Jsonmapper;
    }
);