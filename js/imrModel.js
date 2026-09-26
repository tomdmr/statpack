/**
*/
function getIMRValues(data){
    let s = new Stats({sampling: true});
    let MR = [];
    for(let i=1; i<data.data.length; i++){
        let dx = Math.abs(data.data[i]-data.data[i-1]);
        s. push(dx);
        MR.push(dx);
    }
    let IBar   =  data.amean();
    let MRBar  =  s.amean();

    let LCL_MR = 0.0;
    let UCL_MR = 3.267 * MRBar;
    let LCL_I  = IBar - 2.66*MRBar;
    let UCL_I  = IBar + 2.66*MRBar;
    return {'MR': MR, 'LCL_MR': LCL_MR, 'UCL_MR': UCL_MR, 'LCL_I': LCL_I, 'IBar': IBar, 'UCL_I': UCL_I};
}
/**
 */
function IMRRulesCheck(stats, mean, stddev, doRules=null){
    let is1Dev = [];
    let is2Dev = [];
    let is3Dev = [];
    let r4Sum  = 0;
    let r4Sign = 0;
    let rule1  = [];
    let rule2  = [];
    let rule3  = [];
    let rule4  = [];
    stats.data.forEach(function(sample, idx){
        //console.log(sprintf('Idx: %2d Value: %f', idx, sample));
        is1Dev[idx] = Math.abs(sample - mean)>   stddev? true : false;
        is2Dev[idx] = Math.abs(sample - mean)>2.*stddev? true : false;
        is3Dev[idx] = Math.abs(sample - mean)>3.*stddev? true : false;
        r4Sum = Math.sign(sample - mean) == r4Sign ? r4Sum + 1 : 0;
        r4Sign = Math.sign(sample - mean);
        let doR1 = true;
        if(doRules) let doR2 = doRules[1];
        if(doRules) let doR3 = doRules[2];
        if(doRules) let doR4 = doRules[3];
        if(doR1){
            rule1[idx] = is3Dev[idx];
        }
        if(doR2){
            rule2[idx] = (idx>1) && ( is2Dev[idx-2] + is2Dev[idx-1] + is2Dev[idx] >1)
            if(rule2[idx]){
                rule3[idx-1] = rule3[idx-2] = true;
            }
        }
        if(doR3){
            rule3[idx] = (idx>3) && ( is1Dev[idx-4] + is1Dev[idx-3] + is1Dev[idx-2] + is1Dev[idx-1] + is1Dev[idx]>3 );
            if(rule3[idx]){
                rule3[idx-1] = rule3[idx-2] = rule3[idx-3] = true;
            }
        }
        if(doR4){
            rule4[idx] = r4Sum > 7;
            if(rule4[idx]){
                rule4[idx-1] = rule4[idx-2] = rule4[idx-3] = rule4[idx-3] = rule4[idx-5] = rule4[idx-6] = rule4[idx-7] = true;
            }
        }
        /*
           if(rule1[idx]) console.log('Rule 1: '+idx);
           if(rule2[idx]) console.log('Rule 2: '+idx);
           if(rule3[idx]) console.log('Rule 3: '+idx);
           if(rule4[idx]) console.log('Rule 4: '+idx);
         */
    });
    return [rule1, rule2, rule3, rule4];
}

function IMRChart(divName, data, myTitle, SL, annotations){
    let IMR_Result = getIMRValues(data);
    let rr = IMRRulesCheck(data, IMR_Result.IBar, (IMR_Result.UCL_I-IMR_Result.LCL_I)/6.0);

    let IViol = {x: [], y:[]};
    data.data.forEach(function(val, idx){
        if( rr[0][idx] || rr[1][idx] || rr[2][idx] || rr[3][idx] ){
            IViol.x.push(idx+1);
            IViol.y.push(val);
        }
    });


    let Data = {
        type: 'scatter',
        x: Array.from({length: data.length}, (_, i) => i + 1),
        y: data.data,
        mode: 'lines+markers',
        name: 'Data n='+data.data.length,
        showlegend: true,
        hoverinfo: 'all',
        line: { color: 'blue', width: 2 },
        marker: { color: 'blue', size: 8, symbol: 'circle' }
    }
    if(typeof annotations != 'undefined'){
        Data.text=annotations;
    }
    let Viol = {
        type: 'scatter',
        x: IViol.x,
        y: IViol.y,
        mode: 'markers',
        name: 'Violations',
        showlegend: true,
        marker: { color: 'rgb(255,65,54)', line: {width: 3}, opacity: 0.5, size: 12, symbol: 'circle-open' }
    }
    // Control Limits
    let CL = {
        type: 'scatter',
        x: [0.5, data.data.length, null, 0.5, data.data.length],
        //y: [-5, -5, null, 5, 5],
        y: [IMR_Result.LCL_I, IMR_Result.LCL_I, null, IMR_Result.UCL_I, IMR_Result.UCL_I],
        mode: 'lines',
        name: 'LCL/UCL ±' + sprintf("%.2f", IMR_Result.IBar-IMR_Result.LCL_I),
        showlegend: true,
        line: { color: 'red', width: 2, dash: 'dash' }
    }
    // Centerline
    let Centre = {
        type: 'scatter',
        x: [0.5, data.data.length],
        y: [IMR_Result.IBar,IMR_Result.IBar],
        //[ 0, 0],
        mode: 'lines',
        name: 'Centre ' + sprintf("%.2f", IMR_Result.IBar),
        showlegend: true,
        line: { color: 'grey', width: 2 }
    }

    let MRMR = {
        type: 'scatter',
        x: Array.from({length: data.length}, (_, i) => i + 1).slice(1),
        y: IMR_Result.MR,
        name: 'MR',
        mode: 'lines+markers',
        line: { color: 'blue', width: 2 },
        marker: { color: 'blue', size: 8, symbol: 'circle' },
        xaxis: 'x1',
        yaxis: 'y2',
    }
    let MRCL = {
        type: 'scatter',
        x: [0.5, data.length, ],
        y: [IMR_Result.UCL_MR, IMR_Result.UCL_MR],
        mode: 'lines',
        name: 'MR-UCL',
        showlegend: true,
        line: { color: 'red', width: 2, dash: 'dash' },
        xaxis: 'x1',
        yaxis: 'y2',
    }
    let plData = [Data, Viol, CL, Centre, MRMR, MRCL];
    if( SL.length ){
        plData.push({
            type: 'scatter',
            x: [0.5, data.data.length, null, 0.5, data.data.length],
            y: [SL[0], SL[0], null, SL[1], SL[1]],
            mode: 'lines',
            name: 'LSL/USL',
            showlegend: true,
            line: { color: 'red', width: 2, }
        });
    }
    let layout = {
        title: myTitle,
        grid: {rows: 2, columns: 1,},
        xaxis: { zeroline: false },
        yaxis: { zeroline: false },
    }
    Plotly.newPlot(divName, plData, layout,  {editable: true, responsive: true},);
}
