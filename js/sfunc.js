function LogGamma(Z) {
	with (Math) {
		var S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)
            -1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
		var LG= (Z-.5)*log(Z+4.5)-(Z+4.5)+log(S*2.50662827465);
	}
	return LG
}

function Betinc(X,A,B) {
	var A0=0;
	var B0=1;
	var A1=1;
	var B1=1;
	var M9=0;
	var A2=0;
	var C9;
	while (Math.abs((A1-A2)/A1)>.00001) {
		A2=A1;
		C9=-(A+M9)*(A+B+M9)*X/(A+2*M9)/(A+2*M9+1);
		A0=A1+C9*A0;
		B0=B1+C9*B0;
		M9=M9+1;
		C9=M9*(B-M9)*X/(A+2*M9-1)/(A+2*M9);
		A1=A0+C9*A1;
		B1=B0+C9*B1;
		A0=A0/B1;
		B0=B0/B1;
		A1=A1/B1;
		B1=1;
	}
	return A1/A
}


function t_Dist(t, nu) {
    X=t;
    df=nu;
    with (Math) {
		if (df<=0) {
			alert("Degrees of freedom must be positive")
		} else {
			A=df/2;
			S=A+.5;
			Z=df/(df+X*X);
			BT=exp(LogGamma(S)-LogGamma(.5)-LogGamma(A)+A*log(Z)+.5*log(1-Z));
			if (Z<(A+1)/(S+2)) {
				betacdf=BT*Betinc(Z,A,.5)
			} else {
				betacdf=1-BT*Betinc(1-Z,.5,A)
			}
			if (X<0) {
				tcdf=betacdf/2
			} else {
				tcdf=1-betacdf/2
			}
		}
		tcdf=round(tcdf*100000)/100000;
	}
    return tcdf;
}

function _subu (p) {
	var y = -Math.log(4 * p * (1 - p));
	var x = Math.sqrt(
		y * (1.570796288
		  + y * (.03706987906
		  	+ y * (-.8364353589E-3
			  + y *(-.2250947176E-3
			  	+ y * (.6841218299E-5
				  + y * (0.5824238515E-5
					+ y * (-.104527497E-5
					  + y * (.8360937017E-7
						+ y * (-.3231081277E-8
						  + y * (.3657763036E-10
							+ y *.6936233982E-12)))))))))));
	if (p>.5)
                x = -x;
	return x;
}
function _subt (n, p) {

	if (p >= 1 || p <= 0) {
		throw("Invalid p: p\n");
	}

	if (p == 0.5) {
		return 0;
	} else if (p < 0.5) {
		return - _subt(n, 1 - p);
	}

	var u = _subu(p);
	var u2 = Math.pow(u, 2);

	var a = (u2 + 1) / 4;
	var b = ((5 * u2 + 16) * u2 + 3) / 96;
	var c = (((3 * u2 + 19) * u2 + 17) * u2 - 15) / 384;
	var d = ((((79 * u2 + 776) * u2 + 1482) * u2 - 1920) * u2 - 945) 
				/ 92160;
	var e = (((((27 * u2 + 339) * u2 + 930) * u2 - 1782) * u2 - 765) * u2
			+ 17955) / 368640;

	var x = u * (1 + (a + (b + (c + (d + e / n) / n) / n) / n) / n);

	if (n <= Math.pow(Math.log10(p), 2) + 3) {
		var round;
		do { 
			var p1 = _subtprob(n, x);
			var n1 = n + 1;
			var delta = (p1 - p) 
				/ Math.exp((n1 * Math.log(n1 / (n + x * x)) 
					+ Math.log(n/n1/2/Math.PI) - 1 
					+ (1/n1 - 1/n) / 6) / 2);
			x += delta;
			round = round_to_precision(delta, Math.abs(integer(log10(Math.abs(x))-4)));
		} while ((x) && (round != 0));
	}
	return x;
}


