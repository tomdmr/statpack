<?php
include('config/common.php')
?>
<!doctype html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <link href="<?=$CSS?>/bootstrap-5.3/css/bootstrap.min.css" rel="stylesheet">
        <link href="<?=$CSS?>/bootstrap-icons/bootstrap-icons.min.css" rel="stylesheet">
        <script src="<?=$CSS?>/bootstrap-5.3/js/bootstrap.bundle.min.js"></script>
        <script src="js/<?=$PLOTLY?>"></script>
        <script src="js/fast-stats.js"></script>
        <script src="js/sfunc.js"></script>
        <script src="js/sprintf.js"></script>
        <script src="js/readers.js"></script>
        <script src="js/d3.v7.min.js"></script>
        <style>
         .resizable {
             resize: both;
             overflow: scroll;
             border: 1px solid black;
             width: 600px;
             height: 300px;
         }
        </style>
        <title>Bland-Altman Vergleichsplot</title>
    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                <h2>Bland-Altman Vergleichsplot</h2>
                <p> Vergleich, wie gut zwei Meßmethoden übereinstimmen,
                    insbesondere Referenzmethode und Schnellmethode.
                </p>
                <p>
                    Daten müssen in geordneten Paaren für das gleiche Sample
                    vorliegen, getrennt durch Tab oder ";"
                </p>
                <p>
                    Vorzeichenregelung: Es wird die vordere Spalte von der hinteren abgezogen. Negativer Bias bedeutet also, dass die
                    vordere Methode im Mittel größere Ergebnisse erzielt.
                </p>
            </div>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-8">
                    <div class="input-group mb-3">
                        <?php inputGroup("title", "text", "Titel"); ?>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="input-xTitle">Einheit x:</span>
                        <input type="text" class="form-control" aria-label="Einheit x" aria-describedby="input-usl" id="xTitle">
                        <span class="input-group-text" id="input-yTitle">Einheit y:</span>
                        <input type="text" class="form-control" aria-label="Einheit y" aria-describedby="input-yTitle" id="yTitle">
                    </div>
                    <div class="input-group mb-3">
                        <?php inputGroup("yMin", "number", "Y-Min"); ?>
                        <?php inputGroup("yMax", "number", "Y-Max"); ?>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="input-width">Width</span>
                        <input type="number" id="cWidth" class="form-control" aria-label="" aria-describedby="input-width" value="600">
                        <span class="input-group-text" id="input-width">Height</span>
                        <input type="number" id="cHeight" class="form-control" aria-label="" aria-describedby="input-height" value="300">
                    </div>
                </div>
            </div>
            <div class="row">
                <?php btnTrigger(); ?>
            </div>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-4">
                    <table id="pTab" class="table table-bordered table-sm"></table>
                </div>
            </div>
            <?php plotlyDiagExport(); ?>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-8">
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Daten</label>
                        <textarea id="tdata" class="form-control" rows="8" cols="60"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <script>
         function makeDiag(){
             let myTitle = document.getElementById('title').value;
             let sampleData = readPairs( document.getElementById('tdata').value );
             //console.log(sampleData);

             let means = new Stats({sampling: true});
             let diffs = new Stats({sampling: true});
             for(i=0; i<sampleData[0].length; i++){
                 means.push( 0.5* (sampleData[1][i] + sampleData[0][i]));
                 diffs.push(      (sampleData[1][i] - sampleData[0][i]));
             }
             let bias = diffs.amean();
             let sd   = diffs.stddev();
             console.log("bias: %f sd: %f", bias, sd);
             console.log("tVal: %f", t_Dist(2.05, 29));
             console.log("tVal_inv: %f", Math.abs(_subt(29, 0.975)));
             let Data = {
                 type: 'scatter',
                 x: means.data,
                 y: diffs.data,
                 mode: 'markers',
                 name: 'Data',
                 showlegend: true,
                 hoverinfo: 'all',
                 marker: {
                     color: 'blue',
                     size: 8,
                     symbols: 'circle'
                 }
             }
             let lBias = {
                 type: 'scatter', mode: 'line', showlegend: true,
                 x: [1800, 1800],
                 y: [bias, bias],
             }
             let Bias = {
                 type: 'line',
                 xref: 'paper',
                 x0: 0,
                 x1: 1,
                 yref: 'y',
                 y0: bias,
                 y1: bias,
                 name: 'Bias',
                 line: {color: 'red'}
             }
             let uLOA = {
                 type: 'line',
                 xref: 'paper',
                 x0: 0,
                 x1: 1,
                 yref: 'y',
                 y0: bias+1.96*sd,
                 y1: bias+1.96*sd,
                 name: 'Bias',
                 line: {color: 'red', dash: 'dot'},
             }
             let lLOA = {
                 type: 'line',
                 xref: 'paper',
                 x0: 0,
                 x1: 1,
                 yref: 'y',
                 y0: bias-1.96*sd,
                 y1: bias-1.96*sd,
                 name: 'Bias',
                 line: {color: 'red', dash: 'dot'},
             }

             let plData = [Data];
             let Shapes = [Bias, lLOA, uLOA];
             let layout = {
                 title: {text: myTitle},
                 xaxis: {
                     title: {text: document.getElementById('xTitle').value},
                 },
                 yaxis: {
                     title: {text: document.getElementById('yTitle').value},
                 },
                 zeroline: false,
                 shapes: Shapes,
                 annotations: [
                     {
                         xref: 'paper', yref: 'y', x:1, y:bias, yanchor: 'bottom', showarrow: false,
                         text: sprintf('Bias %8.4f', bias),
                     },
                     {
                         xref: 'paper', yref: 'y', x:1, y: bias+1.96*sd, yanchor: 'bottom', showarrow: false,
                         text: sprintf('Upper LOA %8.4f', bias+1.96*sd),
                     },
                     {
                         xref: 'paper', yref: 'y', x:1, y: bias-1.96*sd, yanchor: 'bottom', showarrow: false,
                         text: sprintf('Lower LOA %8.4f', bias-1.96*sd),
                     },
                 ],
             };
             let yMin = document.getElementById('yMin').value;
             let yMax = document.getElementById('yMax').value;
             if( (yMin !=="") && (yMax !== "") ){
                 layout.yaxis.range = [yMin, yMax];
             }
             Plotly.newPlot('plotlyDiagram', plData,layout,  {editable: true, responsive: true},);

             let table = document.getElementById('pTab');
             table.innerHTML = '';
             let row = table.insertRow(-1);
             let c1 = row.insertCell(-1);
             let c2 = row.insertCell(-1);
             c1.innerHTML='N'; c2.innerHTML = sampleData[0].length;
             let se = sd/Math.sqrt(sampleData[0].length);
             let sel= sd*Math.sqrt(3/sampleData[0].length);
             console.log(se, sel);
             row = table.insertRow(-1);c1=row.insertCell(-1); c2=row.insertCell(-1);
             c1.innerHTML='Bias'; c2.innerHTML=bias;


             row = table.insertRow(-1);c1=row.insertCell(-1); c2=row.insertCell(-1);
             c1.innerHTML='uLOA'; c2.innerHTML=bias+1.96*sd;

             row = table.insertRow(-1);c1=row.insertCell(-1); c2=row.insertCell(-1);
             c1.innerHTML='lLOA'; c2.innerHTML=bias-1.96*sd;

         }
         <?php resizeHandler(); ?>
        </script>

    </body>
</html>
