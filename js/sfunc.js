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
