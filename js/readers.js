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
    // Split into lines
    //let tdata = inText.split('\n');
    inText.trim().split('\n').
           forEach(function(line){
               //console.log(line);
               let fields=line.trim().split(/[\t;]+/);
               if(fields.length>1){
                   key = fields.shift();
                   fields.forEach(function(val, idx, fields){
                       if (val !==''){
                           fields[idx] =  parseFloat(val.replace(',', '.'));
                       }
                   });
               }
               // Remove all invalid elements
               fields.removeIf(function(item){ return isNaN(item); });
               // Run through sampleData and search key
               for(i=0; i<sampleData.length; i++){
                   if( sampleData[i].name === key){
                       sampleData[i].s.push(fields);
                       i=sampleData.length + 2;
                   }
               }
               // If we reached the end of the previous loop, this means
               // key and fields are new
               if(i==sampleData.length){
                   sampleData.push({
                       name: key,
                       s: new Stats({sampling: true}).push(fields),
                   });
               }
           });
    return sampleData;
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
