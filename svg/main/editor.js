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


$(document).ready(function() {
    var jsonEditor = CodeMirror.fromTextArea(document.getElementById('jsonEditor'), {
        mode: "text/javascript",
        theme: theme,
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
});