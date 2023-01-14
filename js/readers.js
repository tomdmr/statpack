Array.prototype.removeIf = function(callback) {
    var i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};

function readKeyValues(inText){
    let sampleData = [];
    inText.trim().split('\n').
        forEach(function(line){
            let key='';
            let values = [];
            if(line==='') return;
            let fields = line.trim().split(/[\t;]/);
            if(fields.length > 1){
                key = fields.shift();
                fields.forEach(function(val){
                    let z = parseFloat(val.replace(',', '.'));
                    if( !isNaN(z) ) values.push(z);
                });
            }
            else{ return; }

            if(values.length>0){
                for(i=0; i<sampleData.length; i++){
                   if( sampleData[i].name === key){
                       sampleData[i].s.push(values);
                       i=sampleData.length + 2;
                   }
                }
                if(i==sampleData.length){
                    sampleData.push({
                        name: key,
                        s: new Stats({sampling: true}).push(values),
                    });
                }
            }
        });
    return sampleData;
}
function readRadar(inText){
    let first = true;
    let theta = [];
    let sampleData = [];
    inText.trim().split('\n').forEach(function(line){
        let fields=line.trim().split(/[\t;]+/);
        if(first){
            fields.forEach(function(val){
                //console.log('Item: '+val);
                theta.push(val);
            })
            theta.push(theta[0]);
            first = false;
        }
        else{
            let key = fields.shift();
            let s = []; //new Stats({sampling: true});
            //console.log('Sample key :'+key);
            fields.forEach(function(val){
                let tmp = parseFloat(val.replace(',', '.'));
                if(!isNaN(tmp)){s.push(tmp)}
            });
            s.push(s[0]);
            sampleData.push({ name: key, data: s});
        }
    });
    return [theta, sampleData];
}
function readValues(inText){
    let s = new Stats({sampling: true});
    inText.trim().split('\n').forEach(function(line){
        let fields=line.trim().split(/[\t;]+/);
        fields.forEach(function(val){
            let tmp = parseFloat(val.replace(',', '.'));
            if(!isNaN(tmp)){s.push(tmp)}
        });
    });
    return s;
}
function readKeyPairs(inText){
    let sampleData = [];
    inText.trim().split('\n').
        forEach(function(line){
            let key='';
            let values = [];
            if(line==='') return;
            let fields = line.trim().split(/[\t;]/);
            if(fields.length > 2){
                key = fields.shift();
                fields.forEach(function(val){
                    let z = parseFloat(val.replace(',', '.'));
                    if( !isNaN(z) ) values.push(z);
                });
            }
            else{ return; }

            if(values.length == 2){
                for(i=0; i<sampleData.length; i++){
                    if( sampleData[i].name === key){
                        sampleData[i].x.push(values[0]);
                        sampleData[i].y.push(values[1]);
                        i=sampleData.length + 2;
                    }
                }
                if(i==sampleData.length){
                    sampleData.push({
                        name: key,
                        x   : [values[0]],
                        y   : [values[1]],
                    });
                }
            }
        });
    return sampleData;
}
function readPairsGlob(inText){
    let sampleData = [[], []];
    let dst = 0;
    inText.trim().split(/[\n\t;]/).
           forEach(function(item){
               console.log(item);
               let z = parseFloat(item.replace(',', '.'));
               sampleData[dst].push(z);
               dst = 1-dst;
           });
    return sampleData;
}
/**
 * Read exactly two values per line
 */
function readPairs(inText){
    let sampleData = [[], []];
    let dst = 0;
    inText.trim().split(/[\n]/).
        forEach(function(item){
            //console.log(item);
            let pair = item.split(/[\t;]/);
            //console.log(pair);
            if( pair.length>1){
                let x = parseFloat(pair[0].replace(',', '.'));
                let y = parseFloat(pair[1].replace(',', '.'));
                // TODO: Check both are valid
                sampleData[0].push(x);
                sampleData[1].push(y);
            }
        });
    return sampleData;
}
async function makeImg(divName, imgName){
    let img = d3.select('#'+imgName);
    let graphDiv = document.getElementById(divName);
    let clientHeight = graphDiv.clientHeight;
    let clientWidth  = graphDiv.clientWidth;
    console.log(clientHeight+ ' ' + clientWidth);
    Plotly.toImage(graphDiv, {format: 'png', width: clientWidth, height: clientHeight}).then(function(dataUrl) {
        // use the dataUrl
        img.attr("src", dataUrl);
        //doies not work: copyImage(url);
    });
}

function cHWChange2(w, h, t){
    let W = document.getElementById(w).value;
    let H = document.getElementById(h).value;
    document.getElementById(t).setAttribute("style","Width:"+ W +'px;Height:'+ H+'px');
}