function Gcf(X,A) {        // Good for X>A+1
	with (Math) {
		var A0=0;
		var B0=1;
		var A1=1;
		var B1=X;
		var AOLD=0;
		var N=0;
		while (abs((A1-AOLD)/A1)>.00001) {
			AOLD=A1;
			N=N+1;
			A0=A1+(N-A)*A0;
			B0=B1+(N-A)*B0;
			A1=X*A0+N*A1;
			B1=X*B0+N*B1;
			A0=A0/B1;
			B0=B0/B1;
			A1=A1/B1;
			B1=1;
		}
		var Prob=exp(A*log(X)-X-LogGamma(A))*A1;
	}
	return 1-Prob
}

function Gser(X,A) {        // Good for X<A+1.
    with (Math) {
		var T9=1/A;
		var G=T9;
		var I=1;
		while (T9>G*.00001) {
			T9=T9*X/(A+I);
			G=G+T9;
			I=I+1;
		}
		G=G*exp(A*log(X)-X-LogGamma(A));
    }
    return G
}

function Gammacdf(x,a) {
	var GI;
	if (x<=0) {
		GI=0
	} else if (x<a+1) {
		GI=Gser(x,a)
	} else {
		GI=Gcf(x,a)
	}
	return GI
}

function chi_square(Z, DF) {
	if (DF<=0) {
		alert("Degrees of freedom must be positive")
	} else {
		Chisqcdf=Gammacdf(Z/2,DF/2)
	}
	Chisqcdf=Math.round(Chisqcdf*100000)/100000;
    return Chisqcdf;
}
function normalcdf(X){   //HASTINGS.  MAX ERROR = .000001
	var T=1/(1+.2316419*Math.abs(X));
	var D=.3989423*Math.exp(-X*X/2);
	var Prob=D*T*(.3193815+T*(-.3565638+T*(1.781478+T*(-1.821256+T*1.330274))));
	if (X>0) {
		Prob=1-Prob
	}
	return Prob
}   

function compute(Z, M, SD) {
    with (Math) {
		if (SD<0) {
			alert("The standard deviation must be nonnegative.")
		} else if (SD==0) {
		    if (Z<M){
		        Prob=0
		    } else {
			    Prob=1
			}
		} else {
			Prob=normalcdf((Z-M)/SD);
			Prob=round(100000*Prob)/100000;
		}
	}
    return Prob;
}

function random_bm(){
    let u=0.0, v=0.0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0*Math.log(u)) * Math.cos(2.0*Math.PI * v);
}

function gaussian(mu, sigma){
    return sigma*random_bm() + mu;
}
/**
   Compute linear regression of x and y. Return a,b, r (not r^2)
 */
function linearRegression(x, y){
    let sXY =sX = sY = sX2 = sY2 = 0;
    let n = x.length;
    for(let i=0; i<n; i++){
        sX  += x[i];
        sX2 += x[i]*x[i];
        sY  += y[i];
        sXY += x[i]*y[i];
        sY2 += y[i]*y[i];
    }
    //console.log(sX);
    //console.log(sY);
    let b = (n*sXY -sX*sY)/(n*sX2-sX*sX);
    let a = (sY-b*sX)/n;
    let r = (sXY-sX*sY/n)/Math.sqrt((sX2-sX*sX/n)*(sY2-sY*sY/n));
    return {
        n: n,
        a: a,
        b: b,
        r: r,
        sX: sX,
        sX2: sX2,
        sY: sY,
        sY2: sY2,
        sXY: sXY
    };
}
function quadRegression(x, y){
    let sXY =sX = sY = sX2 = sY2 = 0;
    let n = x.length;
    for(let i=0; i<n; i++){
        let x2 = x[i]*x[i];
        let x3 = x[i]*x2;
        let x4 = x[i]*x3;

        sX   += x[i];
        sX2  += x2;
        sX3  += x3;
        sX4  += x4;

        sXY  += x[i]*y[i];
        sX2Y += x2  *y[i];
    }
    let qXX = sX2 - sX*sX/n;
    let qXY = sXY -sX*sY/n;
    let qX3 = sX3 - sX *sX2/n;
    let qX4 = sX4 -sX2*sX2/n;
    let qX2Y = sX2Y - sY * sX2/n;
    let c = qXY*qX3*qX2Y*qX2/(qX3*qX3-qX2*qX4);
    let b = (qXY-c*qX3)/qX2;
    let a = (sY-b*sX-c*sX2)/n;
    return { a:a, b:b, c:c};
}
