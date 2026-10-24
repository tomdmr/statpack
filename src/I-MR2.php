<?php
include('config/common.php')
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <link href="<?=$CSS?>/bootstrap-5.3/css/bootstrap.min.css" rel="stylesheet">
        <link href="<?=$CSS?>/bootstrap-icons/bootstrap-icons.min.css" rel="stylesheet">
        <script src="<?=$CSS?>/bootstrap-5.3/js/bootstrap.bundle.min.js"></script>
        <script src="js/readers.js"></script>
        <script src="js/d3.v7.min.js"></script>
        <script src="js/<?=$PLOTLY?>"></script>
        <script src="js/fast-stats.js"></script>
        <script src="js/sprintf.js"></script>
        <script src="js/imrModel.js"></script>
        <style>
         .resizable {
             resize: both;
             overflow: scroll;
             border: 1px solid black;
             width: 800px;
             height: 400px;
         }
         .nopadding {
             padding: 0;
             margin: 0;
         }
        </style>
        <title>I-MR Chart (Regelkarte)</title>
    </head>
    <body onload="initPage()">
        <div class="container-fluid">
            <div class="row">
                <h2>I-MR Chart</h2>
            </div>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-8">
                    <div class="input-group input-group-sm mb-3">
                        <?php inputGroup("input-title", "text", "Titel"); ?>
                        <?php inputGroup("input-subtitle", "text", "Untertitel"); ?>
                    </div>
                    <div class="input-group input-group-sm mb-3">
                        <?php inputGroup("input-usl", "number", "USL"); ?>
                        <?php inputGroup("input-lsl", "number", "LSL"); ?>
                    </div>
                    <div class="input-group input-group-sm mb-3">
                        <span class="input-group-text" id="input-width">Width</span>
                        <input type="number" id="cWidth" class="form-control" aria-label="" aria-describedby="input-width" value="600">
                        <span class="input-group-text" id="input-width">Height</span>
                        <input type="number" id="cHeight" class="form-control" aria-label="" aria-describedby="input-height" value="300">
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="R1" value="option1" checked>
                        <label class="form-check-label" for="inlineCheckbox1"> 1 > 3 StDev off</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="R2" value="option1">
                        <label class="form-check-label" for="inlineCheckbox1">2 of 3 > 2 StdDev</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="R3" value="option1">
                        <label class="form-check-label" for="inlineCheckbox1">4 of 5 > 1 StdDev </label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="R4" value="option1">
                        <label class="form-check-label" for="inlineCheckbox1">8 of 8 same side of mean</label>
                    </div>
                </div><!-- col-md-8 -->
            </div>
            <div class="row">
                <?php btnTrigger(); ?>
            </div>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-4">
                    <table id="pTab" class="table table-bordered table-sm"></table>
                </div>
                <div class="col-md-1"></div>
            </div>
            <?php plotlyDiagExport(); ?>
            <?php dataTextArea(); ?>
        </div> <!--container-fluid -->
        <script>
         function makeDiag(){
             //document.getElementById('tdata').value = text;
             let data = readValues(document.getElementById('tdata').value);
             console.log(data);
             let SpL = (document.getElementById('input-usl').value === '')
                     ||(document.getElementById('input-lsl').value === '') ?
                       []
                     : [ Number(document.getElementById('input-lsl').value), Number(document.getElementById('input-usl').value) ];
             console.log(SpL);

             let SpLvl =    [ Number(document.getElementById('input-lsl').value), Number(document.getElementById('input-usl').value) ];
             let N, UCL_I, IBar, LCL_I, UCL_MR;
             let plotlyDiagram = document.getElementById('plotlyDiagram');

             [N, UCL_I, IBar, LCL_I, UCL_MR] =
                 IMRChart('plotlyDiagram',
                          data,
                          document.getElementById('input-title').value,
                          document.getElementById('input-subtitle').value,
                          SpL, [
                              document.getElementById('R1').checked,
                              document.getElementById('R2').checked,
                              document.getElementById('R3').checked,
                              document.getElementById('R4').checked,
                          ]
                 );
             //
             let table=document.getElementById('pTab');
             table.innerHTML ='';
             let row=table.insertRow(-1);
             let c1 = row.insertCell(-1);
             let c2 = row.insertCell(-1);
             c1.innerHTML = 'N';  c2.innerHTML = N;
             row=table.insertRow(-1); c1 = row.insertCell(-1); c2 = row.insertCell(-1);
             c1.innerHTML = 'UCL';  c2.innerHTML = sprintf('%8.4f',UCL_I);

             row=table.insertRow(-1); c1 = row.insertCell(-1); c2 = row.insertCell(-1);
             c1.innerHTML = 'IBar';  c2.innerHTML = sprintf('%8.4f ± %8.4f',IBar, UCL_I-IBar);

             row=table.insertRow(-1); c1 = row.insertCell(-1); c2 = row.insertCell(-1);
             c1.innerHTML = 'LCL';  c2.innerHTML = sprintf('%8.4f', LCL_I);

             row=table.insertRow(-1); c1 = row.insertCell(-1); c2 = row.insertCell(-1);
             c1.innerHTML = 'UCL R';  c2.innerHTML = sprintf('%8.4f', UCL_MR);
         }

         function initPage(){
             let params = {};
             location.search.substr(1).split('&').forEach(function(item){
                 let tmp = item.split('=');
                 params[tmp[0]] = decodeURIComponent(tmp[1]);
             })
             ['title', 'subtitle', 'usl', 'lsl', ].forEach(function(item){
                 if (item in params) document.getElementById('input-'+item).value  = params[item];
             })
         }
         <?php resizeHandler(); ?>
        </script>
    </body>
</html>
