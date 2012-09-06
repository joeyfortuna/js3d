var hexval=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
var bgRGB=[0,0,0];

var iSteps=0;


function setBGColor(strBG) {
	bgRGB=getRGB(strBG);	
	document.body.style.backgroundColor=strBG;
}

function setSteps(tSteps) {
	iSteps=tSteps;
}

function getHex(r,g,b) {
	r1=r%16;
	if (r1==0) r2=r/16;
	else r2=(r-r1)/16;
	g1=g%16;
	if (g1==0) g2=g/16;
	else g2=(g-g1)/16;
	b1=b%16;
	if (b1==0) b2=b/16;
	else b2=(b-b1)/16;
	strHex="#"+hexval[r2]+hexval[r1]+hexval[g2]+hexval[g1]+hexval[b2]+hexval[b1];
	return strHex
}

function getDec(str) {
	var i=0;
	for (i=0;i<hexval.length;i++) {
		if (hexval[i].toLowerCase()==str) return i;
	}
	return -1;

}
function getRGB(strHex) {
	var rgb=[0,0,0];
	var strR,strG,strB;
	var d1,d2;
	
	if (strHex.indexOf("#")==0) strHex=strHex.substring(1);	
	strHex=strHex.toLowerCase();
	while (strHex.length<6) {
		strHex=strHex+"0";
	}
	if (strHex.length>6) strHex=strHex.substring(0,6);
		
	
	strR=strHex.substring(0,2);
	strG=strHex.substring(2,4);
	strB=strHex.substring(4,6);
	
	
	d1=getDec(strR.charAt(0))*16;
	d2=getDec(strR.charAt(1));
	rgb[0]=d1+d2;
	
	
	d1=getDec(strG.charAt(0))*16;
	d2=getDec(strG.charAt(1));
	rgb[1]=d1+d2;
	
	
	d1=getDec(strB.charAt(0))*16;
	d2=getDec(strB.charAt(1));
	rgb[2]=d1+d2;
	
	return rgb;
}

function getGrad(colr,indx) {
	var cRGB=getRGB(colr);
	var dr,dg,db;
	dr=bgRGB[0]-cRGB[0];
	dg=bgRGB[1]-cRGB[1];
	db=bgRGB[2]-cRGB[2];
	
	dr=cRGB[0]+Math.floor((dr/iSteps)*indx);
	dg=cRGB[1]+Math.floor((dg/iSteps)*indx);
	db=cRGB[2]+Math.floor((db/iSteps)*indx);
	
	return getHex(dr,dg,db);
}