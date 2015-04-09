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
        function Jsonmapper()
        {
            this.drawer = new Drawer(new createjs.Stage("drawingboard"));
        }
        ;

        Jsonmapper.prototype.setJson = function(json) {
            this.drawer.clear();
            this.json = json;
            this.parse();
        };

        Jsonmapper.prototype.parse = function()
        {
            var step, path;

            if (typeof (this.json.name) !== "undefined") {
                this.name = this.json.name;
            }

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
        
        Jsonmapper.prototype.resize = function() {
            this.drawer.resize();
        };

        return Jsonmapper;
    }
);