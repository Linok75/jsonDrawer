'use strict';
var changed = false;
requirejs.config(
    {
        paths: {
            'd3': 'lib/d3.min',
            'step': 'drawer/step',
            'path': 'drawer/path',
            'infos': 'drawer/infos',
            'endstep': 'drawer/endStep'
        }
    }
);
define(
    [
        'jquery-private',
        'd3'
    ],
    function($)
    {
        function Drawer()
        {
            this.svg = d3.select('#svgBox')
                .append('svg:svg')
                .attr('id', 'drawingboard')
                .attr('width', $('#svgBox').width())
                .attr('height', $('#svgBox').height())
                .style('background-color', d3.rgb(183, 196, 189));

            this.steps = this.svg
                .append('svg:g')
                .attr('id', 'steps');
            
            this.data = {};
        }

        Drawer.prototype.resize = function() {
            this.svg
                .attr('width', $('#svgBox').width())
                .attr('height', $('#svgBox').height());
        };

        Drawer.prototype.setData = function(data) {
            this.data = data;
            
            this.draw();
        };

        Drawer.prototype.draw = function() {            
            this.steps = this.steps
                .data([0,1,2,3])
                .enter()
                .append('svg:g')
                .text(function(d,i) { return 'value : ' + d + ' || index : ' + i; });
        };

        return Drawer;
    }
);