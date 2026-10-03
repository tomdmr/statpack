<?php
$CSS="/css";
$JS="js";
function inputGroup($id, $type, $label){
    echo "<span class='input-group-text' id='input-{$id}'>{$label}</span>\n";
    echo "<input id='{$id}' type='{$type}' class='form-control' aria-label='{$label}' aria-describedby='input-{$id}'>\n";
}
function btnTrigger(){

    echo "<div class='col-md-1'></div>\n";
    echo "<div class='col-md-3'>\n";
    echo "<button type='button' class='btn btn-primary' onclick='makeDiag()'>Make</button>\n";
    echo "<button type='button' class='btn btn-primary' onclick='makeImg('plotlyDiagram', 'jpg-export')'>Copy</button>\n";
    echo "</div>\n";
}

?>
