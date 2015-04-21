'use strict';

requirejs.config(
    {
        paths: {
            'jquery': 'lib/jquery',
            'data': 'main/jsonexample',
            'drawer': 'drawer/drawer'

        }
    }
);

define('jquery-private', ['jquery'], function(jq)
{
    return jq.noConflict(true);
});

require(
    [
        'jquery-private',
        'data',
        'drawer',
        'codemirror/lib/codemirror',
        'codemirror/mode/javascript/javascript',
        'codemirror/addon/hint/show-hint',
        'codemirror/addon/hint/javascript-hint',
        'codemirror/addon/fold/foldcode',
        'codemirror/addon/fold/foldgutter',
        'codemirror/addon/fold/brace-fold',
        'codemirror/addon/fold/comment-fold',
        'codemirror/addon/dialog/dialog',
        'codemirror/addon/search/searchcursor',
        'codemirror/addon/search/search',
        'codemirror/addon/scroll/annotatescrollbar',
        'codemirror/addon/search/matchesonscrollbar',
        'codemirror/addon/selection/active-line',
        'codemirror/addon/edit/matchbrackets',
        'codemirror/addon/display/panel',
        'codemirror/keymap/sublime',
        'lib/jquery-ui.min'
    ],
    function($, json, Drawer, CodeMirror)
    {
        $(document).ready(function()
        {
            var allowUpdate = true;

            /************************EDITOR CONFIGURATION*************************/
            //Editor common param
            var theme = "base16-light";
            var indentUnit = 4;
            var indentWithTabs = true;
            var keyMap = "sublime";
            var lineNumbers = true;
            var styleActiveLine = true;
            var matchBrackets = true;
            var foldGutter = true;
            var gutters = ["CodeMirror-linenumbers", "CodeMirror-foldgutter"];

            var jsonEditor = CodeMirror.fromTextArea(document.getElementById('jsonEditor'), {
                mode: "text/javascript",
                //theme: theme,
                indentUnit: indentUnit,
                indentWithTabs: indentWithTabs,
                keyMap: keyMap,
                lineNumbers: lineNumbers,
                styleActiveLine: styleActiveLine,
                matchBrackets: matchBrackets,
                foldGutter: foldGutter,
                gutters: gutters,
                extraKeys: {
                    "Ctrl-Space": "autocomplete",
                    "Ctrl-Q": function(cm) {
                        cm.foldCode(cm.getCursor());
                    }
                }
            });

            function preview()
            {
                if (allowUpdate) {
                    allowUpdate = false;
                    var json = jsonEditor.doc.getValue();

                    try {
                        json = json.replace(/\\'/g, '\'');
                        drawer.setData(JSON.parse(json));
                    } catch (e) {
                        if (json === "") {
                            drawer.setData({});
                        } else {
                            console.log(e);
                        }
                    }

                    setTimeout(function() {
                        allowUpdate = true;
                    }, 500);
                }
            }

            var resize = function() {
                $("#container").width($(window).width());
                $("#container").height($(window).height());
            };

            resize();
            var drawer = new Drawer();
            jsonEditor.doc.setValue(JSON.stringify(json));

            preview();
            jsonEditor.on("change", preview);


            $(window).resize(resize);

            $('#resizer').draggable({
                stop: function(t, e) {
                    jsonEditor.refresh();
                },
                drag: function(t, e) {
                    'resizer' === $('.CodeMirror').width((e.offset.left - $('#container').offset().left) + 'px');
                    'resizer' === $('#svgBox').width(($('#container').width() - $('.CodeMirror').width() - 14) + 'px');
                },
                axis: "x",
                containment: $('#canvasContainer'),
                iframeFix: true
            });
        });
    }
);