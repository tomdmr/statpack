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
             width: 800px;
             height: 400px;
         }
         .nopadding {
             padding: 0;
             margin: 0;
         }
        </style>
        <title>Sankey-Diagram</title>
    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                <h2>Sankey Diagram</h2>
                See info here.
            </div>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-8">
                    <div class="input-group mb-3">
                        <?php inputGroup("title", "text", "Titel"); ?>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="input-width">Width</span>
                        <input type="number" id="cWidth" class="form-control" aria-label="" aria-describedby="input-width" value="600">
                        <span class="input-group-text" id="input-width">Height</span>
                        <input type="number" id="cHeight" class="form-control" aria-label="" aria-describedby="input-height" value="300">
                    </div>
                </div><!-- col-md-8 -->
                

            </div>
            <div class="row">
                <div class="col-md-1"></div>
                <div class="col-md-8">
                    <div class="mb-3">
                        <label for="exampleFormControlTextarea1" class="form-label">Daten</label>
                        <textarea id="tdata" class="form-control" rows="8" cols="60"></textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <?php btnTrigger(); ?>
            </div>
        </div>
        <p>
            <div id='myDiv' class="resizable" onresize="doResize(this)"></div>
            <br>
        </p>
        <img id="jpg-export"></img>
    </body>
    <script>
     function loadJSON(filename, callback) {   
         var xobj = new XMLHttpRequest();
         xobj.overrideMimeType("application/json");
         // Replace 'my_data' with the path to your file
         xobj.open('GET', filename, false);
         xobj.onreadystatechange = function () {
             if (xobj.readyState == 4 && xobj.status == "200") {
                 // Required use of an anonymous callback as
                 // .open will NOT return a value but simply
                 // returns undefined in asynchronous mode
                 callback(xobj.responseText);
             }
         };
         xobj.send(null);  
     }
     /**
        Helper functions to simplify entry of flow data.
        First variable is the list that holds the principal data,
        src and dst are the names of the two nodes, and amount is the
        value flowing from src to dst.
      */

     function enter_pair(list, src, dst, amount){
         list.push({src: src, dst: dst, amount: amount});
     }
     /**
      *   Re-arange data from list above into nodes and link, so 
      *   that it can be munched by plotly.
      */
     function gobble(list, nodes, link){
         list.forEach(function(entry){
             if(-1== nodes.indexOf(entry.src)){
                 nodes.push(entry.src);
             }
             if(-1== nodes.indexOf(entry.dst)){
                 nodes.push(entry.dst);
             }
             let si = nodes.indexOf(entry.src);
             let di = nodes.indexOf(entry.dst);
             link.source.push(si);
             link.target.push(di);
             link.value.push(entry.amount);
         });
     }
     function makeDiag(){
         let values = [];
         let link   = { source: [], target: [], value: [] };
         let label  = [];
         let nodes  = [];

         let title = document.getElementById('title').value;
         let tdata = document.getElementById('tdata').value.split('\n');
         console.log(title);
         //console.log(tdata);
         tdata.forEach(function(line){
             // Check for '#'
             let wLine = line.split('#')[0];
             // Separator: Semikolon, Tab, oder Pipe
             let cells = wLine.split(RegExp('[;|/\t]'));
             //console.log('Entries: '+cells[0]+', '+cells[1]+', '+cells[2]);
             if(cells.length == 3){
                 enter_pair(values, cells[0], cells[1], Number(cells[2]));
             }
         });
         gobble(values, nodes, link);
         var layout = {"title": {text: title}}
         Plotly.newPlot('myDiv',
                        [{
                            type: "sankey",
                            arrangement: 'freeform',
                            domain: {
                                x: [0,1],
                                y: [0,1]
                            },
                            valueformat: ".1f",
                            valuesuffix: "t/h",
                            node:{
                                label: nodes,
                                pad:10, // 10 Pixels
                            },
                            link: link,
                        }],
                        layout,
                        {editable: true, responsive: true},
         );
     }
     <?php resizeHandler(); ?>
    </script>
</html>
