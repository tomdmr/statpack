<?php
$CSS="/css";
$JS="js";
$PLOTLY="plotly-2.24.1.min.js";
$PLOTLY="plotly-4.1.1.min.js";
function inputGroup($id, $type, $label){
    echo "<span class='input-group-text' id='input-{$id}'>{$label}</span>\n";
    echo "<input id='{$id}' type='{$type}' class='form-control' aria-label='{$label}' aria-describedby='input-{$id}'>\n";
}
function btnTrigger(){

    echo "<div class='col-md-1'></div>\n";
    echo "<div class='col-md-3'>\n";
    echo "<button type='button' class='btn btn-primary' onclick='makeDiag()'>Make</button>\n";
    echo "<button type='button' class='btn btn-primary' onclick='makeImg(\"plotlyDiagram\", \"jpg-export\")'>Copy</button>\n";
    echo "</div>\n";
}
function plotlyDiagExport(){
    echo "<div class='row'>\n";
    echo "  <div class='col-md-1'></div>\n";
    echo "  <div class='col-md-10'>\n";
    //echo "    <div id='plotlyDiagram' class='resizable' style='width:600px;height:300px' onresize='resize(this)' onmousemove='move(this)'></div>\n";
    echo "    <div id='plotlyDiagram' class='resizable' onresize='resize(this)' onmousemove='move(this)'></div>\n";
    echo "  </div>\n";
    echo "</div>\n";
    echo "<div class='row'>\n";
    echo "  <div class='col-md-1'></div>\n";
    echo "  <div class='col-md-10'>\n";
    echo "    <img id='jpg-export'/>\n";
    echo "  </div>\n";
    echo "</div>\n";
}

function resizeHandler(){
    // https://lemonadejs.com/docs/v5/examples/div-onresize/
    echo "function move(e){\n";
    echo "if ((e.w && e.w !== e.offsetWidth) || (e.h && e.h !== e.offsetHeight)){new Function(e.getAttribute('onresize')).call(e);}\n";
    echo "e.w = e.offsetWidth; e.h = e.offsetHeight;\n";
    echo "document.getElementById('cWidth').value = e.w;document.getElementById('cHeight').value = e.h;\n}\n";
    echo "function resize() {}\n";
}
?>
