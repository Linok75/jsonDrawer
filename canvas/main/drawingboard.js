'use strict';

requirejs.config(
        {
            paths: {
                'jquery': 'lib/jquery',
                'data': 'main/jsonexample',
                'mapper': 'main/jsonmapper'

            }
        }
);

define('jquery-private', ['jquery'], function (jq)
{
    return jq.noConflict(true);
});

require(
        [
            'jquery-private',
            'data',
            'mapper',
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
        function ($, json, Jsonmapper, CodeMirror)
        {
            $(document).ready(function ()
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
                        "Ctrl-Q": function (cm) {
                            cm.foldCode(cm.getCursor());
                        }
                    }
                });

                //Set the preview IFrame content
                function preview()
                {
                    if (allowUpdate) {
                        allowUpdate = false;
                        var json = jsonEditor.doc.getValue();

                        try {
                            json = json.replace(/\\'/g, '\'');
                            mapper.setJson(JSON.parse(json));
                        } catch (e) {
                            if (json === "") {
                                mapper.setJson({});
                            } else {
                                console.log(e);
                            }
                        }

                        setTimeout(function () {
                            allowUpdate = true;
                        }, 500);
                    }
                }

                var resize = function () {
                    $("#canvasContainer").width($(window).width());
                    $("#canvasContainer").height($(window).height());
                };


                var mapper = new Jsonmapper(json);
                resize();
                preview();

                jsonEditor.on("change", preview);
                $(window).resize(resize);

                $('#resizer').draggable({
                    stop: function (t, e) {
                        jsonEditor.refresh();
                        preview();
                    },
                    drag: function (t, e) {
                        'resizer' === $('.CodeMirror').width((e.offset.left - $('#canvasContainer').offset().left) + 'px');
                        'resizer' === $('#canvasViewer').width(($('#canvasContainer').width() - $('.CodeMirror').width() - 14) + 'px');
                    },
                    axis: "x",
                    containment: $('#canvasContainer'),
                    iframeFix: true
                });
            });
        }
);