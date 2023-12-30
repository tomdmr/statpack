Array.prototype.removeIf = function(callback) {
    var i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};

Array.prototype.sample = function(num){
    return this.map(
        a => [a,Math.random()])
               .sort((a,b) => {return a[1] < b[1] ? -1 : 1;})
               .slice(0,num)
               .map(a => a[0]);
};

/**
 * Read a long string and split it into a ('key', value, value, ...) structure
 */
function readKeyValues(inText){
    let sampleData = [];
    // Prepare text, trim leading/trailing space, split by '\n'
    inText.trim().split('\n').
           forEach(function(line){
               let key='';
               let values = [];
               // empty line, bail out
               if(line==='') return;
               // Split by tab
               let fields = line.trim().split(/[\t;]/);
               if(fields.length > 1){
                   key = fields.shift();
                   // Parse all remaining values and push them into z
                   fields.forEach(function(val){
                       let z = parseFloat(val.replace(',', '.'));
                       if( !isNaN(z) ) values.push(z);
                   });
               }
               else{
                   return;
               }
               // parsed one line.
               if(values.length>0){
                   for(i=0; i<sampleData.length; i++){
                       if( sampleData[i].name === key){
                           sampleData[i].s.push(values);
                           // We found the key, increase i so that
                           // we exit the for-loop
                           i=sampleData.length + 2;
                       }
                   }
                   // If we found the key above then i>sampleData.length
                   // if the key is new, i==sampleData.length
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
        let fields=line.trim().split(/[\t; ]+/);
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

/**
 * Main Reader function for HK-dashboard
 * Input needs to be formed like this:
 * key;cheesefat#;dummy;dummy;dummy;pH;TS;Fett;FiTr;Salz;dummy;Prot
 *
 * On return, the data is a dict by key;
 * sampleData: {
 * key: {
 *   kf: {
 *     pH: value, TS: value; Fett: value; FiTr: value; ...
 *   },
 *   kf: ...
 * }
 * key: { ... }
 */
function dashboardHKReader(inText){
    let sampleData = {}
    inText.trim().split('\n').
           forEach(function(line){
               let key= ''
               let values = [];
               if (line ==='') return;
               let fields = line.trim().split(/[\t;]/);
               key = fields.shift();
               if( Number.isInteger(key-0) ) key = key-0;
               kf  = fields.shift();
               if( kf === '') return;
               if( fields.length > 8){
                   if (!(key in sampleData))      sampleData[key]    = {};
                   if (!(kf  in sampleData[key])) sampleData[key][kf]= {}
                   if(fields[ 3] !=='') sampleData[key][kf].pH   = parseFloat((fields[ 3].replace(',', '.')));
                   if(fields[ 4] !=='') sampleData[key][kf].TS   = parseFloat((fields[ 4].replace(',', '.')));
                   if(fields[ 5] !=='') sampleData[key][kf].Fett = parseFloat((fields[ 5].replace(',', '.')));
                   if(fields[ 6] !=='') sampleData[key][kf].FiTr = parseFloat((fields[ 6].replace(',', '.')));
                   if(fields[ 7] !=='') sampleData[key][kf].Salz = parseFloat((fields[ 7].replace(',', '.')));
                   if(fields[ 9] !=='') sampleData[key][kf].Prot = parseFloat((fields[ 9].replace(',', '.')));
               }
           });
    //console.log(sampleData);
    return sampleData;
}
/**
 *
 * Input needs to be formed like this:
 * key;cheesefat#;dummy;dummy;dummy;pH;dummy;TS;Fett;FiTr;Salz;dummy;Prot
 * The difference to the general HK: pH is the pH after blockformers. Usually, one line has th pH,
 * the next line all the rest.
 *
 * On return, the data is a dict by key;
 * sampleData: {
 * key: {
 *   kf: {
 *     pH: value, TS: value; Fett: value; FiTr: value; ...
 *   },
 *   kf: ...
 * }
 * key: { ... }
 */
function dashboardCagReader(inText){
    let sampleData = {}
    inText.trim().split('\n').
           forEach(function(line){
               let key= ''
               let values = [];
               if (line ==='') return;
               let fields = line.trim().split(/[\t;]/);
               if( Number.isInteger(key-0) ) key = key-0;
               kf  = fields.shift();
               if( kf === '') return;
               if (!(key in sampleData))     sampleData[key]    = {};
               if (!(kf in sampleData[key])) sampleData[key][kf]= {};
               if ( (fields.length >3)&& fields[3] !=='')
                   sampleData[key][kf].pHnT = parseFloat((fields[3].replace(',', '.')));
               if( fields.length > 11){
                   if(fields[ 5] !=='') sampleData[key][kf].TS   = parseFloat((fields[ 5].replace(',', '.')));
                   if(fields[ 6] !=='') sampleData[key][kf].Fett = parseFloat((fields[ 6].replace(',', '.')));
                   if(fields[ 7] !=='') sampleData[key][kf].FiTr = parseFloat((fields[ 7].replace(',', '.')));
                   if(fields[ 8] !=='') sampleData[key][kf].Salz = parseFloat((fields[ 8].replace(',', '.')));
                   if(fields[11] !=='') sampleData[key][kf].Prot = parseFloat((fields[11].replace(',', '.')));
               }
               //sampleData[key][
           });
    console.log(sampleData);
    return sampleData;
}

